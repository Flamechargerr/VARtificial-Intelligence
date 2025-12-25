# VARtificial Intelligence

**Real Machine Learning for Football Match Outcome Prediction**

A full-stack application with a **Python/Flask backend** running real scikit-learn models and a **React/TypeScript frontend**.

![Python](https://img.shields.io/badge/Python-3.9-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-green)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Architecture

```
┌─────────────────┐      HTTP/REST      ┌─────────────────┐
│  React Frontend │ ◄─────────────────► │  Flask Backend  │
│   (TypeScript)  │                     │    (Python)     │
└─────────────────┘                     └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │  scikit-learn   │
                                        │     Models      │
                                        └─────────────────┘
```

## Quick Start

### 1. Start the Python Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend runs at `http://localhost:5000`

### 2. Start the React Frontend

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## ML Models

The backend uses three classifiers trained on Premier League 2022-23 data:

| Model | Algorithm | Use Case |
|-------|-----------|----------|
| **Naive Bayes** | Gaussian NB | Probabilistic baseline |
| **Random Forest** | 100 trees, max_depth=10 | Best accuracy |
| **Logistic Regression** | L2 regularization | Linear baseline |

### Features Used

- Goal difference
- Shot difference
- Shot efficiency (on-target ratio)
- Red card impact

## API Endpoints

### `GET /api/health`
Health check.

### `GET /api/models`
Get model performance metrics.

### `POST /api/predict`
Make a prediction.

```json
{
  "home_goals": 2,
  "home_shots": 15,
  "home_shots_on_target": 8,
  "home_red_cards": 0,
  "away_goals": 1,
  "away_shots": 10,
  "away_shots_on_target": 5,
  "away_red_cards": 0
}
```

## Project Structure

```
VARtificial-Intelligence/
├── backend/                 # Python Flask API
│   ├── app.py              # Flask application
│   ├── model.py            # ML model implementation
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Deployment guide
├── src/                    # React frontend
│   ├── features/           # ML service integration
│   └── shared/             # UI components
├── notebooks/              # Jupyter notebooks
└── README.md
```

## Deployment

### Backend (Render/Railway)

1. Deploy `backend/` folder to Render or Railway
2. Set start command: `gunicorn app:app`
3. Get your API URL

### Frontend (Vercel)

1. Set environment variable: `VITE_API_URL=https://your-backend-url`
2. Deploy to Vercel

See `backend/README.md` for detailed instructions.

## Tech Stack

**Backend:**
- Python 3.9+
- Flask 3.0
- scikit-learn 1.3
- NumPy

**Frontend:**
- React 18
- TypeScript 5
- Tailwind CSS
- Recharts

## License

MIT License - see [LICENSE](LICENSE)