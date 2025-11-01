// Confidence calibration utility functions
export interface CalibrationData {
  modelId: string;
  confidenceLevels: number[]; // 0-100
  accuracyRates: number[]; // 0-100, actual accuracy for each confidence level
  calibrationCurve: { confidence: number; accuracy: number }[];
  calibrationScore: number; // 0-1 (lower is better calibrated)
  overConfident: boolean;
  underConfident: boolean;
}

// Mock calibration data for different models
// In a real application, this would be calculated from historical prediction data
const mockCalibrationData: Record<string, CalibrationData> = {
  "neural_network": {
    modelId: "neural_network",
    confidenceLevels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    accuracyRates: [15, 25, 35, 45, 55, 65, 75, 85, 95, 98],
    calibrationCurve: [
      { confidence: 10, accuracy: 15 },
      { confidence: 20, accuracy: 25 },
      { confidence: 30, accuracy: 35 },
      { confidence: 40, accuracy: 45 },
      { confidence: 50, accuracy: 55 },
      { confidence: 60, accuracy: 65 },
      { confidence: 70, accuracy: 75 },
      { confidence: 80, accuracy: 85 },
      { confidence: 90, accuracy: 95 },
      { confidence: 100, accuracy: 98 }
    ],
    calibrationScore: 0.15,
    overConfident: false,
    underConfident: false
  },
  "random_forest": {
    modelId: "random_forest",
    confidenceLevels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    accuracyRates: [5, 15, 25, 35, 45, 55, 65, 75, 85, 90],
    calibrationCurve: [
      { confidence: 10, accuracy: 5 },
      { confidence: 20, accuracy: 15 },
      { confidence: 30, accuracy: 25 },
      { confidence: 40, accuracy: 35 },
      { confidence: 50, accuracy: 45 },
      { confidence: 60, accuracy: 55 },
      { confidence: 70, accuracy: 65 },
      { confidence: 80, accuracy: 75 },
      { confidence: 90, accuracy: 85 },
      { confidence: 100, accuracy: 90 }
    ],
    calibrationScore: 0.25,
    overConfident: false,
    underConfident: true
  },
  "logistic_regression": {
    modelId: "logistic_regression",
    confidenceLevels: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    accuracyRates: [20, 30, 40, 50, 60, 70, 80, 90, 95, 99],
    calibrationCurve: [
      { confidence: 10, accuracy: 20 },
      { confidence: 20, accuracy: 30 },
      { confidence: 30, accuracy: 40 },
      { confidence: 40, accuracy: 50 },
      { confidence: 50, accuracy: 60 },
      { confidence: 60, accuracy: 70 },
      { confidence: 70, accuracy: 80 },
      { confidence: 80, accuracy: 90 },
      { confidence: 90, accuracy: 95 },
      { confidence: 100, accuracy: 99 }
    ],
    calibrationScore: 0.08,
    overConfident: false,
    underConfident: false
  }
};

// Function to get calibration data for a model
export const getCalibrationData = (modelId: string): CalibrationData | null => {
  try {
    return mockCalibrationData[modelId] || null;
  } catch (error) {
    console.error("Error fetching calibration data:", error);
    return null;
  }
};

// Function to calibrate confidence based on historical data
export const calibrateConfidence = (modelId: string, rawConfidence: number): number => {
  try {
    const calibrationData = getCalibrationData(modelId);
    
    if (!calibrationData) {
      // If no calibration data, return raw confidence
      return rawConfidence;
    }
    
    // Find the closest confidence level in our data
    const closestLevelIndex = calibrationData.confidenceLevels.reduce((closestIndex, level, index) => {
      const currentDiff = Math.abs(level - rawConfidence);
      const closestDiff = Math.abs(calibrationData.confidenceLevels[closestIndex] - rawConfidence);
      return currentDiff < closestDiff ? index : closestIndex;
    }, 0);
    
    // Return the actual accuracy rate for that confidence level
    return calibrationData.accuracyRates[closestLevelIndex];
  } catch (error) {
    console.error("Error calibrating confidence:", error);
    return rawConfidence;
  }
};

// Function to get calibration status message
export const getCalibrationStatus = (calibrationScore: number): string => {
  if (calibrationScore < 0.1) {
    return "Well calibrated";
  } else if (calibrationScore < 0.2) {
    return "Reasonably calibrated";
  } else if (calibrationScore < 0.3) {
    return "Moderately miscalibrated";
  } else {
    return "Poorly calibrated";
  }
};

// Function to get calibration advice
export const getCalibrationAdvice = (calibrationData: CalibrationData): string => {
  if (calibrationData.overConfident) {
    return "Model tends to be overconfident. Consider being more conservative with high-confidence predictions.";
  } else if (calibrationData.underConfident) {
    return "Model tends to be underconfident. High-confidence predictions are more reliable than indicated.";
  } else {
    return "Model confidence is well-calibrated. You can trust the confidence levels as reported.";
  }
};