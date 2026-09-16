import os
import pandas as pd

input_dir = r".\datasets\rawdata"
output_dir = r".\datasets\filtered"

valid_cities = {
    "BENGALURU", "DHARWAD", "MANGALORE", "MYSORE",
    "T.PURAM", "ERNAKULAM", "KOZHIKODE", "THRISSUR",
    "PALAKKAD", "WAYANAD", "VISAKHAPATNAM", "VIJAYAWADA", "HYDERABAD",
    "PUDUCHERRY", "PANAJI", "CHENNAI", "COIMBATORE", "DINDIGUL",
    "TIRUNELVELI", "THIRUCHIRAPALLI"
}

os.makedirs(output_dir, exist_ok=True)

for file in os.listdir(input_dir):
    if file.endswith(".csv"): 
        df = pd.read_csv(os.path.join(input_dir, file), encoding="utf-8")

        df["Centre_Name"] = df["Centre_Name"].str.upper()
        df["Price"] = pd.to_numeric(df["Price"], errors="coerce")
        
        df_filtered = df[df["Centre_Name"].isin(valid_cities)].dropna(subset=["Price"])

        if not df_filtered.empty:
            df_filtered.to_csv(os.path.join(output_dir, file), index=False, encoding="utf-8")
            print(f"Processed: {file}")

print("Preprocessing Complete! :", output_dir)
