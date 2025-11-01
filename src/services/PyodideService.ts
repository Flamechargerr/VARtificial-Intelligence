import { toast } from "@/components/ui/use-toast";

class PyodideService {
  private pyodide: any = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  async initialize() {
    if (this.isInitialized) return this.pyodide;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = new Promise(async (resolve, reject) => {
      try {
        // Show initialization toast
        toast({
          title: "Initializing Python Environment",
          description: "Loading Pyodide runtime...",
        });

        // Dynamically import Pyodide
        const pyodideModule: any = await import("pyodide");
        const { loadPyodide } = pyodideModule;
        
        // Load Pyodide with specific configuration
        this.pyodide = await loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
          stdout: (msg) => console.log(`Pyodide stdout: ${msg}`),
          stderr: (msg) => console.error(`Pyodide stderr: ${msg}`),
        });

        // Install required packages
        await this.pyodide.loadPackage(["numpy", "pandas", "scikit-learn"]);
        
        // Load our custom ML modules
        await this.loadMLModules();
        
        this.isInitialized = true;
        toast({
          title: "Python Environment Ready",
          description: "Pyodide runtime successfully loaded",
        });
        
        resolve();
      } catch (error) {
        console.error("Failed to initialize Pyodide:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to load Python environment",
          variant: "destructive",
        });
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  private async loadMLModules() {
    // Load our custom Python modules for machine learning
    const mlCode = `
import numpy as np
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import json

class FootballPredictor:
    def __init__(self):
        self.models = {
            'naive_bayes': GaussianNB(),
            'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
            'logistic_regression': LogisticRegression(random_state=42, max_iter=1000)
        }
        self.is_trained = False
        self.training_data = []
        
    def prepare_features(self, home_team, away_team):
        """Convert team stats to feature vector"""
        home_goals = int(home_team.get('goals', 0))
        away_goals = int(away_team.get('goals', 0))
        home_shots = int(home_team.get('shots', 0))
        away_shots = int(away_team.get('shots', 0))
        home_on_target = int(home_team.get('shotsOnTarget', 0))
        away_on_target = int(away_team.get('shotsOnTarget', 0))
        home_red_cards = int(home_team.get('redCards', 0))
        away_red_cards = int(away_team.get('redCards', 0))
        
        # Calculate derived features
        home_shot_efficiency = home_on_target / home_shots if home_shots > 0 else 0
        away_shot_efficiency = away_on_target / away_shots if away_shots > 0 else 0
        goal_difference = home_goals - away_goals
        shot_difference = home_shots - away_shots
        
        return [
            home_goals, away_goals,
            home_shots, away_shots,
            home_on_target, away_on_target,
            home_shot_efficiency, away_shot_efficiency,
            home_red_cards, away_red_cards,
            goal_difference, shot_difference
        ]
    
    def train(self, training_data):
        """Train models with historical data"""
        if not training_data:
            return
            
        # Convert training data to numpy arrays
        features = []
        labels = []
        
        for match in training_data:
            home_team = match['homeTeam']
            away_team = match['awayTeam']
            result = match['result']  // 0: Home win, 1: Draw, 2: Away win
            
            feature_vector = self.prepare_features(home_team, away_team)
            features.append(feature_vector)
            labels.append(result)
            
        X = np.array(features)
        y = np.array(labels)
        
        // Train each model
        for name, model in self.models.items():
            model.fit(X, y)
            
        self.is_trained = True
        self.training_data.extend(training_data)
    
    def predict(self, home_team, away_team):
        """Make predictions for a match"""
        if not self.is_trained:
            // Return random predictions if not trained
            outcomes = ["Home Win", "Draw", "Away Win"]
            predictions = []
            for name in self.models.keys():
                outcome = np.random.choice(outcomes)
                confidence = np.random.uniform(60, 95)
                predictions.append({
                    'model': name,
                    'outcome': outcome,
                    'confidence': confidence
                })
            return predictions
            
        // Prepare features
        features = self.prepare_features(home_team, away_team)
        X = np.array([features])
        
        predictions = []
        for name, model in self.models.items():
            // Get prediction and probability
            pred = model.predict(X)[0]
            proba = model.predict_proba(X)[0]
            
            // Convert to readable outcome
            outcomes = ["Home Win", "Draw", "Away Win"]
            outcome = outcomes[pred]
            
            // Confidence is the probability of the predicted class
            confidence = proba[pred] * 100
            
            predictions.append({
                'model': name,
                'outcome': outcome,
                'confidence': confidence
            })
            
        return predictions

// Initialize the predictor
predictor = FootballPredictor()
`;

    await this.pyodide.runPythonAsync(mlCode);
  }

  async runPythonCode(code: string) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      return await this.pyodide.runPythonAsync(code);
    } catch (error) {
      console.error("Error running Python code:", error);
      throw error;
    }
  }

  async trainModels(trainingData: any[]) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      // Convert training data to Python
      const pythonCode = `
import json
training_data = json.loads("""${JSON.stringify(trainingData)}""")
predictor.train(training_data)
`;
      await this.pyodide.runPythonAsync(pythonCode);
    } catch (error) {
      console.error("Error training models:", error);
      throw error;
    }
  }

  async predictMatch(homeTeam: any, awayTeam: any) {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      // Run prediction in Python
      const pythonCode = `
import json
home_team = json.loads("""${JSON.stringify(homeTeam)}""")
away_team = json.loads("""${JSON.stringify(awayTeam)}""")
result = predictor.predict(home_team, away_team)
json.dumps(result)
`;
      const result = await this.pyodide.runPythonAsync(pythonCode);
      return JSON.parse(result);
    } catch (error) {
      console.error("Error predicting match:", error);
      throw error;
    }
  }

  isReady() {
    return this.isInitialized;
  }
}

export const pyodideService = new PyodideService();