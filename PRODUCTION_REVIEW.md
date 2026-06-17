# VARtificial Intelligence — Production Review & Hardening Plan

**Date:** 2026-07-28  
**Reviewer:** Agent (via project-production-hardening skill)  
**Repo:** `github.com/Flamechargerr/VARtificial-Intelligence`  
**Status:** ❌ **Not production-ready. Extensive gimmicks and fake data detected.**

---

## Executive Summary

This project is a **toy dressed in ML clothing**. It has a professional-looking React + Tailwind UI, badges claiming "68% accuracy" and "3 ensemble models," and a Flask backend — but under the hood, the "machine learning" is mostly **hardcoded heuristics, fake mock data, and data leakage**. A recruiter or interviewer who looks at the code will immediately see through it.

The good news: the scaffolding (React, Flask, scikit-learn) is real. With a full rewrite of the data pipeline, model logic, and frontend services, this can become a **credible, interview-worthy football ML project**.

---

## Part 1: The Gimmicks & Bullshit Audit

### 1.1 Fake Data Everywhere (Critical)

Almost every "feature" in the frontend is powered by hardcoded mock data. These are not fallbacks — they are the primary data source.

| File | What's Fake | Impact |
|------|-------------|--------|
| `src/shared/utils/data/players.ts` | `mockPlayers` — 5 players per team, hand-picked with fake ratings | Player cards, team displays are completely fabricated |
| `src/shared/utils/weatherService.ts` | `mockWeatherData` — only 6 stadiums (Old Trafford, Wembley, Camp Nou, Bernabeu, Allianz, Signal Iduna) | Weather impact component shows fake weather for non-English stadiums |
| `src/shared/utils/injuryService.ts` | `mockInjuryData` — 5 teams have injuries, dates are set to **2025** (future) | Injury report shows fake injuries that don't exist |
| `src/shared/utils/teamRankingService.ts` | `mockTeamRankings` — hardcoded table, 10 teams only | League table is completely made up |
| `src/shared/utils/momentumService.ts` | `mockMomentumData` — 6 teams have hardcoded momentum scores | Momentum indicator is arbitrary |
| `src/shared/utils/bettingOddsService.ts` | `mockBettingOddsData` — **only 3 matchups** have odds (MU vs LIV, MC vs CHE, ARS vs TOT) | Odds comparison is empty for 99.7% of matches |
| `src/shared/utils/data/footballMatchData.ts` | 95 hand-typed matches from 2022-23 | "Training data" is a tiny, manually-entered subset |
| `src/shared/services/MatchUpdateService.ts` | Generates random player names like "James Smith" and "Robert Johnson" for fake live events | Live match timeline is a random name generator |
| `src/shared/utils/matchSimulationService.ts` | `Math.random()` based simulation | Match simulation is completely random, not data-driven |
| `src/shared/components/TeamComparison.tsx` (via `Index.tsx`) | Hardcoded `wins: 12, draws: 6, losses: 4` for **both** teams regardless of selection | Team comparison stats are identical and fake for every team |

**Verdict:** The UI presents itself as data-rich, but **none of the data is real or sourced from an API**. This is the biggest credibility killer.

### 1.2 Broken ML Architecture (Critical)

The project has **three separate, contradictory prediction systems** that don't talk to each other.

#### System A: Backend Flask (`backend/model.py`)
- Hardcodes **70 matches** as a Python list inside the file.
- Uses `home_goals` and `away_goals` as **features** to predict the match outcome.
- **This is data leakage.** You cannot use the final score as a feature to predict the final score.
- Fake metrics: `precision = accuracy + 0.01`, `f1_score = accuracy - 0.01`. These are not real precision/F1 — they are approximations derived from accuracy.
- Cross-validation on 70 samples with 5 folds = ~14 samples per fold. Statistically meaningless.

#### System B: Browser Pyodide (`src/features/services/PyodideService.ts`)
- Loads a **second Python ML engine** inside the browser using Pyodide.
- This is a completely separate `FootballPredictor` class that never sees the backend data.
- If the user types in values, Pyodide runs them through a model trained on... nothing (the browser code doesn't load any training data by default).
- **This code is dead.** `MLService.ts` does not call Pyodide. It goes to the backend or falls back to heuristics.

#### System C: Frontend Heuristics (`src/features/services/MLService.ts`)
- Tries to call the Render backend. If it fails, falls back to `getFallbackPredictions()`.
- The fallback is literally: `if (homeGoals > awayGoals) predict "Home Win"`.
- The confidence is `60 + goalDiff * 8`. So if you type 2-0, it predicts "Home Win" with 76% confidence. **The model is just a calculator.**
- Even when the backend is called, the frontend **overrides** the backend's `modelAccuracy` with hardcoded values (`0.62`, `0.68`, `0.65`) because the backend returns inflated in-sample accuracy (~98%).

#### System D: Frontend Python Modules (`src/features/python/models/prediction.py`)
- Hardcoded confidence values for edge cases: if `home_red_cards >= 5`, returns exactly `95.0%, 96.0%, 97.0%` confidence for all three models.
- `confidence = max(80.0, float(probs[pred_idx] * 100))` — forces minimum 80% confidence even when the model is unsure. **This is dishonest UX.**
- The feature engineering produces 20 features but the models are only trained on the original 8 because the data path is broken.

**Verdict:** The ML is a Frankenstein of four inconsistent systems. There is no single source of truth, no model persistence, and no honest evaluation.

### 1.3 Gimmicky UI Features

| Feature | Reality |
|---------|---------|
| "AI-Powered Predictions" badge | It's a heuristic calculator, not AI |
| "Training Cycle Indicator" with progress bar | `setInterval` every 30s calls `mlService.improveModels()` which is an **empty no-op function** |
| Interactive Match Timeline | Randomly generates fake events with names like "James Smith" every 5 seconds |
| Live Match Updates | `matchUpdateService` invents goals and cards with `Math.random()` |
| Weather Impact | Shows fake weather for Camp Nou and Bernabeu even when both teams are English |
| Team Ranking Visualization | Displays a hardcoded table that doesn't match any real season |
| Prediction Streak Tracker | No persistence layer; likely resets on refresh |
| Confidence Calibration | Frontend forces minimum 80% confidence |
| Match Simulation | Completely random, not based on any model |
| Player Injury Report | Shows injuries dated 2025 — in the future |
| Betting Odds Comparison | Only works for 3 hand-picked matchups |

### 1.4 Structural & Code Quality Issues

1. **Package name is `vite_react_shadcn_ts`** — the default from `npm create`. It was never renamed.
2. **Empty folders** — `src/app/`, `src/utils/`, `src/components/`, `src/pages/`, `src/services/`, `src/types/` all contain `.gitkeep` files but are unused. This is dead weight.
3. **Massive UI component bloat** — `src/shared/components/ui/` has 40+ shadcn components. Most are unused. The repo is bloated with radix primitives that add nothing.
4. **Dual Python implementations** — `backend/model.py` and `src/features/python/` contain nearly identical predictor logic. One is never used.
5. **No tests** — There are no unit tests, no integration tests, no data validation tests.
6. **No CI/CD** — `.github/` has issue templates but no workflows for testing, linting, or deployment.
7. **No environment management** — `requirements.txt` has no versions pinned. `backend/requirements.txt` duplicates the root one.
8. **No data pipeline** — Data is hardcoded in `.ts` and `.py` files. No CSV, no database, no API ingestion.

---

## Part 2: What a Proper Football ML Project Looks Like

### 2.1 The Core Problem (Pre-Match Prediction)

A **real** football prediction model predicts the outcome **before the match starts**. It cannot use:
- Final goals scored (data leakage)
- Final shots (data leakage — shots happen during the match)
- Final red cards (data leakage)

It **can** use:
- Rolling form (last 5, last 10 matches)
- Home/away performance metrics
- Head-to-head history
- Expected goals (xG) from previous matches
- Team Elo ratings
- Player availability (injuries/suspensions)
- Days since last match (fatigue)
- League position and points
- Bookmaker implied probabilities (strong baseline)

### 2.2 Honest Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Data Layer                                                  │
│  - Ingest Football-Data.co.uk CSVs (2000+ matches/season)   │
│  - Store in SQLite or DuckDB                                 │
│  - Feature engineering pipeline (pre-match features only)   │
├─────────────────────────────────────────────────────────────┤
│  ML Pipeline                                                 │
│  - Time-based train/test split (no random shuffle)          │
│  - Feature: rolling form, xG, Elo, H2H, league position     │
│  - Models: Logistic Regression, XGBoost, LightGBM           │
│  - Evaluation: accuracy, log loss, Brier score, ROI vs odds│
│  - Benchmark: always predict home win (~46% baseline)       │
├─────────────────────────────────────────────────────────────┤
│  Backend (Flask / FastAPI)                                   │
│  - `/api/predict` — takes two team names, returns probs     │
│  - `/api/teams` — returns available teams & recent form     │
│  - `/api/matches` — returns upcoming fixtures from API      │
│  - `/api/evaluate` — returns model performance on holdout   │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)                                            │
│  - Clean, minimal UI — select two teams, see prediction     │
│  - Show honest confidence intervals, not fake 80% floors   │
│  - Display feature importance (why this prediction?)        │
│  - No fake weather, no fake injuries, no fake live timeline   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Honest Evaluation

- **Baseline:** Always predict home win = ~46% in Premier League. Any model must beat this.
- **Bookmaker benchmark:** Convert odds to probabilities. A model that beats the bookmaker's margin is genuinely impressive.
- **Brier score:** Measures probability calibration. A well-calibrated model should have Brier score < 0.25 for 3-way outcomes.
- **Log loss:** The standard metric for probabilistic classification.
- **Time-split CV:** Train on 2015-2022, test on 2023-2024. Never shuffle matches randomly.

---

## Part 3: Transformation Plan

### Phase 1: Kill the Gimmicks (Week 1)

**Delete everything that is fake:**

- [ ] Remove `weatherService.ts` and the `WeatherImpact` component. If you want weather, integrate OpenWeatherMap API for real data. Otherwise, delete it.
- [ ] Remove `injuryService.ts` and `PlayerInjuryReport`. If you want injuries, integrate API-Football or Transfermarkt. Otherwise, delete it.
- [ ] Remove `bettingOddsService.ts` and `BettingOddsComparison`. If you want odds, use Oddschecker or Betfair API. Otherwise, delete it.
- [ ] Remove `momentumService.ts` — calculate real momentum from the actual match database instead.
- [ ] Remove `matchSimulationService.ts` and `InteractiveMatchTimeline`. A match simulation without a real physics or statistical model is just a toy.
- [ ] Remove `MatchUpdateService.ts` — fake live updates are embarrassing.
- [ ] Remove `teamRankingService.ts` — compute real standings from the data.
- [ ] Remove `PyodideService.ts` and the entire `src/features/python/` directory. Running Python in the browser is unnecessary when you have a Flask backend. It adds 10MB+ to the bundle and the code is dead anyway.
- [ ] Remove `prediction.py` hardcoded edge cases and `confidence = max(80.0, ...)` floor.
- [ ] Remove all `.gitkeep` files from empty folders and delete the folders.
- [ ] Remove unused shadcn UI components. Keep only: Button, Card, Input, Select, Table, Tabs, Badge, Skeleton, Toast. Delete the rest (~30 components).
- [ ] Remove `src/features/services/ml/NaiveBayes.ts`, `LogisticRegression.ts`, `RandomForest.ts`, `FeatureEngineering.ts` — these are TypeScript reimplementations of Python algorithms. They are unused and unnecessary.

### Phase 2: Build a Real Data Pipeline (Week 1-2)

- [ ] Download historical Premier League data from **football-data.co.uk** (free, CSV format, goes back to 1993).
- [ ] Create a `data/` folder with raw CSVs and a `src/data/` Python module for ingestion.
- [ ] Build a feature engineering pipeline that produces **pre-match features only**:
  - `home_form_pts` — points from last 5 home matches
  - `away_form_pts` — points from last 5 away matches
  - `home_xg_rolling` — rolling average xG (if available) or goals scored
  - `away_xg_rolling`
  - `h2h_home_wins` — home team wins in last 5 H2H
  - `home_elo`, `away_elo` — Elo ratings (implement simple Elo update)
  - `home_league_pos`, `away_league_pos` — current table position
  - `days_since_last_match_home`, `days_since_last_match_away` — rest days
- [ ] Store processed data in SQLite or Parquet.
- [ ] Add a `scripts/fetch_data.py` that can refresh the database with new season data.

### Phase 3: Rewrite the ML Backend (Week 2-3)

- [ ] **Single model file** — consolidate everything into `backend/`.
- [ ] Remove the hardcoded 70-match list. Train on the full historical dataset (380 matches/season × 20+ seasons = 7,000+ matches).
- [ ] Remove `home_goals` and `away_goals` from features. Use **only pre-match features**.
- [ ] Implement time-based split: train on seasons ≤ 2022-23, test on 2023-24.
- [ ] Add proper metrics: `accuracy`, `precision`, `recall`, `f1`, `log_loss`, `brier_score_loss`.
- [ ] Add a benchmark: compare against "always predict home win" and bookmaker implied probabilities.
- [ ] Add model persistence: save trained model with `joblib` to `backend/models/`.
- [ ] Add a `retrain.py` script that can be run to rebuild the model.
- [ ] Honest API responses: return `modelAccuracy`, `logLoss`, `brierScore`, and `baselineComparison`.

### Phase 4: Rewrite the Frontend (Week 3-4)

- [ ] Delete the entire `src/shared/` and `src/features/` directories. Keep only what is needed.
- [ ] New minimal structure:
  ```
  src/
  ├── components/
  │   ├── ui/          # ~8 shadcn components
  │   ├── PredictionForm.tsx
  │   ├── PredictionResult.tsx
  │   ├── ModelMetrics.tsx
  │   └── TeamSelector.tsx
  ├── services/
  │   └── api.ts       # Single API client
  ├── types/
  │   └── index.ts
  ├── hooks/
  │   └── usePrediction.ts
  ├── App.tsx
  └── main.tsx
  ```
- [ ] The frontend should:
  - Show a dropdown of teams
  - Fetch prediction from backend
  - Display the three probabilities (home win, draw, away win) with **honest** confidence bars
  - Show a "Why this prediction?" section with feature importance
  - Show model performance metrics from `/api/evaluate`
  - **No animations that suggest "AI is thinking"** — just show results
- [ ] Remove framer-motion bloat. Use CSS transitions for hover states only.
- [ ] Remove the gradient badges, "AI-Powered" marketing language, and fake stats cards.

### Phase 5: Professionalize the Repo (Week 4)

- [ ] Rename package in `package.json` to `vartificial-intelligence`.
- [ ] Write a **honest README**:
  - Explain what the model actually does (pre-match prediction using form, Elo, H2H)
  - State the dataset size and date range
  - Show honest metrics with baseline comparison
  - List known limitations (football is unpredictable, model does not beat bookmakers consistently, etc.)
  - Include setup instructions and the `retrain.py` command
- [ ] Add a `Makefile` or `justfile` for common tasks: `make train`, `make dev`, `make test`.
- [ ] Add GitHub Actions workflow for Python tests (`pytest`) and frontend build.
- [ ] Add `pytest` tests for the data pipeline and model evaluation.
- [ ] Add a `LICENSE` (keep MIT) and `CONTRIBUTING.md` (optional but nice).
- [ ] Clean `.gitignore` — add Python, Node, OS, and data file rules.
- [ ] Delete `DEVLOG.md`, `CHANGELOG.md` (unless they are real). They are empty or template files.
- [ ] Delete `docs/` folder content. The docs are boilerplate.
- [ ] Ensure the repo root has ≤ 10 visible files. Move configs into folders where possible.

### Phase 6: Deployment (Week 4)

- [ ] Add a `Dockerfile` for the backend.
- [ ] Deploy backend to **Render** or **Railway** (free tier).
- [ ] Deploy frontend to **Vercel** (free tier).
- [ ] Ensure the frontend `.env` points to the deployed backend.
- [ ] Verify end-to-end: select two teams, get a real prediction, check the metrics.

---

## Part 4: File-by-File Deletion List

These files should be **deleted or heavily rewritten**:

| File | Action | Reason |
|------|--------|--------|
| `src/features/services/PyodideService.ts` | **DELETE** | Dead code, bloated, unnecessary |
| `src/features/services/ml/*.ts` | **DELETE** | TS reimplementations of sklearn, unused |
| `src/features/python/` (entire dir) | **DELETE** | Duplicate Python code, never executed |
| `src/shared/utils/weatherService.ts` | **DELETE** | Fake data for 6 stadiums |
| `src/shared/utils/injuryService.ts` | **DELETE** | Fake injuries with 2025 dates |
| `src/shared/utils/bettingOddsService.ts` | **DELETE** | Only 3 matchups have data |
| `src/shared/utils/momentumService.ts` | **DELETE** | Hardcoded momentum scores |
| `src/shared/utils/matchSimulationService.ts` | **DELETE** | Random simulation |
| `src/shared/services/MatchUpdateService.ts` | **DELETE** | Fake live events with random names |
| `src/shared/utils/teamRankingService.ts` | **DELETE** | Hardcoded league table |
| `src/shared/utils/predictionExplanationService.ts` | **REWRITE** | Likely fake explanations |
| `src/shared/utils/headToHeadStats.ts` | **REWRITE** | Should query real data |
| `src/shared/utils/heatmapService.ts` | **DELETE** | Decorative, not data-driven |
| `src/shared/utils/userFeedbackService.ts` | **DELETE** | No backend persistence |
| `src/shared/utils/matchHistory.ts` | **DELETE** | Stored in localStorage, not real |
| `src/shared/utils/exportPredictions.ts` | **DELETE** | Exports fake predictions |
| `src/shared/utils/confidenceCalibration.ts` | **DELETE** | Likely fake calibration |
| `src/shared/utils/data/players.ts` | **DELETE** | Fake player rosters |
| `src/shared/utils/data/models.ts` | **DELETE** | Fake model performance data |
| `src/shared/utils/constants/teamData.ts` | **DELETE** | Hardcoded formations/rankings |
| `src/shared/components/InteractiveMatchTimeline.tsx` | **DELETE** | Fake live simulation |
| `src/shared/components/RealTimeMatchUpdates.tsx` | **DELETE** | Fake live updates |
| `src/shared/components/RealTimeMatchButton.tsx` | **DELETE** | Triggers fake updates |
| `src/shared/components/WeatherImpact.tsx` | **DELETE** | Uses fake weather |
| `src/shared/components/PlayerInjuryReport.tsx` | **DELETE** | Uses fake injuries |
| `src/shared/components/BettingOddsComparison.tsx` | **DELETE** | Uses fake odds |
| `src/shared/components/MatchSimulation.tsx` | **DELETE** | Random simulation UI |
| `src/shared/components/TrainingCycleIndicator.tsx` | **DELETE** | No-op training animation |
| `src/shared/components/PredictionStreakTracker.tsx` | **DELETE** | No persistence |
| `src/shared/components/TeamFormation.tsx` | **DELETE** | Hardcoded formations |
| `src/shared/components/AdvancedFormationVisualization.tsx` | **DELETE** | Decorative, no data |
| `src/shared/components/TeamNews.tsx` | **DELETE** | No news API |
| `src/shared/components/SharePredictionsButton.tsx` | **DELETE** | Shares fake predictions |
| `src/shared/components/ExportPredictionsButton.tsx` | **DELETE** | Exports fake data |
| `src/shared/components/FeedbackDashboard.tsx` | **DELETE** | No backend feedback system |
| `src/shared/components/AdvancedFilterOptions.tsx` | **DELETE** | Filters that don't filter real data |
| `src/shared/components/PredictionAccuracyStats.tsx` | **DELETE** | Fake accuracy claims |
| `src/shared/components/icons/*.tsx` | **DELETE** | Use `lucide-react` instead |
| `src/shared/components/TeamComparisonSkeleton.tsx` | **DELETE** | Skeleton for fake component |
| `src/shared/components/PredictionResultsSkeleton.tsx` | **DELETE** | Skeleton for fake component |
| `src/shared/components/TeamInputSkeleton.tsx` | **DELETE** | Skeleton for fake component |
| `src/shared/components/TeamComparison.tsx` | **REWRITE** | Hardcoded stats (12/6/4) |
| `src/shared/components/TeamRankingVisualization.tsx` | **REWRITE** | Hardcoded table |
| `src/shared/components/TeamPlayers.tsx` | **DELETE** | Uses fake players |
| `src/shared/components/PlayerStatisticsVisualization.tsx` | **DELETE** | Uses fake players |
| `src/shared/components/PlayerStatsRadarChart.tsx` | **DELETE** | No real player data |
| `src/shared/components/TeamPerformanceRadarChart.tsx` | **DELETE** | No real performance data |
| `src/shared/components/TeamPerformanceComparison.tsx` | **DELETE** | Duplicate of TeamComparison |
| `src/shared/components/ModelTrainingVisualization.tsx` | **DELETE** | No real training viz |
| `src/shared/components/ConfidenceCalibration.tsx` | **DELETE** | Fake calibration |
| `src/shared/components/DetailedConfidenceIndicator.tsx` | **DELETE** | Fake confidence floor |
| `src/shared/components/PredictionConfidenceOverview.tsx` | **DELETE** | Duplicate of PredictionCard |
| `src/shared/components/PredictionExplanation.tsx` | **REWRITE** | Must use real feature importance |
| `src/shared/components/TeamMomentum.tsx` | **DELETE** | Uses fake momentum |
| `src/shared/components/ConfidenceIndicator.tsx` | **REWRITE** | Remove 80% floor |
| `src/shared/components/HeadToHeadStats.tsx` | **REWRITE** | Query real data |
| `src/shared/components/MatchHistory.tsx` | **DELETE** | localStorage history of fake predictions |
| `src/shared/components/MatchResultUpdater.tsx` | **DELETE** | No real match results API |
| `src/shared/components/ModelComparisonChart.tsx` | **REWRITE** | Must use real backend metrics |
| `src/shared/components/ModelPerformanceChart.tsx` | **REWRITE** | Must use real backend metrics |
| `src/shared/components/StatsRadarChart.tsx` | **DELETE** | No real data |
| `src/shared/components/TrainingExplanation.tsx` | **DELETE** | Marketing fluff |
| `src/shared/components/TeamDisplay.tsx` | **DELETE** | Decorative |
| `src/shared/components/MatchStatsCard.tsx` | **REWRITE** | Remove hardcoded stats |
| `src/shared/components/SearchableTeamSelect.tsx` | **KEEP** | Reusable, but simplify |
| `src/shared/components/TeamInputForm.tsx` | **REWRITE** | Remove advanced fake options |
| `src/shared/components/PredictionCard.tsx` | **REWRITE** | Remove fake confidence floor |
| `src/shared/components/PredictionResults.tsx` | **REWRITE** | Use real backend data only |
| `src/shared/components/TeamInputSkeleton.tsx` | **DELETE** | Unnecessary |
| `src/shared/components/PredictionResultsSkeleton.tsx` | **DELETE** | Unnecessary |
| `src/shared/components/TeamComparisonSkeleton.tsx` | **DELETE** | Unnecessary |
| `src/shared/components/charts/ConfidenceBar.tsx` | **REWRITE** | Honest probabilities |
| `src/shared/components/charts/ModelComparisonChart.tsx` | **REWRITE** | Real metrics |
| `src/shared/components/charts/ModelPerformanceChart.tsx` | **REWRITE** | Real metrics |
| `src/shared/components/charts/TeamPerformanceRadarChart.tsx` | **DELETE** | No real data |
| `src/shared/components/charts/StatsRadarChart.tsx` | **DELETE** | No real data |
| `src/shared/components/charts/PlayerStatsRadarChart.tsx` | **DELETE** | No real data |
| `src/shared/components/layout/MainLayout.tsx` | **REWRITE** | Remove training indicator |
| `src/shared/components/layout/ThemeToggle.tsx` | **KEEP** | Fine to have dark mode |
| `src/shared/components/layout/ThemeProvider.tsx` | **KEEP** | Fine |
| `src/shared/pages/Index.tsx` | **REWRITE** | Remove all fake data sections |
| `src/shared/pages/NotFound.tsx` | **KEEP** | Fine |
| `backend/model.py` | **REWRITE** | Real data, real features, real evaluation |
| `backend/app.py` | **REWRITE** | Add `/api/evaluate`, `/api/teams`, `/api/matches` |
| `notebooks/01_model_training.ipynb` | **REWRITE** | Real exploratory analysis on real data |
| `README.md` | **REWRITE** | Honest, detailed, no marketing fluff |
| `package.json` | **EDIT** | Rename project, remove unused deps (pyodide, framer-motion) |
| `tsconfig.json` | **KEEP** | Fine |
| `vite.config.ts` | **KEEP** | Fine |
| `tailwind.config.ts` | **KEEP** | Fine |
| `postcss.config.js` | **KEEP** | Fine |
| `eslint.config.js` | **KEEP** | Fine |
| `index.html` | **EDIT** | Update title |
| `DEVLOG.md` | **DELETE** | Empty/template |
| `CHANGELOG.md` | **DELETE** | Empty/template |
| `docs/` (entire dir) | **DELETE** | Boilerplate docs |
| `.github/ISSUE_TEMPLATE/` | **DELETE** | Unnecessary for a portfolio project |
| `.github/PULL_REQUEST_TEMPLATE.md` | **DELETE** | Unnecessary |
| `CODE_OF_CONDUCT.md` | **DELETE** | Unnecessary for a solo project |
| `CONTRIBUTING.md` | **DELETE** | Unnecessary for a solo project |
| `requirements.txt` (root) | **DELETE** | Only backend needs deps |
| `backend/requirements.txt` | **REWRITE** | Pin versions, add xgboost, lightgbm, pytest |
| `public/*.svg` | **DELETE** | Generic banner images, use text or simple CSS |

---

## Part 5: The Honest README Template

After hardening, the README should look like this:

```markdown
# VARtificial Intelligence

Football match outcome prediction using historical Premier League data and
scikit-learn. Predicts pre-match probabilities (Home Win / Draw / Away Win) from
rolling form, Elo ratings, head-to-head history, and league position.

**⚠️ Limitations:** Football is inherently unpredictable. This model does not
consistently beat bookmaker odds. It is a demonstration of ML pipeline engineering,
not a profitable betting system.

## Dataset
- Source: [football-data.co.uk](https://www.football-data.co.uk/)
- Coverage: Premier League 2000-2024 (~9,000 matches)
- Features: rolling form, xG, Elo, H2H, rest days, league position
- **No in-match statistics are used as features** (no data leakage)

## Model Performance (Holdout: 2023-24 Season)
| Model | Accuracy | Log Loss | Brier Score | vs Baseline* |
|-------|----------|----------|-------------|--------------|
| Logistic Regression | 48.7% | 1.02 | 0.22 | +2.1% |
| Random Forest | 49.2% | 0.98 | 0.21 | +2.6% |
| XGBoost | 50.1% | 0.95 | 0.20 | +3.5% |
| Baseline (always home) | 46.6% | — | — | — |

*Baseline: always predict home win.

## Tech Stack
- **Backend:** Python 3.11, Flask, scikit-learn, XGBoost, pandas, SQLite
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Data:** football-data.co.uk CSVs, processed with pandas

## Quick Start
```bash
# 1. Fetch data
python scripts/fetch_data.py

# 2. Train model
python scripts/train.py

# 3. Start backend
cd backend && python app.py

# 4. Start frontend
npm install && npm run dev
```

## API
| Endpoint | Description |
|----------|-------------|
| `GET /api/teams` | Available teams with recent form |
| `POST /api/predict` | Predict match outcome |
| `GET /api/evaluate` | Model performance on holdout set |

## Project Structure
```
vartificial-intelligence/
├── backend/          # Flask API, model training, evaluation
├── data/             # Raw CSVs and processed SQLite DB
├── frontend/         # React application (was src/)
├── notebooks/        # EDA and model comparison
├── scripts/          # Data fetching and retraining
└── README.md
```

## License
MIT
```

---

## Conclusion

This project has **good scaffolding** (React, Flask, scikit-learn) but **terrible ML substance**. The UI is polished enough to fool a casual observer, but the code reveals:

1. **Fake data** in every service layer
2. **Data leakage** in the core model (using goals to predict goals)
3. **Four contradictory prediction systems** that don't agree
4. **Dishonest confidence scores** (80% minimum floor)
5. **Fake metrics** (precision = accuracy + 0.01)
6. **Gimmicky UI** (fake live matches, fake training cycles, fake weather)

To make this a **proper ML project**:
- **Delete ~60% of the frontend code** (all fake services and decorative components)
- **Build a real data pipeline** from football-data.co.uk
- **Use only pre-match features** (no goals/shots/red cards as inputs)
- **Train on 7,000+ matches** with time-based splits
- **Report honest metrics** with baseline comparison
- **Simplify the UI** to do one thing well: pick two teams, see a prediction, understand why

The transformation is **2-4 weeks of focused work** for a competent developer. The result will be a **creditable portfolio piece** that can survive a technical interview.
