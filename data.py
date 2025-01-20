import pandas as pd

data = pd.read_csv("cleaned_data.csv")
print(data["Label"].unique())  # Check unique values in the Label column
