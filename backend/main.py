import os
import warnings
from functools import lru_cache
from typing import Any, Callable

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from statsmodels.tsa.arima.model import ARIMA

from auth import router as auth_router, initialize_auth_database


app = FastAPI()
initialize_auth_database()
app.include_router(auth_router)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "final_dataset.csv")
MIN_OBSERVATIONS = 90
MAX_TRAINING_DAYS = 730
VALIDATION_DAYS = 30

df = pd.read_csv(DATASET_PATH)
df["Date"] = pd.to_datetime(df["Date"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "https://frontend-mannat2.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    center: str
    commodity: str
    days: int = Field(ge=1, le=30)


@app.get("/")
def home() -> dict[str, str]:
    return {"message": "Agricultural Price Prediction API is running!"}


@app.get("/available-options")
def get_available_options() -> list[dict[str, Any]]:
    """Only show series with enough actual observations for a meaningful test."""
    options = df.groupby(["centre_name", "commodity_name"])["Date"].nunique().reset_index(name="count")
    return options.loc[options["count"] >= MIN_OBSERVATIONS, ["centre_name", "commodity_name"]].to_dict(orient="records")


@lru_cache(maxsize=1)
def _dashboard_stats() -> dict[str, Any]:
    """Summarise the dataset shown on the dashboard without hard-coded figures."""
    grouped = df.groupby(["centre_name", "commodity_name"])
    observations = grouped["Date"].nunique()
    eligible = observations[observations >= MIN_OBSERVATIONS]

    movements: list[float] = []
    for _, market_data in grouped:
        daily = market_data.groupby("Date")["price"].mean().sort_index()
        if len(daily) < 2:
            continue
        latest_date = daily.index.max()
        comparison_date = latest_date - pd.Timedelta(days=30)
        previous = daily.loc[daily.index <= comparison_date]
        if not previous.empty and previous.iloc[-1] != 0:
            movements.append((daily.iloc[-1] - previous.iloc[-1]) / previous.iloc[-1] * 100)

    return {
        "markets": int(df["centre_name"].nunique()),
        "commodities": int(df["commodity_name"].nunique()),
        "forecastSeries": int(len(eligible)),
        "average30DayMovement": round(float(np.mean(movements)), 2) if movements else None,
        "lastUpdated": df["Date"].max().strftime("%Y-%m-%d"),
    }


@app.get("/dashboard-stats")
def get_dashboard_stats() -> dict[str, Any]:
    return _dashboard_stats()


def _daily_series(prices: pd.Series) -> pd.Series:
    """Create a calendar-day series without using future values to fill gaps."""
    series = prices.groupby(level=0).mean().sort_index().astype(float)
    calendar_index = pd.date_range(series.index.min(), series.index.max(), freq="D")
    # Markets can be closed on weekends/holidays. Forward filling represents the
    # latest known price; interpolation would leak future values into validation.
    return series.reindex(calendar_index).ffill()


def _naive_forecast(training: np.ndarray, steps: int) -> np.ndarray:
    return np.full(steps, training[-1], dtype=float)


def _drift_forecast(training: np.ndarray, steps: int) -> np.ndarray:
    """A robust trend baseline based only on the most recent four weeks."""
    window = min(28, len(training))
    slope = np.polyfit(np.arange(window), training[-window:], 1)[0]
    return training[-1] + slope * np.arange(1, steps + 1)


def _arima_forecast(order: tuple[int, int, int]) -> Callable[[np.ndarray, int], np.ndarray]:
    def forecast(training: np.ndarray, steps: int) -> np.ndarray:
        trend = "t" if order[1] else "ct"
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            fit = ARIMA(
                training,
                order=order,
                trend=trend,
                enforce_stationarity=True,
                enforce_invertibility=True,
            ).fit()
        return np.asarray(fit.forecast(steps=steps), dtype=float)

    return forecast


# A small candidate set avoids slow, over-parameterized fits. A trailing holdout
# test below chooses the appropriate model for each market and commodity.
CANDIDATES: list[tuple[str, str, Callable[[np.ndarray, int], np.ndarray]]] = [
    ("Naive", "last observed price", _naive_forecast),
    ("Drift", "recent 28-day linear trend", _drift_forecast),
    ("ARIMA", "(1,0,0)", _arima_forecast((1, 0, 0))),
    ("ARIMA", "(1,1,0)", _arima_forecast((1, 1, 0))),
    ("ARIMA", "(0,1,1)", _arima_forecast((0, 1, 1))),
    ("ARIMA", "(1,1,1)", _arima_forecast((1, 1, 1))),
]


def _mae(actual: np.ndarray, predicted: np.ndarray) -> float:
    return float(np.mean(np.abs(actual - predicted)))


def _select_model(series: pd.Series) -> tuple[str, str, Callable[[np.ndarray, int], np.ndarray], float, float, int]:
    """Choose the lowest-MAE candidate using unseen trailing calendar days."""
    recent = series.iloc[-MAX_TRAINING_DAYS:].to_numpy(dtype=float)
    holdout = min(VALIDATION_DAYS, max(7, len(recent) // 5))
    train, actual = recent[:-holdout], recent[-holdout:]
    if len(train) < 45:
        raise ValueError("At least 45 calendar days are required after reserving validation data.")

    scores: list[tuple[float, str, str, Callable[[np.ndarray, int], np.ndarray]]] = []
    for name, order, make_forecast in CANDIDATES:
        try:
            predicted = make_forecast(train, holdout)
            if np.isfinite(predicted).all():
                scores.append((_mae(actual, predicted), name, order, make_forecast))
        except (ValueError, np.linalg.LinAlgError, OverflowError):
            continue
    if not scores:
        raise ValueError("No forecasting candidate could be fitted to this series.")

    validation_mae, name, order, make_forecast = min(scores, key=lambda item: item[0])
    baseline_mae = next(score for score, candidate, _, _ in scores if candidate == "Naive")
    return name, order, make_forecast, validation_mae, baseline_mae, holdout


@lru_cache(maxsize=512)
def _forecast_for_request(center: str, commodity: str, days: int) -> dict[str, Any]:
    filtered = df.loc[
        (df["centre_name"] == center) & (df["commodity_name"] == commodity),
        ["Date", "price"],
    ].copy()
    if filtered.empty:
        raise LookupError("No data exists for this centre and commodity.")

    observed = filtered.groupby("Date")["price"].mean().sort_index().astype(float)
    if len(observed) < MIN_OBSERVATIONS:
        raise ValueError(f"At least {MIN_OBSERVATIONS} historical observations are required.")
    series = _daily_series(observed)
    name, order, make_forecast, validation_mae, baseline_mae, holdout = _select_model(series)
    training = series.iloc[-MAX_TRAINING_DAYS:].to_numpy(dtype=float)
    forecast = make_forecast(training, days)
    if not np.isfinite(forecast).all():
        name, order, forecast = "Naive", "last observed price (fallback)", _naive_forecast(training, days)

    last_date = series.index.max()
    return {
        "center": center,
        "commodity": commodity,
        "days": days,
        "history": [
            {"date": date.strftime("%Y-%m-%d"), "price": round(float(price), 2)}
            for date, price in series.tail(30).items()
        ],
        "modelInfo": {
            "name": name,
            "order": order,
            "description": "Selected per market and commodity using a trailing holdout backtest.",
            "validationMae": round(validation_mae, 2),
            "naiveMae": round(baseline_mae, 2),
            "validationDays": holdout,
            "trainingObservations": len(observed),
        },
        "predictions": [
            {
                "day": day,
                "date": (last_date + pd.Timedelta(days=day)).strftime("%Y-%m-%d"),
                "price": round(float(price), 2),
            }
            for day, price in enumerate(forecast, start=1)
        ],
    }


@app.post("/predict")
def predict(request: PredictionRequest) -> dict[str, Any]:
    try:
        return _forecast_for_request(request.center, request.commodity, request.days)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
