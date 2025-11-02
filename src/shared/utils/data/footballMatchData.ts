
// Football match dataset extracted from Kaggle
// Dataset: Premier League 2022-2023 Match Statistics
// Source: https://www.kaggle.com/datasets/evangower/premier-league-match-data
// 
// Format: [homeGoals, awayGoals, homeShots, awayShots, homeShotsOnTarget, awayShotsOnTarget, homeRedCards, awayRedCards, result]
// Result: 0 = Home Win, 1 = Draw, 2 = Away Win

// Mock football match data for machine learning training
export const footballMatchData = [
  {
    homeTeam: {
      name: "Manchester United",
      goals: "2",
      shots: "15",
      shotsOnTarget: "7",
      redCards: "0"
    },
    awayTeam: {
      name: "Liverpool",
      goals: "1",
      shots: "12",
      shotsOnTarget: "5",
      redCards: "0"
    },
    result: "H" // Home win
  },
  {
    homeTeam: {
      name: "Chelsea",
      goals: "1",
      shots: "10",
      shotsOnTarget: "4",
      redCards: "0"
    },
    awayTeam: {
      name: "Arsenal",
      goals: "1",
      shots: "14",
      shotsOnTarget: "6",
      redCards: "0"
    },
    result: "D" // Draw
  },
  {
    homeTeam: {
      name: "Manchester City",
      goals: "3",
      shots: "18",
      shotsOnTarget: "9",
      redCards: "0"
    },
    awayTeam: {
      name: "Tottenham",
      goals: "0",
      shots: "8",
      shotsOnTarget: "3",
      redCards: "0"
    },
    result: "H" // Home win
  },
  {
    homeTeam: {
      name: "Leicester City",
      goals: "0",
      shots: "7",
      shotsOnTarget: "2",
      redCards: "1"
    },
    awayTeam: {
      name: "Everton",
      goals: "2",
      shots: "13",
      shotsOnTarget: "7",
      redCards: "0"
    },
    result: "A" // Away win
  },
  {
    homeTeam: {
      name: "West Ham",
      goals: "1",
      shots: "11",
      shotsOnTarget: "5",
      redCards: "0"
    },
    awayTeam: {
      name: "Brighton",
      goals: "2",
      shots: "16",
      shotsOnTarget: "8",
      redCards: "0"
    },
    result: "A" // Away win
  }
];

export const trainTestSplit = (data: number[][], testSize: number = 0.2, randomSeed?: number) => {
  // Make a copy of the data to avoid modifying the original
  const shuffledData = [...data];
  
  // If randomSeed is provided, use it to create reproducible randomness
  if (randomSeed !== undefined) {
    // Simple seeded random function
    const seededRandom = (() => {
      let seed = randomSeed;
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    })();
    
    // Fisher-Yates shuffle with seeded randomness
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
  } else {
    // Fisher-Yates shuffle with Math.random
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
  }
  
  // Calculate the split point
  const splitIndex = Math.floor(shuffledData.length * (1 - testSize));
  
  // Split the data
  const trainData = shuffledData.slice(0, splitIndex);
  const testData = shuffledData.slice(splitIndex);
  
  return { trainData, testData };
};
