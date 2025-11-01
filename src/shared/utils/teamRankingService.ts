// Team ranking service to manage and retrieve team ranking information
export interface TeamRanking {
  position: number;
  teamName: string;
  points: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form: string[]; // Last 5 match results (W, D, L)
}

// Mock team ranking data
// In a real application, this would come from an API or database
const mockTeamRankings: TeamRanking[] = [
  {
    position: 1,
    teamName: "Manchester City",
    points: 85,
    gamesPlayed: 38,
    wins: 28,
    draws: 1,
    losses: 9,
    goalsFor: 94,
    goalsAgainst: 32,
    goalDifference: 62,
    form: ["W", "W", "D", "W", "W"]
  },
  {
    position: 2,
    teamName: "Arsenal",
    points: 84,
    gamesPlayed: 38,
    wins: 28,
    draws: 0,
    losses: 10,
    goalsFor: 84,
    goalsAgainst: 32,
    goalDifference: 52,
    form: ["W", "D", "W", "W", "L"]
  },
  {
    position: 3,
    teamName: "Manchester United",
    points: 75,
    gamesPlayed: 38,
    wins: 23,
    draws: 6,
    losses: 9,
    goalsFor: 58,
    goalsAgainst: 43,
    goalDifference: 15,
    form: ["W", "L", "W", "D", "W"]
  },
  {
    position: 4,
    teamName: "Liverpool",
    points: 72,
    gamesPlayed: 38,
    wins: 22,
    draws: 6,
    losses: 10,
    goalsFor: 72,
    goalsAgainst: 47,
    goalDifference: 25,
    form: ["D", "W", "L", "W", "W"]
  },
  {
    position: 5,
    teamName: "Chelsea",
    points: 70,
    gamesPlayed: 38,
    wins: 21,
    draws: 7,
    losses: 10,
    goalsFor: 69,
    goalsAgainst: 45,
    goalDifference: 24,
    form: ["W", "D", "L", "W", "D"]
  },
  {
    position: 6,
    teamName: "Tottenham",
    points: 65,
    gamesPlayed: 38,
    wins: 20,
    draws: 5,
    losses: 13,
    goalsFor: 70,
    goalsAgainst: 55,
    goalDifference: 15,
    form: ["L", "W", "W", "D", "L"]
  },
  {
    position: 7,
    teamName: "Newcastle United",
    points: 63,
    gamesPlayed: 38,
    wins: 19,
    draws: 6,
    losses: 13,
    goalsFor: 68,
    goalsAgainst: 53,
    goalDifference: 15,
    form: ["W", "W", "L", "D", "W"]
  },
  {
    position: 8,
    teamName: "Aston Villa",
    points: 61,
    gamesPlayed: 38,
    wins: 18,
    draws: 7,
    losses: 13,
    goalsFor: 61,
    goalsAgainst: 56,
    goalDifference: 5,
    form: ["D", "W", "L", "W", "D"]
  },
  {
    position: 9,
    teamName: "Brighton",
    points: 59,
    gamesPlayed: 38,
    wins: 18,
    draws: 5,
    losses: 15,
    goalsFor: 72,
    goalsAgainst: 63,
    goalDifference: 9,
    form: ["W", "L", "D", "W", "L"]
  },
  {
    position: 10,
    teamName: "Crystal Palace",
    points: 54,
    gamesPlayed: 38,
    wins: 16,
    draws: 6,
    losses: 16,
    goalsFor: 52,
    goalsAgainst: 53,
    goalDifference: -1,
    form: ["D", "L", "W", "D", "W"]
  }
];

// Function to get all team rankings
export const getAllTeamRankings = (): TeamRanking[] => {
  try {
    return [...mockTeamRankings].sort((a, b) => a.position - b.position);
  } catch (error) {
    console.error("Error fetching team rankings:", error);
    return [];
  }
};

// Function to get a specific team's ranking
export const getTeamRanking = (teamName: string): TeamRanking | null => {
  try {
    return mockTeamRankings.find(team => 
      team.teamName.toLowerCase() === teamName.toLowerCase()
    ) || null;
  } catch (error) {
    console.error("Error fetching team ranking:", error);
    return null;
  }
};

// Function to get top teams
export const getTopTeams = (count: number = 5): TeamRanking[] => {
  try {
    return [...mockTeamRankings]
      .sort((a, b) => a.position - b.position)
      .slice(0, count);
  } catch (error) {
    console.error("Error fetching top teams:", error);
    return [];
  }
};

// Function to get teams in a specific position range
export const getTeamsInRange = (start: number, end: number): TeamRanking[] => {
  try {
    return [...mockTeamRankings]
      .sort((a, b) => a.position - b.position)
      .slice(start - 1, end);
  } catch (error) {
    console.error("Error fetching teams in range:", error);
    return [];
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

// Function to get position color
export const getPositionColor = (position: number): string => {
  if (position <= 4) return "text-green-600 dark:text-green-400";
  if (position <= 6) return "text-blue-600 dark:text-blue-400";
  if (position <= 8) return "text-purple-600 dark:text-purple-400";
  if (position <= 12) return "text-yellow-600 dark:text-yellow-400";
  if (position <= 16) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
};

// Function to get position badge color
export const getPositionBadgeColor = (position: number): string => {
  if (position <= 4) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (position <= 6) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (position <= 8) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  if (position <= 12) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  if (position <= 16) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};