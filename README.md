# VARtificial Intelligence

**Real Machine Learning for Football Match Outcome Prediction**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen)](https://var-tificial-intelligence.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-green)](https://flask.palletsprojects.com/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange)](https://scikit-learn.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🎯 Live Demo

**[https://var-tificial-intelligence.vercel.app/](https://var-tificial-intelligence.vercel.app/)**

A full-stack application with a **Python/Flask backend** running real scikit-learn models and a **React/TypeScript frontend**.

## 📊 Model Performance

| Model | Accuracy | Precision | F1 Score |
|-------|----------|-----------|----------|
| Naive Bayes | 62% | 63% | 61% |
| **Random Forest** | **68%** | **69%** | **68%** |
| Logistic Regression | 65% | 66% | 65% |

*Evaluated using 5-fold cross-validation on Premier League 2022-23 data.*

## 🏗️ Architecture

```
┌─────────────────┐      HTTP/REST      ┌─────────────────┐
│  React Frontend │ ◄─────────────────► │  Flask Backend  │
│  (Vercel)       │                     │  (Render)       │
└─────────────────┘                     └─────────────────┘
                                               │
                                               ▼
                                        ┌─────────────────┐
                                        │  scikit-learn   │
                                        │  ML Models      │
                                        └─────────────────┘
```

## ✨ Features

- **3 Ensemble ML Models**: Naive Bayes, Random Forest, Logistic Regression
- **Real-time Predictions**: Live predictions via Flask REST API
- **Team Analytics**: League table, team momentum, player stats
- **Match Simulation**: Interactive match simulations
- **Prediction History**: Track prediction accuracy over time
- **Responsive Design**: Works on desktop and mobile

## 🚀 Quick Start

### Backend (Python)

```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at `http://localhost:5000`

### Frontend (React)

```bash
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

## 🧠 ML Models

The backend uses three classifiers trained on Premier League 2022-23 data:

| Model | Algorithm | Description |
|-------|-----------|-------------|
| **Naive Bayes** | Gaussian NB | Probabilistic baseline classifier |
| **Random Forest** | 100 trees, max_depth=10 | Best performing ensemble method |
| **Logistic Regression** | L2 regularization | Linear baseline model |

### Features Used

- Goal difference
- Shot difference  
- Shot efficiency (shots on target / total shots)
- Red card impact

## 🔌 API Endpoints

### `GET /api/health`
Health check endpoint.

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

## 📁 Project Structure

```
VARtificial-Intelligence/
├── backend/                 # Python Flask API
│   ├── app.py              # Flask application
│   ├── model.py            # ML model implementation
│   ├── requirements.txt    # Python dependencies
│   ├── runtime.txt         # Python version
│   └── README.md           # Deployment guide
├── src/                    # React frontend
│   ├── features/           # ML service integration
│   ├── shared/             # UI components
│   └── core/               # App configuration
├── notebooks/              # Jupyter notebooks for analysis
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # MIT License
└── README.md
```

## 🌐 Deployment

### Backend (Render)
1. Deploy `backend/` folder to [Render](https://render.com)
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `gunicorn app:app`

### Frontend (Vercel)
1. Set environment variable: `VITE_API_URL=https://your-backend-url`
2. Deploy to [Vercel](https://vercel.com)

## 🛠️ Tech Stack

**Backend:**
- Python 3.11
- Flask 3.0
- scikit-learn 1.3
- NumPy
- Gunicorn

**Frontend:**
- React 18
- TypeScript 5
- Tailwind CSS
- Framer Motion
- Recharts

## 📝 License

MIT License - see [LICENSE](LICENSE)

## 🙏 Acknowledgments

- Premier League match data from the 2022-23 season
- scikit-learn for ML implementations
- Render for backend hosting
- Vercel for frontend hosting