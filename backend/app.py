"""
VARtificial Intelligence - ML Backend
Flask API for football match prediction with rich data and feature breakdown.
"""

import os, json, pickle, sqlite3, numpy as np
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DB_PATH = Path(__file__).parent / "data" / "processed" / "matches.db"
MODEL_PATH = Path(__file__).parent / "models" / "model_numpy.pkl"
META_PATH = Path(__file__).parent / "models" / "model_meta.json"

with open(MODEL_PATH, "rb") as f:
    artifact = pickle.load(f)

W, b, mean, std, feature_cols = artifact["W"], artifact["b"], artifact["mean"], artifact["std"], artifact["feature_cols"]
with open(META_PATH, "r") as f:
    model_meta = json.load(f)


def softmax(z):
    e = np.exp(z - np.max(z, axis=1, keepdims=True))
    return e / np.sum(e, axis=1, keepdims=True)


def safe_float(v):
    try:
        return float(v) if v is not None else 0.0
    except (ValueError, TypeError):
        return 0.0


def get_team_stats(team_name, is_home):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    if is_home:
        c.execute("SELECT * FROM matches WHERE HomeTeam = ? ORDER BY Date DESC LIMIT 1", (team_name,))
    else:
        c.execute("SELECT * FROM matches WHERE AwayTeam = ? ORDER BY Date DESC LIMIT 1", (team_name,))
    row = c.fetchone()

    c.execute("PRAGMA table_info(matches)")
    cols = [d[1] for d in c.fetchall()]
    conn.close()

    if not row:
        return None
    return dict(zip(cols, row))


def get_recent_matches(team_name, limit=5):
    """Get the last N matches for a team with full details."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute("""
        SELECT Date, HomeTeam, AwayTeam, FTHG, FTAG, FTR, FTR as result,
               CASE WHEN HomeTeam = ? THEN 'H' ELSE 'A' END as venue
        FROM matches
        WHERE HomeTeam = ? OR AwayTeam = ?
        ORDER BY Date DESC
        LIMIT ?
    """, (team_name, team_name, team_name, limit))

    rows = c.fetchall()
    conn.close()

    matches = []
    for r in rows:
        is_home = r[1] == team_name
        gf = r[3] if is_home else r[4]
        ga = r[4] if is_home else r[3]
        result = r[5]
        team_result = "W" if (is_home and result == "H") or (not is_home and result == "A") else \
                      "D" if result == "D" else "L"
        matches.append({
            "date": r[0],
            "home_team": r[1],
            "away_team": r[2],
            "home_goals": r[3],
            "away_goals": r[4],
            "result": result,
            "team_result": team_result,
            "venue": "H" if is_home else "A",
            "goals_for": gf,
            "goals_against": ga,
        })
    return matches


def get_h2h_history(home, away, limit=5):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        SELECT Date, HomeTeam, AwayTeam, FTHG, FTAG, FTR
        FROM matches
        WHERE ((HomeTeam = ? AND AwayTeam = ?) OR (HomeTeam = ? AND AwayTeam = ?))
        ORDER BY Date DESC
        LIMIT ?
    """, (home, away, away, home, limit))
    rows = c.fetchall()
    conn.close()

    return [{
        "date": r[0], "home_team": r[1], "away_team": r[2],
        "home_goals": r[3], "away_goals": r[4], "result": r[5]
    } for r in rows]


def get_h2h_features(home, away):
    rows = get_h2h_history(home, away, 5)
    if not rows:
        return {"h2h_home_wins": 0, "h2h_draws": 0, "h2h_away_wins": 0, "h2h_matches": 0}
    total = len(rows)
    hw = sum(1 for r in rows if r["result"] == "H")
    dr = sum(1 for r in rows if r["result"] == "D")
    aw = sum(1 for r in rows if r["result"] == "A")
    return {"h2h_home_wins": hw/total, "h2h_draws": dr/total, "h2h_away_wins": aw/total, "h2h_matches": total}


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "model_loaded": True, "feature_count": len(feature_cols)})


@app.route("/api/teams", methods=["GET"])
def get_teams():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT name FROM teams ORDER BY name")
    teams = [r[0] for r in c.fetchall()]
    conn.close()
    return jsonify({"teams": teams})


@app.route("/api/team/<team_name>", methods=["GET"])
def team_details(team_name):
    """Get detailed team stats and recent form."""
    home_stats = get_team_stats(team_name, True)
    away_stats = get_team_stats(team_name, False)
    recent = get_recent_matches(team_name, 5)

    if not home_stats and not away_stats:
        return jsonify({"error": "Team not found"}), 404

    stats = home_stats or away_stats

    return jsonify({
        "name": team_name,
        "elo": round(safe_float(stats.get("home_elo" if home_stats else "away_elo", 1500)), 1),
        "recent_form": recent,
        "rolling_stats": {
            "goals_scored_5": round(safe_float(stats.get("home_goals_scored_5" if home_stats else "away_goals_scored_5", 0)), 2),
            "goals_conceded_5": round(safe_float(stats.get("home_goals_conceded_5" if home_stats else "away_goals_conceded_5", 0)), 2),
            "win_rate_5": round(safe_float(stats.get("home_win_rate_5" if home_stats else "away_win_rate_5", 0)), 2),
            "pts_5": round(safe_float(stats.get("home_pts_5" if home_stats else "away_pts_5", 0)), 1),
        }
    })


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


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json()
    home = data.get("home_team")
    away = data.get("away_team")

    if not home or not away:
        return jsonify({"error": "Missing teams"}), 400
    if home == away:
        return jsonify({"error": "Teams must be different"}), 400

    home_form = get_team_stats(home, True)
    away_form = get_team_stats(away, False)
    h2h_feat = get_h2h_features(home, away)

    if home_form is None or away_form is None:
        return jsonify({"error": "Insufficient data"}), 400

    # Build feature vector
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
    predictions = [{"outcome": o, "probability": round(float(p[i]) * 100, 1)} for i, o in enumerate(outcomes)]
    predictions.sort(key=lambda x: x["probability"], reverse=True)

    # Feature breakdown for UI
    feature_breakdown = []
    for i, col in enumerate(feature_cols):
        val = feat_vec[i]
        weight = float(W[i, np.argmax(p)])  # Weight for predicted class
        impact = val * weight
        feature_breakdown.append({
            "feature": col,
            "value": round(val, 2),
            "weight": round(weight, 3),
            "impact": round(impact, 3),
        })
    feature_breakdown.sort(key=lambda x: abs(x["impact"]), reverse=True)

    return jsonify({
        "success": True,
        "home_team": home,
        "away_team": away,
        "predictions": predictions,
        "model_accuracy": model_meta.get("accuracy"),
        "feature_breakdown": feature_breakdown[:10],
        "home_recent": get_recent_matches(home, 5),
        "away_recent": get_recent_matches(away, 5),
        "h2h_history": get_h2h_history(home, away, 5),
        "h2h_stats": h2h_feat,
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
