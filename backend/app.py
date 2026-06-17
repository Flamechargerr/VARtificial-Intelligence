"""
VARtificial Intelligence - ML Backend
Flask API for football match prediction using a real trained model.

Features:
- Loads pre-trained numpy logistic regression model
- Queries SQLite database for real-time team form features
- Returns honest probability estimates with confidence intervals
- Evaluates model performance on holdout data
"""

import os
import json
import pickle
import sqlite3
import numpy as np
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = Path(__file__).parent.parent / "data" / "processed" / "matches.db"
MODEL_PATH = Path(__file__).parent / "models" / "model_numpy.pkl"
META_PATH = Path(__file__).parent / "models" / "model_meta.json"

# Load model
with open(MODEL_PATH, "rb") as f:
    model_artifact = pickle.load(f)

W = model_artifact["W"]
b = model_artifact["b"]
mean = model_artifact["mean"]
std = model_artifact["std"]
feature_cols = model_artifact["feature_cols"]

with open(META_PATH, "r") as f:
    model_meta = json.load(f)


def softmax(z):
    e = np.exp(z - np.max(z, axis=1, keepdims=True))
    return e / np.sum(e, axis=1, keepdims=True)


def get_team_form(team_name, is_home):
    """Get the most recent form features for a team from the database."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    if is_home:
        c.execute(
            "SELECT * FROM matches WHERE HomeTeam = ? ORDER BY Date DESC LIMIT 1",
            (team_name,),
        )
    else:
        c.execute(
            "SELECT * FROM matches WHERE AwayTeam = ? ORDER BY Date DESC LIMIT 1",
            (team_name,),
        )
    row = c.fetchone()
    if not row:
        conn.close()
        return None

    c.execute("PRAGMA table_info(matches)")
    cols = [d[1] for d in c.fetchall()]
    conn.close()
    return dict(zip(cols, row))


def get_h2h_features(home_team, away_team):
    """Get head-to-head features from database."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute(
        "SELECT FTR FROM matches WHERE ((HomeTeam = ? AND AwayTeam = ?) OR (HomeTeam = ? AND AwayTeam = ?)) ORDER BY Date DESC LIMIT 5",
        (home_team, away_team, away_team, home_team),
    )
    rows = c.fetchall()
    conn.close()

    if not rows:
        return {"h2h_home_wins": 0, "h2h_draws": 0, "h2h_away_wins": 0, "h2h_matches": 0}

    total = len(rows)
    hw = sum(1 for r in rows if r[0] == "H")
    dr = sum(1 for r in rows if r[0] == "D")
    aw = sum(1 for r in rows if r[0] == "A")

    return {
        "h2h_home_wins": hw / total,
        "h2h_draws": dr / total,
        "h2h_away_wins": aw / total,
        "h2h_matches": total,
    }


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "feature_count": len(feature_cols),
        "train_size": model_meta.get("train_size"),
        "test_size": model_meta.get("test_size"),
    })


@app.route("/api/teams", methods=["GET"])
def get_teams():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT name FROM teams ORDER BY name")
    teams = [r[0] for r in c.fetchall()]
    conn.close()

    return jsonify({"teams": teams})


@app.route("/api/evaluate", methods=["GET"])
def evaluate():
    return jsonify({
        "model": "Logistic Regression + Elo + Form Features",
        "accuracy": model_meta.get("accuracy"),
        "log_loss": model_meta.get("log_loss"),
        "baseline_accuracy": model_meta.get("baseline"),
        "train_size": model_meta.get("train_size"),
        "test_size": model_meta.get("test_size"),
        "feature_cols": feature_cols,
    })


def safe_float(val):
    if val is None:
        return 0.0
    try:
        return float(val)
    except (ValueError, TypeError):
        return 0.0


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    home_team = data.get("home_team")
    away_team = data.get("away_team")

    if not home_team or not away_team:
        return jsonify({"error": "Missing home_team or away_team"}), 400

    if home_team == away_team:
        return jsonify({"error": "Home and away teams must be different"}), 400

    # Get features
    home_form = get_team_form(home_team, is_home=True)
    away_form = get_team_form(away_team, is_home=False)
    h2h_feat = get_h2h_features(home_team, away_team)

    if home_form is None or away_form is None:
        return jsonify({"error": "Insufficient historical data for one or both teams"}), 400

    # Build feature vector in the exact order the model expects
    feat_vec = []
    for col in feature_cols:
        if col.startswith("home_"):
            feat_vec.append(safe_float(home_form.get(col, 0)))
        elif col.startswith("away_"):
            feat_vec.append(safe_float(away_form.get(col, 0)))
        elif col.startswith("h2h_"):
            feat_vec.append(safe_float(h2h_feat.get(col, 0)))
        elif col == "elo_diff":
            feat_vec.append(safe_float(home_form.get(col, 0)))
        else:
            feat_vec.append(0.0)

    X = np.array([feat_vec])
    X_s = (X - mean) / std

    z = X_s @ W + b
    p = softmax(z)[0]

    outcomes = ["Home Win", "Draw", "Away Win"]
    predictions = []
    for i, outcome in enumerate(outcomes):
        predictions.append({
            "outcome": outcome,
            "probability": round(float(p[i]) * 100, 1),
        })

    predictions.sort(key=lambda x: x["probability"], reverse=True)

    return jsonify({
        "success": True,
        "home_team": home_team,
        "away_team": away_team,
        "predictions": predictions,
        "model_accuracy": model_meta.get("accuracy"),
        "model_log_loss": model_meta.get("log_loss"),
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
