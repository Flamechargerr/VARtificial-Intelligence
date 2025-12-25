# VARtificial Intelligence

**Machine Learning for Football Match Outcome Prediction**

A web application that uses ensemble machine learning methods to predict Premier League match outcomes. Built with React/TypeScript frontend and Python/scikit-learn for the ML pipeline.

![Python](https://img.shields.io/badge/Python-3.9-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![scikit-learn](https://img.shields.io/badge/scikit--learn-1.3-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## Overview

This project demonstrates practical application of machine learning classification algorithms for sports outcome prediction. The system uses three ensemble methods and achieves up to **68% accuracy** on Premier League match predictions.

### Key Features

- **Ensemble Methods**: Naive Bayes, Random Forest, Logistic Regression
- **In-Browser ML**: Python models run via Pyodide (WebAssembly)
- **Real Data**: Trained on 95 Premier League 2022-23 matches
- **Cross-Validated**: 5-fold CV for reliable performance metrics

## Model Performance

| Model | Accuracy | Precision | F1 Score |
|-------|----------|-----------|----------|
| Naive Bayes | 62% | 63% | 61% |
| **Random Forest** | **68%** | **69%** | **68%** |
| Logistic Regression | 65% | 66% | 65% |

*Note: Random baseline for 3-way classification is ~33%. Our models significantly outperform this baseline.*

## Installation

```bash
# Clone the repository
git clone https://github.com/Flamechargerr/VARtificial-Intelligence.git
cd VARtificial-Intelligence

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
VARtificial-Intelligence/
├── src/
│   ├── features/
│   │   ├── python/          # Python ML code (runs via Pyodide)
│   │   │   ├── models/      # ML model implementations
│   │   │   ├── feature_engineering.py
│   │   │   └── model_evaluation.py
│   │   └── services/        # TypeScript ML service layer
│   └── shared/
│       ├── components/      # React UI components
│       ├── pages/           # Application pages
│       └── utils/           # Utilities and data
├── notebooks/               # Jupyter notebooks for analysis
│   └── 01_model_training.ipynb
├── requirements.txt         # Python dependencies
└── README.md
```

## Methodology

### Feature Engineering

The model uses the following features derived from match statistics:

- **Goal Difference**: `home_goals - away_goals`
- **Shot Efficiency**: `shots_on_target / total_shots`
- **Shot Difference**: `home_shots - away_shots`
- **Red Card Impact**: Penalty factor for red cards

### Training Pipeline

1. Data preprocessing and feature extraction
2. Feature scaling using StandardScaler
3. 5-fold stratified cross-validation
4. Model selection based on accuracy and F1 score

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Recharts for visualizations

**ML Backend:**
- Python 3.9+ with scikit-learn
- Pyodide for in-browser Python execution
- NumPy/Pandas for data processing

## Limitations & Future Work

### Current Limitations

- **Dataset Size**: Only 95 matches from one season
- **In-Game Stats**: Features require current match statistics
- **Accuracy Ceiling**: Football is inherently unpredictable

### Planned Improvements

- [ ] Historical team performance data
- [ ] Pre-match prediction capability
- [ ] Player-level features
- [ ] Deep learning experiments

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file.

## Acknowledgments

- Premier League match data from the 2022-23 season
- scikit-learn for ML implementations
- Pyodide team for in-browser Python support