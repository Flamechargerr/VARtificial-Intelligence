# VARtificial Intelligence - Backend Deployment Guide

## Local Development

### 1. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Flask server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

### 3. Test the API

```bash
# Health check
curl http://localhost:5000/api/health

# Get model performance
curl http://localhost:5000/api/models

# Make a prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "home_goals": 2,
    "home_shots": 15,
    "home_shots_on_target": 8,
    "home_red_cards": 0,
    "away_goals": 1,
    "away_shots": 10,
    "away_shots_on_target": 5,
    "away_red_cards": 0
  }'
```

---

## Production Deployment

### Option 1: Render (Recommended - Free Tier)

1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
5. Deploy

### Option 2: Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Set root directory to `backend`
4. Railway will auto-detect Python and deploy

### Option 3: Heroku

```bash
cd backend
heroku create vartificial-api
git subtree push --prefix backend heroku main
```

---

## Frontend Configuration

After deploying the backend, update the frontend to use your API URL:

### Option 1: Environment Variable

Create `.env` file in the frontend root:

```
VITE_API_URL=https://your-backend-url.com
```

### Option 2: Direct Configuration

Update `src/features/services/MLService.ts`:

```typescript
const API_URL = 'https://your-backend-url.com';
```

---

## API Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "models_trained": true,
  "model_count": 3
}
```

### GET /api/models
Get model performance metrics.

**Response:**
```json
{
  "models": [
    {"name": "Naive Bayes", "accuracy": 0.62, "precision": 0.63, "f1Score": 0.61},
    {"name": "Random Forest", "accuracy": 0.68, "precision": 0.69, "f1Score": 0.68},
    {"name": "Logistic Regression", "accuracy": 0.65, "precision": 0.66, "f1Score": 0.65}
  ],
  "training_samples": 90,
  "features": ["goal_diff", "shot_diff", "shot_efficiency_diff", ...]
}
```

### POST /api/predict
Make a prediction for a match.

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "modelName": "Random Forest",
      "outcome": "Home Win",
      "confidence": 78.5,
      "modelAccuracy": 0.68
    },
    ...
  ]
}
```
