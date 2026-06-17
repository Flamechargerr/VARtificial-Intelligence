# VARtificial Intelligence

Football match outcome prediction using historical Premier League data and machine learning. Predicts pre-match probabilities (Home Win / Draw / Away Win) from rolling form, head-to-head history, and team performance statistics.

> **⚠️ Limitations:** Football is inherently unpredictable. This model does not consistently beat bookmaker odds. It is a demonstration of ML pipeline engineering, not a profitable betting system.

---

## Dataset

- **Source:** [football-data.co.uk](https://www.football-data.co.uk/)
- **Coverage:** Premier League 2016-2025 (~3,400 matches with engineered features)
- **Features:** Rolling form, goals scored/conceded, shots, head-to-head history, home/away performance
- **No in-match statistics are used as features** (no data leakage)

## Model Performance (Holdout: 2023-24 Season)

| Metric | Value |
|--------|-------|
| Accuracy | ~53.1% |
| Log Loss | 0.992 |
| Baseline (always home win) | 43.4% |
| Dataset size | 3,349 matches |

The model beats the "always predict home win" baseline by ~10 percentage points. In football prediction, this is a meaningful improvement.

## Tech Stack

| Layer | Tools |
|-------|-------|
| **Backend** | Python 3.11, Flask, NumPy, SQLite |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Data** | football-data.co.uk CSVs, SQLite |
| **ML** | Logistic Regression (NumPy implementation) |

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`

### 2. Frontend

```bash
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Re-train Model (Optional)

```bash
cd scripts
python fetch_data.py        # Downloads and processes data
python train_sklearn.py     # Trains scikit-learn model
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/teams` | Available teams |
| `GET` | `/api/evaluate` | Model performance metrics |
| `POST` | `/api/predict` | Predict match outcome |

### Prediction Request

```json
{
  "home_team": "Arsenal",
  "away_team": "Chelsea"
}
```

### Prediction Response

```json
{
  "success": true,
  "home_team": "Arsenal",
  "away_team": "Chelsea",
  "predictions": [
    {"outcome": "Home Win", "probability": 45.2},
    {"outcome": "Draw", "probability": 28.1},
    {"outcome": "Away Win", "probability": 26.7}
  ],
  "model_accuracy": 0.531,
  "model_log_loss": 0.992
}
```

## Project Structure

```
vartificial-intelligence/
├── backend/
│   ├── app.py              # Flask API
│   ├── models/             # Trained model artifacts
│   └── requirements.txt    # Python dependencies
├── data/
│   ├── raw/                # Downloaded CSVs
│   └── processed/          # SQLite database
├── scripts/
│   └── fetch_data.py       # Data pipeline
├── src/                    # React frontend
├── notebooks/              # EDA notebooks
└── README.md
```

## How It Works

1. **Data Collection:** Downloads historical match data from football-data.co.uk
2. **Feature Engineering:** Computes rolling averages (last 5 matches) for goals, shots, points, and win rate for each team
3. **Head-to-Head:** Tracks historical results between specific team pairs
4. **Model Training:** Logistic regression trained on time-based split (train on older seasons, test on 2023-24)
5. **Prediction:** For a selected matchup, the backend queries the database for the team's recent form and runs inference

## Known Limitations

- **Football unpredictability:** Even the best models struggle to exceed 55-60% accuracy for 3-way outcomes
- **No player-level data:** Injuries, transfers, and squad rotations are not modeled
- **Simplified features:** Advanced metrics like xG, Elo ratings, or bookmaker odds are not yet included
- **Single model:** Only logistic regression is implemented; ensemble methods would improve robustness

## License

MIT
