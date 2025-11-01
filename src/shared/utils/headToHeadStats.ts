// Head-to-head statistics utility functions
export interface HeadToHeadStats {
  totalMatches: number;
  homeWins: number;
  awayWins: number;
  draws: number;
  homeGoals: number;
  awayGoals: number;
  avgHomeGoals: number;
  avgAwayGoals: number;
  recentForm: {
    home: string[]; // W, D, L
    away: string[]; // W, D, L
  };
  goalDifference: number;
  winPercentage: {
    home: number;
    away: number;
  };
}

// Mock data for head-to-head statistics
// In a real application, this would come from an API or database
const mockHeadToHeadData: Record<string, HeadToHeadStats> = {
  "Manchester United_vs_Liverpool": {
    totalMatches: 10,
    homeWins: 4,
    awayWins: 3,
    draws: 3,
    homeGoals: 15,
    awayGoals: 12,
    avgHomeGoals: 1.5,
    avgAwayGoals: 1.2,
    recentForm: {
      home: ["W", "D", "L", "W", "D"],
      away: ["L", "W", "D", "L", "W"]
    },
    goalDifference: 3,
    winPercentage: {
      home: 40,
      away: 30
    }
  },
  "Barcelona_vs_Real Madrid": {
    totalMatches: 12,
    homeWins: 5,
    awayWins: 4,
    draws: 3,
    homeGoals: 20,
    awayGoals: 18,
    avgHomeGoals: 1.67,
    avgAwayGoals: 1.5,
    recentForm: {
      home: ["W", "W", "D", "L", "W"],
      away: ["L", "D", "W", "W", "L"]
    },
    goalDifference: 2,
    winPercentage: {
      home: 41.7,
      away: 33.3
    }
  },
  "Bayern Munich_vs_Borussia Dortmund": {
    totalMatches: 15,
    homeWins: 7,
    awayWins: 4,
    draws: 4,
    homeGoals: 25,
    awayGoals: 18,
    avgHomeGoals: 1.67,
    avgAwayGoals: 1.2,
    recentForm: {
      home: ["W", "W", "W", "D", "L"],
      away: ["L", "D", "W", "L", "W"]
    },
    goalDifference: 7,
    winPercentage: {
      home: 46.7,
      away: 26.7
    }
  }
};

// Function to get head-to-head stats for two teams
export const getHeadToHeadStats = (homeTeam: string, awayTeam: string): HeadToHeadStats | null => {
  try {
    // Create a consistent key for the matchup
    const key1 = `${homeTeam}_vs_${awayTeam}`;
    const key2 = `${awayTeam}_vs_${homeTeam}`;
    
    // Check if we have data for this matchup
    if (mockHeadToHeadData[key1]) {
      return mockHeadToHeadData[key1];
    }
    
    if (mockHeadToHeadData[key2]) {
      // If we have data for the reverse matchup, we need to adjust the stats
      const reverseStats = mockHeadToHeadData[key2];
      return {
        ...reverseStats,
        homeWins: reverseStats.awayWins,
        awayWins: reverseStats.homeWins,
        homeGoals: reverseStats.awayGoals,
        awayGoals: reverseStats.homeGoals,
        avgHomeGoals: reverseStats.avgAwayGoals,
        avgAwayGoals: reverseStats.avgHomeGoals,
        winPercentage: {
          home: reverseStats.winPercentage.away,
          away: reverseStats.winPercentage.home
        }
      };
    }
    
    // Return default stats if no data is found
    return {
      totalMatches: 0,
      homeWins: 0,
      awayWins: 0,
      draws: 0,
      homeGoals: 0,
      awayGoals: 0,
      avgHomeGoals: 0,
      avgAwayGoals: 0,
      recentForm: {
        home: [],
        away: []
      },
      goalDifference: 0,
      winPercentage: {
        home: 0,
        away: 0
      }
    };
  } catch (error) {
    console.error("Error fetching head-to-head stats:", error);
    return null;
  }
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