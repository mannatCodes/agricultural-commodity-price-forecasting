import os
import pandas as pd

filtered_dir = r".\datasets\filtered"
output_file = r".\datasets\final_dataset.csv"

csv_files = [os.path.join(filtered_dir, file) for file in os.listdir(filtered_dir) if file.endswith(".csv")]

df_list = [pd.read_csv(file, encoding="utf-8") for file in csv_files]
final_df = pd.concat(df_list, ignore_index=True)

final_df["Date"] = pd.to_datetime(final_df["Date"], format="%d-%m-%Y", errors="coerce")
final_df = final_df.sort_values(by="Date")

final_df.to_csv(output_file, index=False, encoding="utf-8")
print("Data Integration Complete! location:", output_file)
