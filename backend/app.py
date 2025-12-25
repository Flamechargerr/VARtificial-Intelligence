"""
VARtificial Intelligence - ML Backend
Flask API for football match prediction using scikit-learn

This is a real ML backend that:
1. Trains models on Premier League data
2. Serves predictions via REST API
3. Uses actual scikit-learn classifiers
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from model import FootballPredictor

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize and train the model
print("Training ML models...")
predictor = FootballPredictor()
predictor.train()
print("Models trained successfully!")


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "models_trained": predictor.is_trained,
        "model_count": 3
    })


@app.route('/api/models', methods=['GET'])
def get_models():
    """Get model performance metrics"""
    if not predictor.is_trained:
        return jsonify({"error": "Models not trained"}), 500
    
    return jsonify({
        "models": predictor.get_model_performance(),
        "training_samples": predictor.training_samples,
        "features": predictor.feature_names
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Make a prediction for a match
    
    Expected JSON body:
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
    """
    if not predictor.is_trained:
        return jsonify({"error": "Models not trained"}), 500
    
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'home_goals', 'home_shots', 'home_shots_on_target', 'home_red_cards',
            'away_goals', 'away_shots', 'away_shots_on_target', 'away_red_cards'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400
        
        # Make prediction
        predictions = predictor.predict(
            home_goals=int(data['home_goals']),
            home_shots=int(data['home_shots']),
            home_shots_on_target=int(data['home_shots_on_target']),
            home_red_cards=int(data['home_red_cards']),
            away_goals=int(data['away_goals']),
            away_shots=int(data['away_shots']),
            away_shots_on_target=int(data['away_shots_on_target']),
            away_red_cards=int(data['away_red_cards'])
        )
        
        return jsonify({
            "success": True,
            "predictions": predictions
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
