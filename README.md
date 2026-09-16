# Agricultural Commodity Price Forecasting

A full-stack web application for exploring short-term agricultural commodity price forecasts by market centre and commodity. The project combines a FastAPI forecasting API with a Next.js dashboard, authentication screens, historical price charts, and transparent validation metrics.

> **Data notice:** The bundled dataset covers historical observations from 1997 to **28 April 2015**. This application is a historical forecasting and decision-support project, not a live-market price service.

## Highlights

- Select a market centre, commodity, and 1–30 day forecast horizon.
- Uses market-specific time series rather than mixing commodities or centres.
- Regularizes irregular observations to calendar days using forward fill, avoiding future-data leakage.
- Compares Naive, Drift, and compact ARIMA candidates on a trailing holdout period.
- Selects the candidate with the lowest validation MAE for each market/commodity series.
- Displays the chosen model and its validation MAE against the last-price baseline.
- Caches repeated forecast requests for responsive API behaviour.
- Includes FastAPI-based authentication endpoints backed by SQLite.

## Forecasting approach

For each requested market centre and commodity:

1. At least 90 genuine dated observations are required.
2. Missing calendar dates are forward-filled with the latest known price. This is suitable for market closures and does not use a later value to fill an earlier gap.
3. The most recent 730 calendar days are retained.
4. The final 7–30 days are withheld for validation.
5. The following candidates are evaluated using mean absolute error (MAE):
   - Naive: repeat the last observed price
   - Drift: extrapolate the recent 28-day trend
   - ARIMA(1,0,0), ARIMA(1,1,0), ARIMA(0,1,1), and ARIMA(1,1,1)
6. The model with the lowest holdout MAE is refit on all retained data and used for the requested horizon.

This is intentionally a compact candidate set: it prevents the slow, unstable high-order ARIMA fit previously used by the API. A simple baseline is allowed to win; the app does not present ARIMA as better when the data does not support that conclusion.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Forecasting | Pandas, NumPy, Statsmodels ARIMA |
| Authentication | SQLite, `pwdlib` |

## Project structure

```text
.
├── backend/
│   ├── main.py              # FastAPI routes and adaptive forecasting pipeline
│   └── auth.py              # Authentication routes and SQLite helpers
├── datasets/
│   └── final_dataset.csv    # Historical centre/commodity price data
├── frontend/
│   ├── app/                 # Next.js routes
│   └── components/          # Dashboard, form, chart, and UI components
└── requirements.txt         # Python backend dependencies
```

## Getting started

### Prerequisites

- Python 3.10 or newer
- Node.js 18 or newer
- npm

### 1. Start the backend

From the repository root, create and activate a virtual environment if desired, then install the Python dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start FastAPI from the `backend` directory:

```powershell
cd backend
python -m uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`. Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
```

Create `frontend/.env.local` with the backend URL:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Then run the development server:

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

## API overview

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/available-options` | Lists market/commodity pairs with adequate history |
| `POST` | `/predict` | Produces a 1–30 day adaptive forecast |
| `POST` | `/auth/signup` | Creates an account |
| `POST` | `/auth/login` | Authenticates a user |
| `POST` | `/auth/forgot-password` | Starts password reset flow |
| `POST` | `/auth/reset-password` | Completes password reset flow |

Example forecast request:

```json
{
  "center": "CHENNAI",
  "commodity": "Onion",
  "days": 7
}
```

The response includes `modelInfo.validationMae`, `modelInfo.naiveMae`, and `modelInfo.validationDays` so a user can see how the selected model performed on unseen historical data.

## Verification

Run a Python syntax check from the repository root:

```powershell
python -m py_compile backend\main.py
```

## Limitations and future work

- The included data is historical and must be refreshed before the application can be used for current price decisions.
- A holdout MAE is a useful local validation signal; it is not a guarantee of future performance, especially during weather, supply, policy, or transport shocks.
- Future work includes scheduled data ingestion, rolling-origin backtesting, forecast intervals, external variables such as weather and arrivals, and seasonal model candidates where supported by sufficient data.

## Resume description

> Built a full-stack agricultural commodity forecasting application using FastAPI and Next.js. Implemented leakage-safe daily preprocessing and market-specific adaptive selection among baseline, trend, and ARIMA models using trailing holdout MAE validation.

## License

This project currently has no license file. Add a license before distributing or reusing it publicly.
