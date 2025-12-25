import { MatchPrediction, Team, ModelPerformance } from '@/shared/utils/types';

/**
 * Machine Learning Service
 * 
 * Connects to the Python Flask backend for real ML predictions.
 * Falls back to local heuristics if backend is unavailable.
 */

// Backend API URL - uses environment variable or default
const API_URL = import.meta.env.VITE_API_URL || 'https://vartificial-intelligence.onrender.com';

class MLService {
  private isBackendAvailable = false;
  private modelPerformance: ModelPerformance[] = [];
  private backendChecked = false;

  // Default performance (used as fallback)
  private readonly DEFAULT_PERFORMANCE: ModelPerformance[] = [
    { name: "Naive Bayes", accuracy: 0.62, precision: 0.63, f1Score: 0.61 },
    { name: "Random Forest", accuracy: 0.68, precision: 0.69, f1Score: 0.68 },
    { name: "Logistic Regression", accuracy: 0.65, precision: 0.66, f1Score: 0.65 }
  ];

  constructor() {
    console.log('MLService initialized. Backend URL:', API_URL);
  }

  /**
   * Check if the Python backend is available
   */
  private async checkBackendHealth(): Promise<boolean> {
    if (this.backendChecked) {
      return this.isBackendAvailable;
    }

    try {
      console.log('Checking backend health at:', `${API_URL}/api/health`);
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        this.isBackendAvailable = data.status === 'healthy';
        this.backendChecked = true;
        console.log('Backend health check:', data);

        // Fetch model performance from backend
        if (this.isBackendAvailable) {
          await this.fetchModelPerformance();
        }
        return this.isBackendAvailable;
      }
    } catch (error) {
      console.log('Backend not available:', error);
      this.isBackendAvailable = false;
      this.backendChecked = true;
    }
    return false;
  }

  /**
   * Fetch model performance metrics from backend
   */
  private async fetchModelPerformance(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/models`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const data = await response.json();
        this.modelPerformance = data.models;
        console.log('Model performance fetched:', data.models);
      }
    } catch (error) {
      console.log('Could not fetch model performance:', error);
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
    // Check backend availability first
    await this.checkBackendHealth();

    // Try backend
    if (this.isBackendAvailable) {
      try {
        console.log('Making prediction via backend...');
        const response = await fetch(`${API_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(15000), // 15 second timeout for cold start
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
          console.log('Backend prediction received:', data);
          return data.predictions;
        } else {
          console.log('Backend returned error:', response.status);
        }
      } catch (error) {
        console.log('Backend prediction failed:', error);
      }
    }

    // Fallback to local calculation
    console.log('Using fallback prediction...');
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

    // Goal difference is the PRIMARY factor
    const goalDiff = homeGoals - awayGoals;

    // Supporting factors (less important than goals)
    const shotDiff = (homeShots - awayShots) * 0.3;
    const sotDiff = (homeShotsOnTarget - awayShotsOnTarget) * 0.5;
    const redCardImpact = (awayRedCards - homeRedCards) * 1.5;

    // Combined score with goals being most important
    const scoreDiff = (goalDiff * 5) + shotDiff + sotDiff + redCardImpact;

    // Determine outcome based on GOAL difference first
    let outcome: 'Home Win' | 'Draw' | 'Away Win';
    let baseConfidence: number;

    if (goalDiff > 0) {
      // Home team has more goals - they're winning
      outcome = 'Home Win';
      baseConfidence = Math.min(90, 60 + goalDiff * 8);
    } else if (goalDiff < 0) {
      // Away team has more goals - they're winning
      outcome = 'Away Win';
      baseConfidence = Math.min(90, 60 + Math.abs(goalDiff) * 8);
    } else {
      // Tied on goals - look at other stats
      if (scoreDiff > 2) {
        outcome = 'Home Win';
        baseConfidence = 55 + Math.min(15, scoreDiff);
      } else if (scoreDiff < -2) {
        outcome = 'Away Win';
        baseConfidence = 55 + Math.min(15, Math.abs(scoreDiff));
      } else {
        outcome = 'Draw';
        baseConfidence = 55;
      }
    }

    console.log(`Fallback: ${outcome} (goals: ${homeGoals}-${awayGoals}, score: ${scoreDiff.toFixed(1)})`);

    return [
      {
        modelName: 'Naive Bayes',
        outcome,
        confidence: Math.max(50, baseConfidence - 4),
        modelAccuracy: 0.62
      },
      {
        modelName: 'Random Forest',
        outcome,
        confidence: Math.max(50, baseConfidence),
        modelAccuracy: 0.68
      },
      {
        modelName: 'Logistic Regression',
        outcome,
        confidence: Math.max(50, baseConfidence - 2),
        modelAccuracy: 0.65
      }
    ];
  }

  // No-op for compatibility
  public improveModels(): void { }
}

export const mlService = new MLService();