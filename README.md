# VARtificial Intelligence

Football match outcome prediction using a React + TypeScript frontend and a Python + Flask backend with scikit-learn models.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen)](https://var-tificial-intelligence.vercel.app/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## Live Demo

https://var-tificial-intelligence.vercel.app/

## What this project does

- Predicts match outcomes with multiple ML models
- Compares model confidence and performance metrics
- Visualizes team, player, and match statistics
- Supports local development for both frontend and backend

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Python 3.11
- Flask
- scikit-learn
- NumPy / Pandas

## Quick Start

### 1) Clone and install frontend dependencies

```bash
npm install
```

### 2) Start backend API

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Backend URL: `http://localhost:5000`

### 3) Start frontend app

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

## Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Current variables:

- `VITE_API_URL` - backend API base URL

## NPM Scripts

- `npm run dev` - run Vite dev server
- `npm run build` - type-check and production build
- `npm run lint` - lint the project
- `npm run preview` - preview production build locally

## API Endpoints (Backend)

- `GET /api/health` - health check
- `GET /api/models` - model metadata and performance
- `POST /api/predict` - prediction request

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

## Project Structure

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

## Documentation

- [Docs Index](docs/README.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Backend Guide](backend/README.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## License

MIT - see [LICENSE](LICENSE).
