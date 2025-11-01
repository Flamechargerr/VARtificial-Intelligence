// Player injury service to manage and retrieve player injury information
export interface InjuryReport {
  playerId: string;
  playerName: string;
  team: string;
  injuryType: string;
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  expectedReturn: string; // Date in YYYY-MM-DD format
  status: 'injured' | 'recovering' | 'fit';
  lastUpdated: string; // Date in YYYY-MM-DD format
  description: string;
}

// Mock injury data for different teams
// In a real application, this would come from an API or database
const mockInjuryData: Record<string, InjuryReport[]> = {
  "Manchester United": [
    {
      playerId: "mu_001",
      playerName: "Marcus Rashford",
      team: "Manchester United",
      injuryType: "Hamstring Strain",
      severity: "moderate",
      expectedReturn: "2025-11-15",
      status: "recovering",
      lastUpdated: "2025-11-01",
      description: "Suffered a moderate hamstring strain during training. Expected to return in 2 weeks."
    },
    {
      playerId: "mu_002",
      playerName: "Luke Shaw",
      team: "Manchester United",
      injuryType: "Groin Strain",
      severity: "minor",
      expectedReturn: "2025-11-08",
      status: "recovering",
      lastUpdated: "2025-11-01",
      description: "Minor groin strain. Light training expected to begin next week."
    }
  ],
  "Liverpool": [
    {
      playerId: "liv_001",
      playerName: "Virgil van Dijk",
      team: "Liverpool",
      injuryType: "Ankle Sprain",
      severity: "serious",
      expectedReturn: "2025-11-22",
      status: "injured",
      lastUpdated: "2025-10-30",
      description: "Severe ankle sprain requiring 3 weeks recovery. Surgery not required."
    },
    {
      playerId: "liv_002",
      playerName: "Diogo Jota",
      team: "Liverpool",
      injuryType: "Hamstring Strain",
      severity: "moderate",
      expectedReturn: "2025-11-10",
      status: "recovering",
      lastUpdated: "2025-11-01",
      description: "Moderate hamstring strain. Rehabilitation progressing well."
    }
  ],
  "Manchester City": [
    {
      playerId: "mc_001",
      playerName: "Kevin De Bruyne",
      team: "Manchester City",
      injuryType: "Knee Injury",
      severity: "serious",
      expectedReturn: "2025-12-01",
      status: "injured",
      lastUpdated: "2025-10-28",
      description: "Knee ligament damage requiring extensive rehabilitation. Expected to be out for 4-6 weeks."
    }
  ],
  "Chelsea": [
    {
      playerId: "che_001",
      playerName: "Reece James",
      team: "Chelsea",
      injuryType: "Muscle Strain",
      severity: "moderate",
      expectedReturn: "2025-11-12",
      status: "recovering",
      lastUpdated: "2025-10-31",
      description: "Muscle strain in thigh. Recovery on track for mid-November return."
    }
  ],
  "Arsenal": [
    {
      playerId: "ars_001",
      playerName: "Gabriel Martinelli",
      team: "Arsenal",
      injuryType: "Ankle Sprain",
      severity: "minor",
      expectedReturn: "2025-11-05",
      status: "recovering",
      lastUpdated: "2025-11-01",
      description: "Minor ankle sprain. Expected to return for weekend fixtures."
    }
  ]
};

// Function to get injury reports for a team
export const getTeamInjuryReports = (teamName: string): InjuryReport[] => {
  try {
    return mockInjuryData[teamName] || [];
  } catch (error) {
    console.error("Error fetching injury reports:", error);
    return [];
  }
};

// Function to get injury severity color
export const getInjurySeverityColor = (severity: string): string => {
  switch (severity) {
    case "minor":
      return "text-green-600 dark:text-green-400";
    case "moderate":
      return "text-yellow-600 dark:text-yellow-400";
    case "serious":
      return "text-orange-600 dark:text-orange-400";
    case "critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

// Function to get injury severity background color
export const getInjurySeverityBgColor = (severity: string): string => {
  switch (severity) {
    case "minor":
      return "bg-green-100 dark:bg-green-900/30";
    case "moderate":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "serious":
      return "bg-orange-100 dark:bg-orange-900/30";
    case "critical":
      return "bg-red-100 dark:bg-red-900/30";
    default:
      return "bg-gray-100 dark:bg-gray-800";
  }
};

// Function to get injury status color
export const getInjuryStatusColor = (status: string): string => {
  switch (status) {
    case "fit":
      return "text-green-600 dark:text-green-400";
    case "recovering":
      return "text-blue-600 dark:text-blue-400";
    case "injured":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

// Function to calculate days until return
export const getDaysUntilReturn = (expectedReturn: string): number => {
  const returnDate = new Date(expectedReturn);
  const today = new Date();
  const diffTime = returnDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};