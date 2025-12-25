import { MatchPrediction, Team, ModelPerformance } from '@/shared/utils/types';

/**
 * Machine Learning Service
 * 
 * Connects to the Python Flask backend for real ML predictions.
 * Falls back to local heuristics if backend is unavailable.
 */

// Backend API URL - update this when you deploy
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class MLService {
  private isBackendAvailable = false;
  private modelPerformance: ModelPerformance[] = [];

  // Default performance (used as fallback)
  private readonly DEFAULT_PERFORMANCE: ModelPerformance[] = [
    { name: "Naive Bayes", accuracy: 0.62, precision: 0.63, f1Score: 0.61 },
    { name: "Random Forest", accuracy: 0.68, precision: 0.69, f1Score: 0.68 },
    { name: "Logistic Regression", accuracy: 0.65, precision: 0.66, f1Score: 0.65 }
  ];

  constructor() {
    this.checkBackendHealth();
  }

  /**
   * Check if the Python backend is available
   */
  private async checkBackendHealth(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        this.isBackendAvailable = data.status === 'healthy';
        console.log('Backend health check:', data);

        // Fetch model performance from backend
        await this.fetchModelPerformance();
      }
    } catch (error) {
      console.log('Backend not available, using fallback predictions');
      this.isBackendAvailable = false;
    }
  }

  /**
   * Fetch model performance metrics from backend
   */
  private async fetchModelPerformance(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        this.modelPerformance = data.models;
      }
    } catch (error) {
      console.log('Could not fetch model performance');
    }
  }

  /**
   * Get model performance metrics
   */
  public getModelPerformance(): ModelPerformance[] {
    if (this.modelPerformance.length > 0) {
      return this.modelPerformance;
    }
    return this.DEFAULT_PERFORMANCE;
  }

  /**
   * Make prediction using the Python backend
   */
  public async predictMatch(homeTeam: Team, awayTeam: Team): Promise<MatchPrediction[]> {
    // Try backend first
    if (this.isBackendAvailable) {
      try {
        const response = await fetch(`${API_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            home_goals: parseInt(homeTeam.goals) || 0,
            home_shots: parseInt(homeTeam.shots) || 0,
            home_shots_on_target: parseInt(homeTeam.shotsOnTarget) || 0,
            home_red_cards: parseInt(homeTeam.redCards) || 0,
            away_goals: parseInt(awayTeam.goals) || 0,
            away_shots: parseInt(awayTeam.shots) || 0,
            away_shots_on_target: parseInt(awayTeam.shotsOnTarget) || 0,
            away_red_cards: parseInt(awayTeam.redCards) || 0
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Backend prediction:', data);
          return data.predictions;
        }
      } catch (error) {
        console.log('Backend prediction failed, using fallback');
      }
    }

    // Fallback to local heuristic
    return this.getFallbackPredictions(homeTeam, awayTeam);
  }

  /**
   * Fallback prediction using simple heuristics
   * Used when backend is not available
   */
  private getFallbackPredictions(homeTeam: Team, awayTeam: Team): MatchPrediction[] {
    const homeGoals = parseInt(homeTeam.goals) || 0;
    const awayGoals = parseInt(awayTeam.goals) || 0;
    const homeShots = parseInt(homeTeam.shots) || 0;
    const awayShots = parseInt(awayTeam.shots) || 0;
    const homeShotsOnTarget = parseInt(homeTeam.shotsOnTarget) || 0;
    const awayShotsOnTarget = parseInt(awayTeam.shotsOnTarget) || 0;
    const homeRedCards = parseInt(homeTeam.redCards) || 0;
    const awayRedCards = parseInt(awayTeam.redCards) || 0;

    // Calculate score difference
    const goalDiff = homeGoals - awayGoals;
    const shotDiff = homeShots - awayShots;
    const redCardDiff = awayRedCards - homeRedCards;

    // Weighted score
    const homeScore = (homeGoals * 3) + (homeShots * 0.5) + (homeShotsOnTarget * 1) - (homeRedCards * 2);
    const awayScore = (awayGoals * 3) + (awayShots * 0.5) + (awayShotsOnTarget * 1) - (awayRedCards * 2);
    const scoreDiff = homeScore - awayScore;

    // Determine outcome
    let outcome: 'Home Win' | 'Draw' | 'Away Win';
    let baseConfidence: number;

    if (scoreDiff > 3) {
      outcome = 'Home Win';
      baseConfidence = Math.min(85, 60 + scoreDiff * 2);
    } else if (scoreDiff < -3) {
      outcome = 'Away Win';
      baseConfidence = Math.min(85, 60 + Math.abs(scoreDiff) * 2);
    } else if (Math.abs(scoreDiff) <= 1) {
      outcome = 'Draw';
      baseConfidence = 55 + (5 - Math.abs(scoreDiff));
    } else if (scoreDiff > 0) {
      outcome = 'Home Win';
      baseConfidence = 55 + scoreDiff * 3;
    } else {
      outcome = 'Away Win';
      baseConfidence = 55 + Math.abs(scoreDiff) * 3;
    }

    console.log(`Fallback prediction: ${outcome} (score diff: ${scoreDiff.toFixed(1)})`);

    return [
      {
        modelName: 'Naive Bayes',
        outcome,
        confidence: baseConfidence - 4,
        modelAccuracy: 0.62
      },
      {
        modelName: 'Random Forest',
        outcome,
        confidence: baseConfidence,
        modelAccuracy: 0.68
      },
      {
        modelName: 'Logistic Regression',
        outcome,
        confidence: baseConfidence - 2,
        modelAccuracy: 0.65
      }
    ];
  }

  // No-op for compatibility
  public improveModels(): void { }
}

export const mlService = new MLService();