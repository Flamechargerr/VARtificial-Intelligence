// Match simulation service to simulate football matches
export interface SimulationEvent {
  minute: number;
  eventType: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'injury' | 'penalty' | 'VAR_review';
  team: 'home' | 'away';
  player?: string;
  description: string;
  score: { home: number; away: number };
}

export interface MatchSimulationResult {
  finalScore: { home: number; away: number };
  events: SimulationEvent[];
  matchStats: {
    home: {
      shots: number;
      shotsOnTarget: number;
      possession: number;
      corners: number;
      fouls: number;
    };
    away: {
      shots: number;
      shotsOnTarget: number;
      possession: number;
      corners: number;
      fouls: number;
    };
  };
  result: 'home_win' | 'away_win' | 'draw';
}

// Function to simulate a match based on team stats
export const simulateMatch = (
  homeTeam: { name: string; goals: number; shots: number; shotsOnTarget: number; redCards: number },
  awayTeam: { name: string; goals: number; shots: number; shotsOnTarget: number; redCards: number }
): MatchSimulationResult => {
  // Base simulation parameters
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  
  // Simulate final score
  const { homeGoals, awayGoals } = simulateFinalScore(homeStrength, awayStrength);
  
  // Simulate match events
  const events = simulateMatchEvents(homeTeam, awayTeam, homeGoals, awayGoals);
  
  // Generate match statistics
  const matchStats = generateMatchStats(homeTeam, awayTeam, homeGoals, awayGoals);
  
  // Determine result
  let result: 'home_win' | 'away_win' | 'draw' = 'draw';
  if (homeGoals > awayGoals) {
    result = 'home_win';
  } else if (awayGoals > homeGoals) {
    result = 'away_win';
  }
  
  return {
    finalScore: { home: homeGoals, away: awayGoals },
    events,
    matchStats,
    result
  };
};

// Helper function to calculate team strength
const calculateTeamStrength = (team: { goals: number; shots: number; shotsOnTarget: number; redCards: number }) => {
  // Simple strength calculation based on key metrics
  const goalEfficiency = team.goals / Math.max(1, team.shots);
  const shotAccuracy = team.shotsOnTarget / Math.max(1, team.shots);
  const disciplineFactor = 1 - (team.redCards * 0.1); // Red cards reduce strength
  
  return (goalEfficiency * 0.4 + shotAccuracy * 0.4 + disciplineFactor * 0.2) * 100;
};

// Helper function to simulate final score
const simulateFinalScore = (homeStrength: number, awayStrength: number) => {
  // Calculate expected goals based on strength
  const homeExpectedGoals = Math.max(0, (homeStrength / 100) * 2.5);
  const awayExpectedGoals = Math.max(0, (awayStrength / 100) * 2.5);
  
  // Add some randomness
  const homeGoals = Math.round(homeExpectedGoals + (Math.random() - 0.5) * 1.5);
  const awayGoals = Math.round(awayExpectedGoals + (Math.random() - 0.5) * 1.5);
  
  // Ensure non-negative scores
  return {
    homeGoals: Math.max(0, homeGoals),
    awayGoals: Math.max(0, awayGoals)
  };
};

// Helper function to simulate match events
const simulateMatchEvents = (
  homeTeam: { name: string },
  awayTeam: { name: string },
  homeGoals: number,
  awayGoals: number
): SimulationEvent[] => {
  const events: SimulationEvent[] = [];
  const totalGoals = homeGoals + awayGoals;
  
  // Generate goal events
  let homeScore = 0;
  let awayScore = 0;
  
  for (let i = 0; i < totalGoals; i++) {
    // Random minute between 1 and 90
    const minute = Math.floor(Math.random() * 90) + 1;
    
    // Determine which team scores (weighted by expected goals)
    const homeScoringChance = homeGoals / Math.max(1, totalGoals);
    const isHomeGoal = Math.random() < homeScoringChance;
    
    if (isHomeGoal) {
      homeScore++;
    } else {
      awayScore++;
    }
    
    events.push({
      minute,
      eventType: 'goal',
      team: isHomeGoal ? 'home' : 'away',
      description: `${isHomeGoal ? homeTeam.name : awayTeam.name} scores!`,
      score: { home: homeScore, away: awayScore }
    });
  }
  
  // Add some random events
  const eventTypes: ('yellow_card' | 'red_card' | 'substitution' | 'injury' | 'penalty' | 'VAR_review')[] = 
    ['yellow_card', 'substitution', 'injury', 'VAR_review'];
  
  const eventCount = Math.floor(Math.random() * 5) + 3; // 3-7 random events
  
  for (let i = 0; i < eventCount; i++) {
    const minute = Math.floor(Math.random() * 90) + 1;
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const isHomeTeam = Math.random() < 0.5;
    
    let description = '';
    switch (eventType) {
      case 'yellow_card':
        description = `${isHomeTeam ? homeTeam.name : awayTeam.name} player booked`;
        break;
      case 'red_card':
        description = `${isHomeTeam ? homeTeam.name : awayTeam.name} player sent off`;
        break;
      case 'substitution':
        description = `${isHomeTeam ? homeTeam.name : awayTeam.name} makes a substitution`;
        break;
      case 'injury':
        description = `Injury for ${isHomeTeam ? homeTeam.name : awayTeam.name} player`;
        break;
      case 'penalty':
        description = `Penalty awarded to ${isHomeTeam ? homeTeam.name : awayTeam.name}`;
        break;
      case 'VAR_review':
        description = `VAR review in progress`;
        break;
    }
    
    events.push({
      minute,
      eventType,
      team: isHomeTeam ? 'home' : 'away',
      description,
      score: { home: homeScore, away: awayScore }
    });
  }
  
  // Sort events by minute
  events.sort((a, b) => a.minute - b.minute);
  
  return events;
};

// Helper function to generate match statistics
const generateMatchStats = (
  homeTeam: { goals: number; shots: number; shotsOnTarget: number; redCards: number },
  awayTeam: { goals: number; shots: number; shotsOnTarget: number; redCards: number },
  homeGoals: number,
  awayGoals: number
) => {
  // Base stats from team data
  const homeShots = Math.max(5, homeTeam.shots + Math.floor(Math.random() * 5) - 2);
  const awayShots = Math.max(5, awayTeam.shots + Math.floor(Math.random() * 5) - 2);
  
  const homeShotsOnTarget = Math.min(
    homeShots, 
    Math.max(2, homeTeam.shotsOnTarget + Math.floor(Math.random() * 3) - 1)
  );
  const awayShotsOnTarget = Math.min(
    awayShots, 
    Math.max(2, awayTeam.shotsOnTarget + Math.floor(Math.random() * 3) - 1)
  );
  
  // Possession (weighted by strength)
  const homeStrength = calculateTeamStrength(homeTeam);
  const awayStrength = calculateTeamStrength(awayTeam);
  const totalStrength = homeStrength + awayStrength;
  
  const homePossession = Math.round((homeStrength / totalStrength) * 100);
  const awayPossession = 100 - homePossession;
  
  // Other stats with some randomness
  const homeCorners = Math.max(1, Math.floor(Math.random() * 8) + 2);
  const awayCorners = Math.max(1, Math.floor(Math.random() * 8) + 2);
  
  const homeFouls = Math.max(5, homeTeam.redCards * 2 + Math.floor(Math.random() * 8));
  const awayFouls = Math.max(5, awayTeam.redCards * 2 + Math.floor(Math.random() * 8));
  
  return {
    home: {
      shots: homeShots,
      shotsOnTarget: homeShotsOnTarget,
      possession: homePossession,
      corners: homeCorners,
      fouls: homeFouls
    },
    away: {
      shots: awayShots,
      shotsOnTarget: awayShotsOnTarget,
      possession: awayPossession,
      corners: awayCorners,
      fouls: awayFouls
    }
  };
};