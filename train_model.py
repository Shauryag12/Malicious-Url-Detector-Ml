import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from sklearn.preprocessing import LabelEncoder
from lightgbm import LGBMClassifier
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.base import BaseEstimator, ClassifierMixin
import re
from urllib.parse import urlparse
import joblib
import matplotlib.pyplot as plt

# Enhanced Feature Extraction
def extract_features(url):
    parsed = urlparse(url)
    domain = parsed.netloc
    path = parsed.path

    suspicious_keywords = ['login', 'admin', 'secure', 'update']
    return {
        "url_length": len(url),
        "num_special_chars": len(re.findall(r'[/?=&-]', url)),
        "has_https": int(parsed.scheme == "https"),
        "num_subdomains": max(len(domain.split(".")) - 2, 0),
        "has_ip_address": int(bool(re.search(r'\d+\.\d+\.\d+\.\d+', url))),
        "path_length": len(path),
        "suspicious_words": int(any(word in url.lower() for word in suspicious_keywords)),
        "digit_to_char_ratio": sum(c.isdigit() for c in url) / max(len(url), 1),
        "contains_at_symbol": int('@' in url),
        "domain_length": len(domain),
        "entropy": -sum(
            (freq / len(url)) * np.log2(freq / len(url))
            for freq in np.unique(list(url), return_counts=True)[1]
        ),
        "path_depth": path.count("/")
    }

# Smarter Data Augmentation
def augment_data(data):
    print("Augmenting data...")
    augmented = data.copy()

    # Add reversed URLs for malicious examples
    malicious = data[data['label'] == 1]
    malicious_reversed = malicious.copy()
    malicious_reversed['url'] = malicious_reversed['url'].apply(lambda x: x[::-1])

    # Add modified URLs
    malicious_modified = malicious.copy()
    malicious_modified['url'] = malicious_modified['url'].str.replace('.', '-').str.replace('http', 'https')

    augmented = pd.concat([augmented, malicious_reversed, malicious_modified], ignore_index=True)
    print(f"Data augmentation complete. New dataset size: {len(augmented)}")
    return augmented

# Custom Voting Mechanism
class CustomVotingClassifier:
    def __init__(self, estimators, voting='soft'):
        self.estimators = estimators
        self.voting = voting

    def fit(self, X, y):
        for name, estimator in self.estimators:
            print(f"Fitting {name}...")
            estimator.fit(X, y)

    def predict(self, X):
        if self.voting == 'soft':
            probs = np.zeros((X.shape[0], len(self.estimators[0][1].classes_)))
            for _, estimator in self.estimators:
                probs += estimator.predict_proba(X)
            return np.argmax(probs, axis=1)
        else:
            predictions = np.asarray([estimator.predict(X) for _, estimator in self.estimators])
            return np.apply_along_axis(lambda x: np.bincount(x).argmax(), axis=0, arr=predictions)

    def predict_proba(self, X):
        if self.voting == 'soft':
            probs = np.zeros((X.shape[0], len(self.estimators[0][1].classes_)))
            for _, estimator in self.estimators:
                probs += estimator.predict_proba(X)
            return probs / len(self.estimators)
        raise NotImplementedError("Hard voting does not support predict_proba")

# Ensemble Model Training Pipeline
def train_custom_ensemble(data_file, model_file):
    print("Loading dataset...")
    data = pd.read_csv(data_file)

    # Use full dataset
    print(f"Dataset size before augmentation: {len(data)}")
    data = augment_data(data)

    urls = data['url']
    labels = data['label']

    # Encode labels if necessary
    if labels.dtype == 'object' or labels.dtype.name == 'category':
        print("Encoding labels...")
        le = LabelEncoder()
        labels = le.fit_transform(labels)

    # Extract features
    print("Extracting features...")
    structured_features = pd.DataFrame([extract_features(url) for url in urls])
    print(f"Feature extraction complete. Number of features: {structured_features.shape[1]}")

    # Train-test split
    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(
        structured_features, labels, test_size=0.2, stratify=labels, random_state=42
    )

    # Define individual models
    print("Initializing models...")
    lightgbm_model = LGBMClassifier(
        boosting_type='dart',
        n_estimators=2000,
        learning_rate=0.02,
        num_leaves=80,
        max_depth=10,
        min_child_samples=20,
        subsample=0.9,
        colsample_bytree=0.85,
        reg_alpha=0.1,
        reg_lambda=0.2,
        random_state=42,
        max_bin=150,
        drop_rate=0.2,
        class_weight="balanced"
    )

    random_forest_model = RandomForestClassifier(
        n_estimators=500,
        max_depth=15,
        random_state=42,
        class_weight="balanced"
    )

    xgboost_model = XGBClassifier(
        n_estimators=500,
        learning_rate=0.05,
        max_depth=10,
        use_label_encoder=False,
        eval_metric="logloss",
        random_state=42
    )

    # Define the custom voting classifier
    print("Creating custom voting classifier...")
    ensemble_model = CustomVotingClassifier(
        estimators=[
            ('lightgbm', lightgbm_model),
            ('random_forest', random_forest_model),
            ('xgboost', xgboost_model)
        ],
        voting='soft'
    )

    # Train the ensemble model
    print("Training ensemble model...")
    ensemble_model.fit(X_train, y_train)

    # Evaluate the model
    print("Evaluating the ensemble model...")
    y_pred = ensemble_model.predict(X_test)
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    print("Accuracy:", accuracy_score(y_test, y_pred))

    # Save the model
    print(f"Saving ensemble model to {model_file}...")
    joblib.dump(ensemble_model, model_file)
    print("Ensemble model saved successfully.")

# Main Execution
if __name__ == "__main__":
    data_file = "structured_balanced_urls.csv"  # Replace with your cleaned dataset path
    model_file = "custom_ensemble_model.pkl"
    train_custom_ensemble(data_file, model_file)
