// Betting odds service to manage and retrieve betting odds information
export interface BettingOdds {
  bookmaker: string;
  homeWin: number;
  draw: number;
  awayWin: number;
  timestamp: string;
  lastUpdated: string;
}

export interface OddsComparison {
  homeWin: {
    bestOdds: number;
    bestBookmaker: string;
    averageOdds: number;
  };
  draw: {
    bestOdds: number;
    bestBookmaker: string;
    averageOdds: number;
  };
  awayWin: {
    bestOdds: number;
    bestBookmaker: string;
    averageOdds: number;
  };
  impliedProbabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

// Mock betting odds data for different bookmakers
// In a real application, this would come from an API
const mockBettingOddsData: Record<string, Record<string, BettingOdds[]>> = {
  "Manchester United": {
    "Liverpool": [
      {
        bookmaker: "Bet365",
        homeWin: 2.50,
        draw: 3.20,
        awayWin: 2.80,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      },
      {
        bookmaker: "William Hill",
        homeWin: 2.45,
        draw: 3.25,
        awayWin: 2.85,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      },
      {
        bookmaker: "Sky Bet",
        homeWin: 2.55,
        draw: 3.15,
        awayWin: 2.75,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      },
      {
        bookmaker: "Ladbrokes",
        homeWin: 2.48,
        draw: 3.22,
        awayWin: 2.82,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      }
    ]
  },
  "Manchester City": {
    "Chelsea": [
      {
        bookmaker: "Bet365",
        homeWin: 1.45,
        draw: 4.50,
        awayWin: 7.00,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      },
      {
        bookmaker: "William Hill",
        homeWin: 1.42,
        draw: 4.60,
        awayWin: 7.20,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      },
      {
        bookmaker: "Sky Bet",
        homeWin: 1.48,
        draw: 4.40,
        awayWin: 6.80,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      }
    ]
  },
  "Arsenal": {
    "Tottenham": [
      {
        bookmaker: "Bet365",
        homeWin: 2.10,
        draw: 3.40,
        awayWin: 3.50,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      },
      {
        bookmaker: "William Hill",
        homeWin: 2.05,
        draw: 3.45,
        awayWin: 3.55,
        timestamp: "2025-11-01T10:00:00Z",
        lastUpdated: "2025-11-01T10:00:00Z"
      }
    ]
  }
};

// Function to get betting odds for a match
export const getBettingOdds = (homeTeam: string, awayTeam: string): BettingOdds[] => {
  try {
    if (mockBettingOddsData[homeTeam] && mockBettingOddsData[homeTeam][awayTeam]) {
      return mockBettingOddsData[homeTeam][awayTeam];
    }
    
    // Try reverse match
    if (mockBettingOddsData[awayTeam] && mockBettingOddsData[awayTeam][homeTeam]) {
      return mockBettingOddsData[awayTeam][homeTeam];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching betting odds:", error);
    return [];
  }
};

// Function to compare odds and find best values
export const compareOdds = (oddsList: BettingOdds[]): OddsComparison => {
  if (oddsList.length === 0) {
    return {
      homeWin: { bestOdds: 0, bestBookmaker: "", averageOdds: 0 },
      draw: { bestOdds: 0, bestBookmaker: "", averageOdds: 0 },
      awayWin: { bestOdds: 0, bestBookmaker: "", averageOdds: 0 },
      impliedProbabilities: { homeWin: 0, draw: 0, awayWin: 0 }
    };
  }
  
  // Calculate best odds and bookmakers
  const homeWinBest = oddsList.reduce((best, current) => 
    current.homeWin > best.homeWin ? current : best, oddsList[0]);
  
  const drawBest = oddsList.reduce((best, current) => 
    current.draw > best.draw ? current : best, oddsList[0]);
  
  const awayWinBest = oddsList.reduce((best, current) => 
    current.awayWin > best.awayWin ? current : best, oddsList[0]);
  
  // Calculate averages
  const homeWinAvg = oddsList.reduce((sum, odds) => sum + odds.homeWin, 0) / oddsList.length;
  const drawAvg = oddsList.reduce((sum, odds) => sum + odds.draw, 0) / oddsList.length;
  const awayWinAvg = oddsList.reduce((sum, odds) => sum + odds.awayWin, 0) / oddsList.length;
  
  // Calculate implied probabilities (1/odds)
  const totalImpliedProbability = (1/homeWinAvg) + (1/drawAvg) + (1/awayWinAvg);
  const homeWinProbability = (1/homeWinAvg) / totalImpliedProbability * 100;
  const drawProbability = (1/drawAvg) / totalImpliedProbability * 100;
  const awayWinProbability = (1/awayWinAvg) / totalImpliedProbability * 100;
  
  return {
    homeWin: {
      bestOdds: homeWinBest.homeWin,
      bestBookmaker: homeWinBest.bookmaker,
      averageOdds: parseFloat(homeWinAvg.toFixed(2))
    },
    draw: {
      bestOdds: drawBest.draw,
      bestBookmaker: drawBest.bookmaker,
      averageOdds: parseFloat(drawAvg.toFixed(2))
    },
    awayWin: {
      bestOdds: awayWinBest.awayWin,
      bestBookmaker: awayWinBest.bookmaker,
      averageOdds: parseFloat(awayWinAvg.toFixed(2))
    },
    impliedProbabilities: {
      homeWin: parseFloat(homeWinProbability.toFixed(1)),
      draw: parseFloat(drawProbability.toFixed(1)),
      awayWin: parseFloat(awayWinProbability.toFixed(1))
    }
  };
};

// Function to convert odds to implied probability
export const oddsToProbability = (odds: number): number => {
  return parseFloat((1 / odds * 100).toFixed(1));
};

// Function to get odds color based on value
export const getOddsColor = (odds: number): string => {
  if (odds < 2) return "text-green-600 dark:text-green-400";
  if (odds < 3) return "text-blue-600 dark:text-blue-400";
  if (odds < 5) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};