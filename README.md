# VARtificial Intelligence

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

**Premier League match outcome prediction** using rolling form, Elo ratings, head-to-head history, and 33 pre-match engineered features. Built with a clean React + Flask stack, deployed on Render + Vercel.

> **Live:** [var-tificial-intelligence.vercel.app](https://var-tificial-intelligence.vercel.app)  
> **API:** [vartificial-api.onrender.com](https://vartificial-api.onrender.com/api/health)

---

## What It Does

Select any two Premier League teams and get a **3-way probability prediction** (Home Win / Draw / Away Win) along with:

- **Team form cards** — last 5 results with W/D/L badges, goals, win rate
- **Head-to-head history** — previous meetings between the two teams
- **Key factors breakdown** — which features drove the prediction and by how much
- **Stats comparison** — goals, points, Elo rating side-by-side
- **Animated probability bars** — elastic spring animation with team colors

All predictions use **only pre-match data** — no goals, shots, or cards from the actual match are leaked into the model.

---

## Model Performance

| Metric | Value |
|--------|-------|
| Accuracy | **55.4%** |
| Log Loss | 0.968 |
| Baseline (always home) | 43.4% |
| Train / Test | 2,595 / 754 matches |
| Features | 33 (Elo + form + H2H) |

The model beats the "always home win" baseline by ~12 percentage points. In football prediction, this is a meaningful improvement — the theoretical ceiling for 3-way outcomes is roughly 55–60%.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React + Vite  │────▶│  Flask API      │────▶│  SQLite DB      │
│  (Vercel)       │     │  (Render)       │     │  (3,400 matches)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  NumPy Model    │
                        │  Logistic Reg   │
                        └─────────────────┘
```

### Data Pipeline

1. **Download** — Fetches 10 seasons of PL data from [football-data.co.uk](https://www.football-data.co.uk/)
2. **Engineer** — Rolling 5-match averages for goals, shots, points, win rate per team
3. **H2H** — Computes historical results between each team pair
4. **Elo** — Simple Elo rating system updated after each match
5. **Store** — SQLite database with `matches` and `teams` tables

### Model

- **Algorithm:** Logistic Regression (softmax over 3 classes)
- **Implementation:** Pure NumPy (no scikit-learn dependency in production)
- **Split:** Time-based — train on ≤2022 seasons, test on 2023–24
- **Standardization:** Feature mean/std computed on training set only

---

## Project Structure

```
vartificial-intelligence/
├── backend/
│   ├── app.py              # Flask API (predictions, team stats, H2H)
│   ├── data/
│   │   └── processed/
│   │       └── matches.db  # SQLite database
│   ├── models/
│   │   ├── model_numpy.pkl # Trained weights
│   │   └── model_meta.json # Accuracy, log loss, feature cols
│   └── requirements.txt    # Python deps
├── config/
│   ├── vite.config.ts      # Vite build config
│   └── eslint.config.js    # ESLint flat config
├── deploy/
│   ├── Dockerfile           # Render deployment
│   └── render.yaml          # Render service config
├── src/
│   ├── core/               # App entry, router, theme
│   ├── shared/
│   │   ├── components/     # shadcn/ui components
│   │   ├── pages/          # Index (match predictor UI)
│   │   └── services/       # API client
│   └── lib/                # Utility functions
├── tools/
│   ├── fetch_data.py       # Data pipeline
│   └── train_sklearn.py    # Model training
├── public/                  # Static assets
├── dist/                    # Build output (for Vercel)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## API Reference

Base URL: `https://vartificial-api.onrender.com`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + model info |
| `GET` | `/api/teams` | List of 34 Premier League teams |
| `GET` | `/api/team/<name>` | Team stats, Elo, recent form |
| `GET` | `/api/evaluate` | Model performance metrics |
| `POST` | `/api/predict` | Predict match outcome |

### Prediction Request

```json
POST /api/predict
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
  "feature_breakdown": [
    {"feature": "home_goals_scored_5", "value": 2.4, "weight": 0.312, "impact": 0.749}
  ],
  "home_recent": [{"date": "2024-05-19", "team_result": "W", "goals_for": 2, "goals_against": 1}],
  "away_recent": [...],
  "h2h_history": [{"date": "2024-04-23", "home_goals": 5, "away_goals": 0, "result": "H"}],
  "h2h_stats": {"h2h_home_wins": 0.6, "h2h_draws": 0.2, "h2h_away_wins": 0.2, "h2h_matches": 5}
}
```

---

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Runs on `http://localhost:5000`

### Frontend

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`

### Rebuild Data & Model

```bash
cd tools
python fetch_data.py      # Downloads & processes data
python train_sklearn.py   # Trains model
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons |
| **Backend** | Python 3.11, Flask, NumPy, SQLite, CORS |
| **ML** | Logistic Regression (NumPy), StandardScaler, Softmax |
| **Data** | football-data.co.uk, pandas, SQLite |
| **Deploy** | Render (backend), Vercel (frontend) |

---

## Honest Limitations

- **55.4% accuracy** — beats baseline but is not a profitable betting system
- **No player data** — injuries, transfers, and squad rotations are not modeled
- **No xG or bookmaker odds** — these would improve accuracy significantly
- **Single model** — only logistic regression; ensembles would improve robustness
- **Football is chaotic** — even the best models rarely exceed 60% for 3-way outcomes

This is a **portfolio project** demonstrating ML pipeline engineering, not a production betting tool.

---

## License

MIT
