<h1 align="center">⚽ Football Match Predictor using Machine Learning</h1>
<p align="center"><em>Advanced analytics to predict match outcomes using a multi-model machine learning pipeline, with interactive frontend visualization.</em></p>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/Flamechargerr/match-predictor-football?style=flat-square" alt="Top Language">
  <img src="https://img.shields.io/github/last-commit/Flamechargerr/match-predictor-football?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square">
  <img src="https://img.shields.io/badge/ML-NaiveBayes|RandomForest|LogisticRegression-yellow?style=flat-square">
</p>

---

## 📌 Project Overview

This project aims to forecast football match results (Home Win, Draw, Away Win) by analyzing match-level statistics using machine learning models.

Built by **Anamay Tripathy** and **Aarnav Pupneja**, students of Data Science Engineering at MIT Manipal, the project combines data preprocessing, EDA, model experimentation, and a clean React-based frontend to deliver a complete data science pipeline and product.

---

## 🎯 Objectives

- ✅ Predict match outcomes using ML models: Naive Bayes, Random Forest, and Logistic Regression  
- ✅ Analyze performance features like shot efficiency, red cards, and goal ratios  
- ✅ Visualize predictions and team stats interactively in a browser  
- ✅ Educate users on how match metrics influence outcomes

---

## 📊 Dataset and Preprocessing

- **Data:** Team-level match statistics: goals, shots, shots on target, red cards  
- **Output Classes:** `Home Win`, `Draw`, `Away Win`  
- **Feature Engineering:**
  - Shot efficiency (Shots on Target / Total Shots)
  - Goal-to-shot ratios
- **EDA Highlights:**
  - Radar charts for team comparisons
  - Correlation plots: shots vs outcomes
  - Red card impact analysis

---

## 🧠 Machine Learning Models

| Model               | Purpose                                      | Accuracy |
|---------------------|----------------------------------------------|----------|
| Gaussian Naive Bayes | Simple probabilistic model                   | ~82%     |
| Random Forest        | Non-linear, ensemble-based classifier        | ~89%     |
| Logistic Regression  | Linear model with regularization            | ~87%     |

- Used **smoothing** in Naive Bayes to handle data sparsity  
- Random Forest tuned with `n=5` trees and `depth=3`  
- TensorFlow.js for logistic regression with `LR=0.005`, `epochs=200`

---

## 🖥️ Frontend UI Features

Built using **React + Tailwind CSS + Shadcn/UI**, the UI provides:

- 📥 Input form for manual match stats entry  
- 📈 Model prediction cards with confidence levels  
- 📊 Radar charts comparing home vs away teams  
- 🎯 Accuracy bar charts per model  
- 🔄 Animated feedback during training and prediction  

> The app is responsive, fast, and works completely in-browser (no server needed).

---

## ⚙️ Stack Used

- **Frontend:** React, Tailwind CSS, Shadcn/UI, TypeScript  
- **ML Execution:** Pyodide (Python in the browser), TensorFlow.js  
- **Visualization:** Chart.js, Recharts  
- **Hosting:** Lovable.io

---

## 🧪 Experimental Setup

- 🖥️ Browser-based computation via WebAssembly  
- 📦 Fully client-side — no backend server  
- 🔄 Training can be done in-browser with performance monitoring  
- 📚 Hyperparameter tuning done statically

---

## 🔍 Key Insights & Error Analysis

- 🟥 Red cards heavily skew match outcomes  
- ⚽ Shot efficiency is more predictive than raw shot count  
- 🧠 Models struggle with evenly matched teams (lower confidence)  
- 💡 Accuracy improves with more training samples per team

---

## 🚀 How to Run Locally

```bash
git clone https://github.com/Flamechargerr/match-predictor-football.git
cd match-predictor-football
npm install
npm run dev
```

Then go to:  
📍 `http://localhost:5173`

✅ All logic runs in-browser using TensorFlow.js and Pyodide — no API keys needed.

---

## 📈 Results Summary

| Model              | Accuracy  |
|--------------------|-----------|
| Naive Bayes        | ~82%      |
| Logistic Regression| ~87%      |
| Random Forest      | ~89%      |

All results verified across random 80-20 train-test splits with cross-validation.

---

## 🔮 Future Scope

- Add **player-level data** for deeper context  
- Incorporate **time-series form tracking**  
- Use **attention-based models** to weigh match features  
- Expand datasets with league-specific trends  
- Host models via ONNX.js or edge ML inference

---

## 🌐 Live Demo

🧠 Try it here: [**match-predictor-genie-66.lovable.app**](https://match-predictor-genie-66.lovable.app)

---

## 👨‍💻 Authors

- **Anamay Tripathy** – [@Flamechargerr](https://github.com/Flamechargerr)  
- **Aarnav Pupneja**

---

## 📝 License

Licensed under the MIT License.

---

> “In football, momentum matters — but so do stats. Let data be your twelfth man.”
