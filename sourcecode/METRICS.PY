import pandas as pd
import numpy as np
import joblib  # or pickle
from sklearn.metrics import mean_squared_error, mean_absolute_error
from math import sqrt


# Step 1: Load saved ARIMA model
model = joblib.load("saved_arima_model.pkl")  # or use pickle.load()

# Step 2: Forecast using the model
forecast_steps = len(test_data)
forecast = model.forecast(steps=forecast_steps)

# Step 3: Calculate Accuracy Metrics
mse = mean_squared_error(test_data, forecast)
rmse = sqrt(mse)
mae = mean_absolute_error(test_data, forecast)
mape = np.mean(np.abs((test_data - forecast) / test_data)) * 100

print("RMSE:", rmse)
print("MAE:", mae)
print("MAPE:", mape, "%")
