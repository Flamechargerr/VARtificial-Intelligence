export interface Team {
  id?: string;
  name: string;
  goals: string;
  shots: string;
  shotsOnTarget: string;
  redCards: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  rating?: number;
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