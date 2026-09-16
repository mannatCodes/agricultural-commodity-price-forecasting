#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
from statsmodels.tsa.arima.model import ARIMA
from pmdarima import auto_arima
from sklearn.metrics import mean_absolute_error, mean_squared_error
import pickle
import joblib


# In[ ]:


path = f"./datasets/final_dataset.csv"
if os.path.exists(path):
    final_df = pd.read_csv(path)
    print("Dataset Loaded Successfully")
    if 'price' not in final_df.columns:
        print("Error: 'Price' column not found in the dataset!")
        exit()
else:
    print("Error: File not found!")


# In[3]:


train_size = int(len(final_df) * 0.8)
train, test = final_df[:train_size], final_df[train_size:]


# In[4]:


def adf_test(series):
    result = adfuller(series)
    print("ADF Statistic:", result[0])
    print("p-value:", result[1])
    if result[1] < 0.05:
        print("Data is stationary")
    else:
        print("Data is not stationary")


# In[5]:


print(final_df.columns)


# In[7]:


adf_test(final_df["price"]) 
final_df["Price_Diff"] = final_df["price"].diff().dropna()
adf_test(final_df["Price_Diff"].dropna())


# In[10]:


### Step 5: ACF & PACF Plots
fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(12, 5))

# Plot ACF on the first subplot (axes[0])
plot_acf(final_df["price"].dropna(), lags=40, ax=axes[0])
axes[0].set_title('Autocorrelation Function (ACF)')

# Plot PACF on the second subplot (axes[1])
plot_pacf(final_df["price"].dropna(), lags=40, ax=axes[1])
axes[1].set_title('Partial Autocorrelation Function (PACF)')

plt.tight_layout()
plt.show()



# In[ ]:





# In[11]:


auto_model = auto_arima(final_df["price"], seasonal=False, trace=True)
print(auto_model.summary())


# In[12]:


p, d, q = auto_model.order  


# In[14]:


model = ARIMA(final_df["price"], order=(p, d, q))
model_fit = model.fit()
print(model_fit.summary())


# In[16]:


model = ARIMA(train["price"], order=(p,d,q)) 
model_fit = model.fit()



# In[18]:


forecast = model_fit.forecast(steps=len(test))
mae = mean_absolute_error(test["price"], forecast)
mse = mean_squared_error(test["price"], forecast)
print(f"MAE: {mae}, MSE: {mse}")  


# In[19]:


with open("arima_model.pkl", "wb") as model_file:
    pickle.dump(model_fit, model_file)
with open("arima_model.pkl", "rb") as model_file:
    loaded_model = pickle.load(model_file)
forecast = loaded_model.forecast(steps=30)    
