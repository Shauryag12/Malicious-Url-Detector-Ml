import pandas as pd
import numpy as np
import re
from urllib.parse import urlparse
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import argparse

# Feature Extraction Function
def extract_features(url):
    """
    Extract numerical features from a given URL.
    """
    parsed = urlparse(url)
    return {
        "url_length": len(url),
        "num_special_chars": len(re.findall(r'[/?=&-]', url)),
        "has_https": int(parsed.scheme == "https"),
        "num_subdomains": max(len(parsed.netloc.split(".")) - 2, 0),  # Ensure no negative values
        "has_ip_address": int(bool(re.search(r'\d+\.\d+\.\d+\.\d+', url))),
    }


# Train and Save Model
def train_model(data_file, model_file):
    """
    Train the Random Forest model using the dataset and save the model.
    """
    print("Loading dataset...")
    data = pd.read_csv(data_file)

    # Debug: Show dataset columns
    print("Dataset columns:", data.columns)

    # Check for URL column
    if 'URL' in data.columns:
        url_column = 'URL'
    elif 'url' in data.columns:
        url_column = 'url'
    else:
        print("Error: URL column not found in the dataset.")
        print("Columns available:", data.columns)
        return

    # Debug: Print first few rows of the dataset
    print("First 5 rows of dataset:\n", data.head())

    # Extract features
    print("Extracting features...")
    try:
        data['features'] = data[url_column].apply(extract_features)
    except Exception as e:
        print("Error during feature extraction:", e)
        return

    # Debug: Check if features column was created
    print("Features column created:")
    print(data['features'].head())

    # Convert 'features' to a DataFrame
    features_df = pd.DataFrame(data['features'].tolist())
    features_df['label'] = data['label']

    # Split data into training and testing sets
    X = features_df.drop(columns=['label'])
    y = features_df['label']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train Random Forest classifier
    print("Training model...")
    model = RandomForestClassifier()
    model.fit(X_train, y_train)

    # Evaluate the model
    y_pred = model.predict(X_test)
    print("\nModel Evaluation:")
    print(classification_report(y_test, y_pred))
    print("Accuracy:", accuracy_score(y_test, y_pred))

    # Save the model
    print(f"Saving model to {model_file}...")
    joblib.dump(model, model_file)
    print("Model saved successfully.")
    print("Training completed successfully!")



# Predict with the Model
def predict_url(model_file, url):
    """
    Predict whether a URL is malicious or benign using the trained model.
    """
    print(f"Loading model from {model_file}...")
    model = joblib.load(model_file)
    features = pd.DataFrame([extract_features(url)])
    prediction = model.predict(features)
    print(f"Prediction for '{url}':", "Malicious" if prediction[0] == 1 else "Benign")


# Command-Line Interface
def main():
    parser = argparse.ArgumentParser(description="Malicious URL Detector")
    parser.add_argument("action", choices=["train", "predict"], help="Action to perform: train a model or predict a URL")
    parser.add_argument("--data", help="Path to the dataset file (required for training)")
    parser.add_argument("--model", default="malicious_url_detector.pkl", help="Path to save/load the model file")
    parser.add_argument("--url", help="URL to predict (required for prediction)")
    args = parser.parse_args()

    if args.action == "train":
        if not args.data:
            print("Error: --data argument is required for training.")
        else:
            train_model(args.data, args.model)
    elif args.action == "predict":
        if not args.url:
            print("Error: --url argument is required for prediction.")
        else:
            predict_url(args.model, args.url)


if __name__ == "__main__":
    main()
