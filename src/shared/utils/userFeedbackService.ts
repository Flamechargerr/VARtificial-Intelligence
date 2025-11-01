// User feedback service to collect and manage user feedback on predictions
export interface PredictionFeedback {
  id: string;
  predictionId: string;
  modelName: string;
  match: {
    homeTeam: string;
    awayTeam: string;
  };
  predictedOutcome: string;
  actualOutcome: string;
  accuracy: number;
  feedback: 'correct' | 'incorrect' | 'partially_correct';
  confidence: number;
  comments: string;
  timestamp: Date;
  userId?: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  correctPredictions: number;
  incorrectPredictions: number;
  partiallyCorrect: number;
  accuracyRate: number;
  avgConfidence: number;
  feedbackByModel: Record<string, {
    total: number;
    correct: number;
    accuracyRate: number;
  }>;
}

// In-memory storage for feedback (in a real app, this would be a database)
let feedbackStorage: PredictionFeedback[] = [];

// Function to submit feedback for a prediction
export const submitPredictionFeedback = (feedback: Omit<PredictionFeedback, 'id' | 'timestamp'>): PredictionFeedback => {
  try {
    const newFeedback: PredictionFeedback = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...feedback
    };
    
    feedbackStorage.push(newFeedback);
    
    // Keep only the last 100 feedback items to prevent storage bloat
    if (feedbackStorage.length > 100) {
      feedbackStorage = feedbackStorage.slice(-100);
    }
    
    return newFeedback;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw new Error("Failed to submit feedback");
  }
};

// Function to get all feedback
export const getAllFeedback = (): PredictionFeedback[] => {
  try {
    return [...feedbackStorage].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return [];
  }
};

// Function to get feedback for a specific prediction
export const getFeedbackForPrediction = (predictionId: string): PredictionFeedback[] => {
  try {
    return feedbackStorage.filter(feedback => feedback.predictionId === predictionId);
  } catch (error) {
    console.error("Error fetching prediction feedback:", error);
    return [];
  }
};

// Function to get feedback statistics
export const getFeedbackStats = (): FeedbackStats => {
  try {
    if (feedbackStorage.length === 0) {
      return {
        totalFeedback: 0,
        correctPredictions: 0,
        incorrectPredictions: 0,
        partiallyCorrect: 0,
        accuracyRate: 0,
        avgConfidence: 0,
        feedbackByModel: {}
      };
    }
    
    const totalFeedback = feedbackStorage.length;
    const correctPredictions = feedbackStorage.filter(f => f.feedback === 'correct').length;
    const incorrectPredictions = feedbackStorage.filter(f => f.feedback === 'incorrect').length;
    const partiallyCorrect = feedbackStorage.filter(f => f.feedback === 'partially_correct').length;
    
    const accuracyRate = totalFeedback > 0 ? (correctPredictions / totalFeedback) * 100 : 0;
    const avgConfidence = totalFeedback > 0 ? 
      feedbackStorage.reduce((sum, f) => sum + f.confidence, 0) / totalFeedback : 0;
    
    // Group feedback by model
    const feedbackByModel: Record<string, { total: number; correct: number; accuracyRate: number }> = {};
    
    feedbackStorage.forEach(feedback => {
      if (!feedbackByModel[feedback.modelName]) {
        feedbackByModel[feedback.modelName] = {
          total: 0,
          correct: 0,
          accuracyRate: 0
        };
      }
      
      feedbackByModel[feedback.modelName].total += 1;
      if (feedback.feedback === 'correct') {
        feedbackByModel[feedback.modelName].correct += 1;
      }
    });
    
    // Calculate accuracy rates for each model
    Object.keys(feedbackByModel).forEach(modelName => {
      const modelData = feedbackByModel[modelName];
      modelData.accuracyRate = modelData.total > 0 ? (modelData.correct / modelData.total) * 100 : 0;
    });
    
    return {
      totalFeedback,
      correctPredictions,
      incorrectPredictions,
      partiallyCorrect,
      accuracyRate,
      avgConfidence,
      feedbackByModel
    };
  } catch (error) {
    console.error("Error calculating feedback stats:", error);
    return {
      totalFeedback: 0,
      correctPredictions: 0,
      incorrectPredictions: 0,
      partiallyCorrect: 0,
      accuracyRate: 0,
      avgConfidence: 0,
      feedbackByModel: {}
    };
  }
};

// Function to clear all feedback (for testing purposes)
export const clearAllFeedback = (): void => {
  feedbackStorage = [];
};

// Function to get feedback color based on type
export const getFeedbackColor = (feedback: string): string => {
  switch (feedback) {
    case 'correct':
      return 'text-green-600 dark:text-green-400';
    case 'partially_correct':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'incorrect':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

// Function to get feedback badge color
export const getFeedbackBadgeColor = (feedback: string): string => {
  switch (feedback) {
    case 'correct':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'partially_correct':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'incorrect':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};