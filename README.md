# VARtificial Intelligence

> A Machine Learning System for Football Match Outcome Prediction

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.0+-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

## Abstract

VARtificial Intelligence is an end-to-end machine learning pipeline for predicting football match outcomes. The system employs ensemble learning techniques combining Naive Bayes, Random Forest, and Logistic Regression classifiers trained on historical Premier League match statistics. The application features in-browser model inference using Pyodide, enabling real-time predictions without server-side computation.

## Table of Contents

- [Introduction](#introduction)
- [Dataset](#dataset)
- [Methodology](#methodology)
- [Model Architecture](#model-architecture)
- [Feature Engineering](#feature-engineering)
- [Results](#results)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technical Stack](#technical-stack)
- [Future Work](#future-work)
- [Contributing](#contributing)
- [License](#license)
- [References](#references)

## Introduction

Football match prediction is a challenging multi-class classification problem due to the inherent uncertainty and numerous factors influencing match outcomes. This project approaches the problem using statistical features derived from historical match data, implementing multiple classification algorithms to provide robust predictions.

### Problem Statement

Given historical match statistics for two teams, predict the outcome of their encounter:
- **Home Win** (Class 0)
- **Draw** (Class 1)  
- **Away Win** (Class 2)

### Objectives

1. Develop a robust multi-class classification pipeline
2. Implement feature engineering techniques specific to football analytics
3. Create an interactive web interface for real-time predictions
4. Enable client-side ML inference using WebAssembly (Pyodide)

## Dataset

### Data Source

The training data is derived from Premier League match statistics (2022-2023 season) sourced from [Football-Data.co.uk](https://www.football-data.co.uk/), a widely-used repository for football statistics in academic research.

### Features

| Feature | Description | Type |
|---------|-------------|------|
| `home_goals` | Goals scored by home team | Numeric |
| `away_goals` | Goals scored by away team | Numeric |
| `home_shots` | Total shots by home team | Numeric |
| `away_shots` | Total shots by away team | Numeric |
| `home_shots_target` | Shots on target by home team | Numeric |
| `away_shots_target` | Shots on target by away team | Numeric |
| `home_red_cards` | Red cards received by home team | Numeric |
| `away_red_cards` | Red cards received by away team | Numeric |

### Target Variable

- `result`: Match outcome encoded as {0: Home Win, 1: Draw, 2: Away Win}

### Data Statistics

- **Total Samples**: 380 matches
- **Class Distribution**: Home Win (45.3%), Draw (26.3%), Away Win (28.4%)
- **Missing Values**: 0

## Methodology

### Data Preprocessing

1. **Standardization**: Features are standardized using `StandardScaler` to ensure zero mean and unit variance
2. **Train-Test Split**: 80-20 stratified split maintaining class proportions
3. **Data Augmentation**: Gaussian noise injection for samples < 100 to improve generalization

### Cross-Validation Strategy

- 5-fold stratified cross-validation
- Metrics: Accuracy, Precision, Recall, F1-Score
- Random state fixed for reproducibility

## Model Architecture

### Ensemble Approach

The system employs three complementary classifiers:

#### 1. Gaussian Naive Bayes
```python
GaussianNB(var_smoothing=1e-8)
```
- **Rationale**: Fast inference, handles feature independence assumption
- **Strengths**: Computationally efficient, works well with limited data

#### 2. Random Forest Classifier
```python
RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)
```
- **Rationale**: Captures non-linear relationships through decision boundaries
- **Strengths**: Feature importance analysis, robust to overfitting

#### 3. Logistic Regression
```python
LogisticRegression(
    C=0.8,
    max_iter=2000,
    solver='liblinear',
    class_weight='balanced'
)
```
- **Rationale**: Probabilistic interpretations, handles class imbalance
- **Strengths**: Well-calibrated probability estimates

## Feature Engineering

### Derived Features

The feature engineering pipeline creates 12 additional features from the 8 base inputs:

```
Engineered Features:
├── Difference Features
│   ├── goal_difference = home_goals - away_goals
│   ├── shot_difference = home_shots - away_shots
│   ├── target_difference = home_shots_target - away_shots_target
│   └── red_card_difference = home_red - away_red
├── Efficiency Metrics
│   ├── home_shot_efficiency = shots_target / shots
│   ├── away_shot_efficiency = shots_target / shots
│   ├── home_scoring_efficiency = goals / shots_target
│   └── away_scoring_efficiency = goals / shots_target
└── Advanced Features
    ├── efficiency_difference
    ├── scoring_difference
    ├── home_adjusted_efficiency (with red card penalty)
    └── away_adjusted_efficiency (with red card penalty)
```

### Red Card Penalty Factor

```python
penalty = 1.0 / (1.0 + red_cards * 0.5)
```

This applies diminishing returns for multiple red cards, reflecting real-world impact on team performance.

## Results

### Model Performance (5-Fold CV)

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| Naive Bayes | 0.62 ± 0.04 | 0.63 | 0.62 | 0.61 |
| Random Forest | 0.68 ± 0.03 | 0.69 | 0.68 | 0.68 |
| Logistic Regression | 0.65 ± 0.03 | 0.66 | 0.65 | 0.65 |

> **Note**: Football match prediction is inherently difficult due to the stochastic nature of the sport. Baseline accuracy (random guess) is ~33%.

### Feature Importance (Random Forest)

| Rank | Feature | Importance |
|------|---------|------------|
| 1 | Goal Difference | 0.23 |
| 2 | Home Shot Efficiency | 0.15 |
| 3 | Shots on Target Diff | 0.12 |
| 4 | Home Goals | 0.11 |
| 5 | Away Goals | 0.10 |

## Installation

### Prerequisites

- Node.js 18+
- npm or bun

### Setup

```bash
# Clone the repository
git clone https://github.com/Flamechargerr/VARtificial-Intelligence.git
cd VARtificial-Intelligence

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Web Interface

1. Navigate to `http://localhost:5173` after starting the development server
2. Select home and away teams from the dropdown menus
3. Adjust team statistics using the input fields
4. Click "Predict" to generate match outcome predictions
5. View probability distributions and model confidence scores

### Programmatic Usage

```typescript
import { mlService } from './features/services/MLService';

// Train models
await mlService.trainModels();

// Make prediction
const prediction = await mlService.predictMatch(homeTeam, awayTeam);
```

## Project Structure

```
VARtificial-Intelligence/
├── src/
│   ├── core/                    # Application configuration
│   ├── features/
│   │   ├── python/              # ML model implementations
│   │   │   ├── models/          # Classifier definitions
│   │   │   ├── visualization/   # Plotting utilities
│   │   │   ├── feature_engineering.py
│   │   │   └── model_evaluation.py
│   │   └── services/            # TypeScript ML service layer
│   ├── shared/
│   │   ├── components/          # React UI components
│   │   ├── pages/               # Application views
│   │   └── utils/               # Utilities and data
│   └── lib/                     # Third-party integrations
├── docs/                        # Documentation and assets
├── public/                      # Static assets
└── notebooks/                   # Jupyter notebooks (analysis)
```

## Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Shadcn/UI |
| **Visualization** | Recharts, Chart.js |
| **Animation** | Framer Motion |
| **ML Runtime** | Pyodide (Python in WebAssembly) |
| **ML Libraries** | scikit-learn, NumPy, Pandas |

## Future Work

1. **Model Improvements**
   - Implement XGBoost and LightGBM classifiers
   - Add neural network ensemble member
   - Hyperparameter optimization using Optuna

2. **Feature Enhancements**
   - Incorporate historical head-to-head records
   - Add player-level statistics
   - Include venue and weather data

3. **System Improvements**
   - Model versioning and A/B testing
   - Real-time data pipeline integration
   - API endpoint for external predictions

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add improvement'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

Please ensure code follows existing style conventions and includes appropriate tests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## References

1. Hubáček, O., Šourek, G., & Železný, F. (2019). Exploiting sports-betting market using machine learning. *International Journal of Forecasting*, 35(2), 783-796.

2. Constantinou, A. C., Fenton, N. E., & Neil, M. (2012). pi-football: A Bayesian network model for forecasting Association Football match outcomes. *Knowledge-Based Systems*, 36, 322-339.

3. Baboota, R., & Kaur, H. (2019). Predictive analysis and modelling football results using machine learning approach for English Premier League. *International Journal of Forecasting*, 35(2), 741-755.

---

<p align="center">
  <sub>Built with scikit-learn and React • <a href="https://github.com/Flamechargerr/VARtificial-Intelligence">View on GitHub</a></sub>
</p>