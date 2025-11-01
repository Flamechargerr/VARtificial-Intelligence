// Match history utility functions
export interface MatchHistoryItem {
  id: string;
  timestamp: Date;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  prediction: string;
  confidence: number;
  actualResult?: string;
  accuracy?: number;
}

// Streak tracking interface
export interface PredictionStreak {
  currentStreak: number;
  longestStreak: number;
  totalCorrect: number;
  totalPredictions: number;
  lastPredictionCorrect?: boolean;
}

class MatchHistoryService {
  private readonly STORAGE_KEY = 'match_history';
  private readonly STREAK_KEY = 'prediction_streak';
  
  // Get match history from localStorage
  getHistory(): MatchHistoryItem[] {
    try {
      const history = localStorage.getItem(this.STORAGE_KEY);
      return history ? JSON.parse(history).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      })) : [];
    } catch (error) {
      console.error('Error loading match history:', error);
      return [];
    }
  }
  
  // Save match to history
  saveMatch(match: Omit<MatchHistoryItem, 'id' | 'timestamp'>): void {
    try {
      const history = this.getHistory();
      const newMatch: MatchHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        ...match
      };
      
      history.unshift(newMatch);
      
      // Keep only the last 50 matches to prevent storage bloat
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      
      // Update streak tracking
      this.updateStreakTracking(newMatch);
    } catch (error) {
      console.error('Error saving match to history:', error);
    }
  }
  
  // Clear match history
  clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.STREAK_KEY);
    } catch (error) {
      console.error('Error clearing match history:', error);
    }
  }
  
  // Update match with actual result
  updateMatchResult(id: string, actualResult: string, accuracy: number): void {
    try {
      const history = this.getHistory();
      const matchIndex = history.findIndex(match => match.id === id);
      
      if (matchIndex !== -1) {
        const updatedMatch = {
          ...history[matchIndex],
          actualResult,
          accuracy
        };
        
        history[matchIndex] = updatedMatch;
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        
        // Update streak tracking based on result
        this.updateStreakTracking(updatedMatch);
      }
    } catch (error) {
      console.error('Error updating match result:', error);
    }
  }
  
  // Update streak tracking
  private updateStreakTracking(match: MatchHistoryItem): void {
    try {
      // Only update streak if we have an actual result
      if (match.actualResult === undefined) return;
      
      const streakData = this.getStreakData();
      const isCorrect = match.prediction === match.actualResult;
      
      // Update current streak
      if (isCorrect) {
        streakData.currentStreak += 1;
      } else {
        streakData.currentStreak = 0;
      }
      
      // Update total stats
      streakData.totalPredictions += 1;
      if (isCorrect) {
        streakData.totalCorrect += 1;
      }
      
      // Update longest streak
      if (streakData.currentStreak > streakData.longestStreak) {
        streakData.longestStreak = streakData.currentStreak;
      }
      
      // Update last prediction status
      streakData.lastPredictionCorrect = isCorrect;
      
      // Save updated streak data
      localStorage.setItem(this.STREAK_KEY, JSON.stringify(streakData));
    } catch (error) {
      console.error('Error updating streak tracking:', error);
    }
  }
  
  // Get streak data
  getStreakData(): PredictionStreak {
    try {
      const streakData = localStorage.getItem(this.STREAK_KEY);
      return streakData ? JSON.parse(streakData) : {
        currentStreak: 0,
        longestStreak: 0,
        totalCorrect: 0,
        totalPredictions: 0
      };
    } catch (error) {
      console.error('Error loading streak data:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalCorrect: 0,
        totalPredictions: 0
      };
    }
  }
  
  // Reset streak (for testing or special cases)
  resetStreak(): void {
    try {
      const resetStreak: PredictionStreak = {
        currentStreak: 0,
        longestStreak: 0,
        totalCorrect: 0,
        totalPredictions: 0
      };
      localStorage.setItem(this.STREAK_KEY, JSON.stringify(resetStreak));
    } catch (error) {
      console.error('Error resetting streak:', error);
    }
  }
}

export const matchHistoryService = new MatchHistoryService();