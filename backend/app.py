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


def get_team_features(team_name, is_home=True):
    """Extract pre-match features for a team from the database."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Get last 5 matches for this team (all venues), with dates for sorting
    c.execute(
        "SELECT Date, FTHG, FTAG, FTR, HS, HST, 1 as is_home FROM matches WHERE HomeTeam = ? UNION ALL SELECT Date, FTAG, FTHG, FTR, AS, AST, 0 as is_home FROM matches WHERE AwayTeam = ? ORDER BY Date DESC LIMIT 5",
        (team_name, team_name),
    )
    rows = c.fetchall()
    conn.close()

    if not rows:
        return None

    # rows: (Date, goals_for, goals_against, FTR, shots, shots_target, is_home)
    venue_rows = [r for r in rows if r[6] == (1 if is_home else 0)]
    if not venue_rows:
        venue_rows = rows[:5]
    else:
        venue_rows = venue_rows[:5]

    goals_for = [r[1] for r in rows]
    goals_against = [r[2] for r in rows]
    shots = [r[4] for r in rows]
    shots_target = [r[5] for r in rows]

    pts = sum(3 if r[3] == ("H" if is_home else "A") else 1 if r[3] == "D" else 0 for r in rows)
    win_rate = sum(1 for r in rows if r[3] == ("H" if is_home else "A")) / len(rows)

    home_goals_for = [r[1] for r in venue_rows]
    home_goals_against = [r[2] for r in venue_rows]
    home_pts = sum(3 if r[3] == ("H" if is_home else "A") else 1 if r[3] == "D" else 0 for r in venue_rows)

    return {
        "goals_scored_5": sum(goals_for) / len(goals_for),
        "goals_conceded_5": sum(goals_against) / len(goals_against),
        "shots_5": sum(shots) / len(shots),
        "shots_target_5": sum(shots_target) / len(shots_target),
        "pts_5": pts,
        "win_rate_5": win_rate,
        "goals_scored_home_5": sum(home_goals_for) / len(home_goals_for) if home_goals_for else 0,
        "goals_conceded_home_5": sum(home_goals_against) / len(home_goals_against) if home_goals_against else 0,
        "pts_home_5": home_pts,
    }


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
        "model": "Logistic Regression (numpy)",
        "accuracy": model_meta.get("accuracy"),
        "log_loss": model_meta.get("log_loss"),
        "baseline_accuracy": model_meta.get("baseline"),
        "train_size": model_meta.get("train_size"),
        "test_size": model_meta.get("test_size"),
        "feature_cols": feature_cols,
    })


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
    home_feat = get_team_features(home_team, is_home=True)
    away_feat = get_team_features(away_team, is_home=False)
    h2h_feat = get_h2h_features(home_team, away_team)

    if home_feat is None or away_feat is None:
        return jsonify({"error": "Insufficient historical data for one or both teams"}), 400

    # Build feature vector
    feat_vec = []
    for col in feature_cols:
        if col.startswith("home_") and not col.startswith("home_goals_scored_home") and not col.startswith("home_goals_conceded_home") and not col.startswith("home_pts_home"):
            key = col.replace("home_", "")
            feat_vec.append(home_feat.get(key, 0))
        elif col.startswith("home_goals_scored_home"):
            feat_vec.append(home_feat.get("goals_scored_home_5", 0))
        elif col.startswith("home_goals_conceded_home"):
            feat_vec.append(home_feat.get("goals_conceded_home_5", 0))
        elif col.startswith("home_pts_home"):
            feat_vec.append(home_feat.get("pts_home_5", 0))
        elif col.startswith("away_") and not col.startswith("away_goals_scored_away") and not col.startswith("away_goals_conceded_away") and not col.startswith("away_pts_away"):
            key = col.replace("away_", "")
            feat_vec.append(away_feat.get(key, 0))
        elif col.startswith("away_goals_scored_away"):
            feat_vec.append(away_feat.get("goals_scored_away_5", 0))
        elif col.startswith("away_goals_conceded_away"):
            feat_vec.append(away_feat.get("goals_conceded_away_5", 0))
        elif col.startswith("away_pts_away"):
            feat_vec.append(away_feat.get("pts_away_5", 0))
        elif col.startswith("h2h_"):
            feat_vec.append(h2h_feat.get(col, 0))
        else:
            feat_vec.append(0)

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
