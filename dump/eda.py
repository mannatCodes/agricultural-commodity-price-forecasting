
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import seaborn as sns
import matplotlib.pyplot as plt
import warnings

warnings.simplefilter(action="ignore", category=FutureWarning)
warnings.simplefilter(action="ignore", category=UserWarning)


input_dir = r"D:\A\miniproject3\datasets\rawdata"
output_dir = r"D:\A\miniproject3\datasets"
os.makedirs(output_dir, exist_ok=True)

final_df = pd.read_csv("D:/A/miniproject3/datasets/final_cleaned_data.csv")
final_df.head()

print("\nData Overview:")
print(final_df.info())

final_df = final_df.drop_duplicates()
print("\nDuplicates Removed. Final Shape:", final_df.shape)

plt.figure(figsize=(12, 5))
sns.countplot(data=final_df, y="Centre_Name", order=final_df["Centre_Name"].value_counts().index, palette="viridis")
plt.xlabel("Number of Records")
plt.ylabel("City")
plt.title("Distribution of Data by City")
plt.show()

final_df["Date"] = pd.to_datetime(final_df["Date"], errors="coerce")
final_df["Month"] = final_df["Date"].dt.to_period("M")
print(final_df.dtypes)
final_df["Month"] = final_df["Date"].dt.to_period("M")
monthly_prices = final_df.groupby("Month")["Price"].mean()
final_df.head()

plt.figure(figsize=(14, 6))
sns.barplot(data=final_df, x="Commodity_Name", y="Price", errorbar=None, palette="coolwarm")
plt.xticks(rotation=90)
plt.xlabel("Commodity")
plt.ylabel("Average Price")
plt.title("Average Price per Commodity")
plt.grid(axis="y")
plt.show()

if monthly_prices.empty:
    print("Error: monthly_prices DataFrame is empty. Check your data processing pipeline.")
else:
    # Handle NaN values (fill with 0 or drop them)
    monthly_prices = monthly_prices.dropna()
    plt.figure(figsize=(12, 5))
monthly_prices.plot(marker="o", color="red")
plt.xlabel("Month")
plt.ylabel("Average Price")
plt.title("Monthly Average Price Trends")
plt.grid()
plt.show()

plt.figure(figsize=(14, 6))
sns.boxplot(data=final_df, x="Commodity_Name", y="Price", showfliers=False)
plt.xticks(rotation=90)
plt.xlabel("Commodity")
plt.ylabel("Price")
plt.title("Commodity-Wise Price Variations")
plt.show()

print(final_df.describe())  
print(final_df.info())  

plt.figure(figsize=(12, 6))
sns.boxplot(data=final_df, x="Centre_Name", y="Price")
plt.xticks(rotation=90)
plt.title("Price Distribution Across Cities")
plt.show()





