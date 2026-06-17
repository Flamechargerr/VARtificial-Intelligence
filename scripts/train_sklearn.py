"""
Train a scikit-learn model for football match prediction.

This script uses the processed features from the data pipeline and trains
a Logistic Regression + Random Forest ensemble using scikit-learn.

Usage:
    cd scripts
    python train_sklearn.py

Output:
    - backend/models/model_sklearn.pkl
    - backend/models/model_meta_sklearn.json
"""

import json
import pickle
import sqlite3
from pathlib import Path

import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, log_loss, brier_score_loss, classification_report

PROJECT = Path(__file__).parent.parent
DB_PATH = PROJECT / "data" / "processed" / "matches.db"
MODELS_DIR = PROJECT / "backend" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)


def load_data():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM matches")
    rows = c.fetchall()
    cols = [d[0] for d in c.description]
    conn.close()

    data = []
    for row in rows:
        data.append(dict(zip(cols, row)))
    return data


def train():
    features = load_data()
    if not features:
        print("No data found! Run fetch_data.py first.")
        return

    exclude = {"Date", "HomeTeam", "AwayTeam", "FTHG", "FTAG", "FTR", "target"}
    feature_cols = [k for k in features[0].keys() if k not in exclude]

    X = np.array([[float(f[c]) for c in feature_cols] for f in features])
    y = np.array([int(f["target"]) for f in features])

    # Time-based split
    train_mask = np.array([f["Date"] < "2023-08-01" for f in features])
    test_mask = np.array([f["Date"] >= "2023-08-01" for f in features])

    if sum(test_mask) < 50:
        split_idx = int(len(features) * 0.8)
        train_mask = np.arange(len(features)) < split_idx
        test_mask = np.arange(len(features)) >= split_idx

    X_train, y_train = X[train_mask], y[train_mask]
    X_test, y_test = X[test_mask], y[test_mask]

    print(f"Train: {len(X_train)}, Test: {len(X_test)}")

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    models = {
        "LogisticRegression": LogisticRegression(
            max_iter=2000, class_weight="balanced", random_state=42
        ),
        "RandomForest": RandomForestClassifier(
            n_estimators=200,
            max_depth=12,
            min_samples_split=10,
            random_state=42,
            class_weight="balanced",
        ),
    }

    results = {}
    trained_models = {}

    for name, model in models.items():
        model.fit(X_train_s, y_train)
        y_pred = model.predict(X_test_s)
        y_proba = model.predict_proba(X_test_s)

        acc = accuracy_score(y_test, y_pred)
        ll = log_loss(y_test, y_proba) if len(y_test) > 0 else 0
        brier = (
            brier_score_loss(y_test, y_proba[:, 1])
            if len(set(y_test)) > 1 and y_proba.shape[1] > 1
            else 0
        )

        results[name] = {
            "accuracy": float(acc),
            "log_loss": float(ll),
            "brier_score": float(brier),
        }
        trained_models[name] = model
        print(f"  {name}: accuracy={acc:.3f}, log_loss={ll:.3f}")

    # Baseline
    baseline_acc = np.mean(y_test == 0)
    print(f"  Baseline (always home): {baseline_acc:.3f}")

    # Save artifact
    artifact = {
        "models": trained_models,
        "scaler": scaler,
        "feature_cols": feature_cols,
        "results": results,
        "baseline": float(baseline_acc),
    }
    with open(MODELS_DIR / "model_sklearn.pkl", "wb") as f:
        pickle.dump(artifact, f)

    meta = {
        "feature_cols": feature_cols,
        "results": results,
        "baseline_accuracy": float(baseline_acc),
        "train_size": int(sum(train_mask)),
        "test_size": int(sum(test_mask)),
    }
    with open(MODELS_DIR / "model_meta_sklearn.json", "w") as f:
        json.dump(meta, f, indent=2)

    print(f"\nSaved to {MODELS_DIR}")


if __name__ == "__main__":
    train()
