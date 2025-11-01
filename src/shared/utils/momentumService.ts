// Team momentum service to calculate and track team performance momentum
export interface MomentumData {
  currentForm: string[]; // Last 5 match results (W, D, L)
  formTrend: 'improving' | 'declining' | 'stable';
  recentGoals: {
    scored: number[];
    conceded: number[];
  };
  goalDifferenceTrend: 'positive' | 'negative' | 'neutral';
  cleanSheets: number; // Number of clean sheets in recent matches
  momentumScore: number; // 0-100, higher means better momentum
  momentumDescription: string;
}

// Mock momentum data for different teams
// In a real application, this would be calculated from recent match data
const mockMomentumData: Record<string, MomentumData> = {
  "Manchester United": {
    currentForm: ["W", "D", "W", "L", "W"],
    formTrend: "improving",
    recentGoals: {
      scored: [2, 1, 3, 0, 2],
      conceded: [1, 1, 0, 2, 1]
    },
    goalDifferenceTrend: "positive",
    cleanSheets: 2,
    momentumScore: 75,
    momentumDescription: "Strong recent form with improving momentum"
  },
  "Liverpool": {
    currentForm: ["L", "L", "D", "W", "W"],
    formTrend: "improving",
    recentGoals: {
      scored: [0, 1, 2, 3, 2],
      conceded: [2, 3, 1, 1, 0]
    },
    goalDifferenceTrend: "positive",
    cleanSheets: 1,
    momentumScore: 65,
    momentumDescription: "Recovering form with positive goal difference trend"
  },
  "Manchester City": {
    currentForm: ["W", "W", "W", "D", "W"],
    formTrend: "stable",
    recentGoals: {
      scored: [3, 2, 4, 1, 3],
      conceded: [0, 1, 0, 1, 0]
    },
    goalDifferenceTrend: "positive",
    cleanSheets: 3,
    momentumScore: 90,
    momentumDescription: "Excellent momentum with strong goal difference"
  },
  "Chelsea": {
    currentForm: ["D", "L", "L", "D", "W"],
    formTrend: "stable",
    recentGoals: {
      scored: [1, 0, 1, 1, 2],
      conceded: [1, 2, 2, 1, 1]
    },
    goalDifferenceTrend: "neutral",
    cleanSheets: 0,
    momentumScore: 50,
    momentumDescription: "Inconsistent form with neutral momentum"
  },
  "Arsenal": {
    currentForm: ["W", "W", "L", "W", "W"],
    formTrend: "improving",
    recentGoals: {
      scored: [2, 3, 1, 2, 3],
      conceded: [0, 1, 2, 1, 0]
    },
    goalDifferenceTrend: "positive",
    cleanSheets: 2,
    momentumScore: 80,
    momentumDescription: "Strong form with positive momentum trend"
  },
  "Tottenham": {
    currentForm: ["L", "W", "L", "L", "D"],
    formTrend: "declining",
    recentGoals: {
      scored: [1, 2, 0, 1, 1],
      conceded: [2, 1, 3, 2, 2]
    },
    goalDifferenceTrend: "negative",
    cleanSheets: 0,
    momentumScore: 35,
    momentumDescription: "Declining momentum with negative goal difference"
  }
};

// Function to get momentum data for a team
export const getTeamMomentum = (teamName: string): MomentumData | null => {
  try {
    return mockMomentumData[teamName] || null;
  } catch (error) {
    console.error("Error fetching team momentum data:", error);
    return null;
  }
};

// Function to get momentum indicator color
export const getMomentumColor = (momentumScore: number): string => {
  if (momentumScore >= 80) return "text-green-600 dark:text-green-400";
  if (momentumScore >= 60) return "text-green-500 dark:text-green-300";
  if (momentumScore >= 40) return "text-yellow-500 dark:text-yellow-300";
  if (momentumScore >= 20) return "text-orange-500 dark:text-orange-300";
  return "text-red-600 dark:text-red-400";
};

// Function to get momentum indicator background color
export const getMomentumBgColor = (momentumScore: number): string => {
  if (momentumScore >= 80) return "bg-green-100 dark:bg-green-900/30";
  if (momentumScore >= 60) return "bg-green-50 dark:bg-green-900/20";
  if (momentumScore >= 40) return "bg-yellow-50 dark:bg-yellow-900/20";
  if (momentumScore >= 20) return "bg-orange-50 dark:bg-orange-900/20";
  return "bg-red-100 dark:bg-red-900/30";
};

// Function to get form indicator color
export const getFormIndicatorColor = (result: string): string => {
  switch (result) {
    case "W":
      return "bg-green-500";
    case "D":
      return "bg-yellow-500";
    case "L":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

// Function to get form trend icon
export const getFormTrendIcon = (trend: string): string => {
  switch (trend) {
    case "improving":
      return "↑";
    case "declining":
      return "↓";
    case "stable":
      return "→";
    default:
      return "-";
  }
};