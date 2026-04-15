![VARtificial Intelligence Banner](https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop)

# ⚽ VARtificial Intelligence

> **AI that makes the right call, unlike VAR.** ✨  
> Football match outcome prediction using a React + TypeScript frontend and a Python + Flask backend with scikit-learn models.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen)](https://var-tificial-intelligence.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 🚀 Live Demo

🔗 https://var-tificial-intelligence.vercel.app/

## 🏟️ What this project does

- ⚽ Predicts match outcomes with multiple ML models
- 📊 Compares model confidence and performance metrics
- 🥅 Visualizes team, player, and match statistics
- 💻 Supports local development for both frontend and backend

## 💻 Tech Stack

| Layer | Tools |
| --- | --- |
| 🎨 Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| 🧠 Backend | Python 3.11, Flask, scikit-learn, NumPy / Pandas |

## ⚽ Quick Start

| Step | Command(s) | Result |
| --- | --- | --- |
| 1️⃣ Install frontend dependencies | `npm install` | Prepares the React + TypeScript app |
| 2️⃣ Start backend API | `cd backend`<br>`pip install -r requirements.txt`<br>`python app.py` | Backend runs at `http://localhost:5000` |
| 3️⃣ Start frontend app | `npm run dev` | Frontend runs at `http://localhost:5173` |

## ✨ Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Current variables:

- 📡 `VITE_API_URL` - backend API base URL

## 🚀 NPM Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Run Vite dev server |
| `npm run build` | Type-check and production build |
| `npm run lint` | Lint the project |
| `npm run preview` | Preview production build locally |

## 📊 API Endpoints (Backend)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/models` | Model metadata and performance |
| `POST` | `/api/predict` | Prediction request |

Example payload:

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

## 🥅 Project Structure

For a detailed structure map, see [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md).

```text
VARtificial-Intelligence/
├── backend/        # Flask API and ML model serving
├── docs/           # Project documentation
├── notebooks/      # Research/training notebooks
├── public/         # Static frontend assets
├── src/            # React application source
└── README.md
```

## 📚 Documentation

- [Docs Index](docs/README.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Backend Guide](backend/README.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## 🏆 License

MIT - see [LICENSE](LICENSE).
