export interface Team {
  name: string;
  goals: string;
  shots: string;
  shotsOnTarget: string;
  redCards: string;
}

export interface MatchPrediction {
  modelName: string;
  outcome: string;
  confidence: number;
  modelAccuracy: number;
}

export interface ModelPerformance {
  name: string;
  accuracy: number;
  precision: number;
  f1Score: number;
}