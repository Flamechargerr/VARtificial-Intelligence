export interface Team {
  name: string;
}

export interface PredictionResult {
  outcome: string;
  probability: number;
}

export interface MatchPrediction {
  home_team: string;
  away_team: string;
  predictions: PredictionResult[];
  model_accuracy: number;
  model_log_loss: number;
}

export interface ModelEvaluation {
  model: string;
  accuracy: number;
  log_loss: number;
  baseline_accuracy: number;
  train_size: number;
  test_size: number;
  feature_cols: string[];
}

export interface TeamList {
  teams: string[];
}
