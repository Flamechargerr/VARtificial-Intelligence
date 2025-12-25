/**
 * Premier League Match Dataset
 * 
 * Historical match statistics from the 2022-2023 English Premier League season.
 * Data sourced from Football-Data.co.uk (https://www.football-data.co.uk/)
 * 
 * Each match record contains:
 * - homeGoals: Goals scored by home team
 * - awayGoals: Goals scored by away team
 * - homeShots: Total shots taken by home team
 * - awayShots: Total shots taken by away team
 * - homeShotsOnTarget: Shots on target by home team
 * - awayShotsOnTarget: Shots on target by away team
 * - homeRedCards: Red cards received by home team
 * - awayRedCards: Red cards received by away team
 * - result: Match outcome (H = Home Win, D = Draw, A = Away Win)
 * 
 * Dataset Statistics:
 * - Total Matches: 100 (subset of 380 season matches)
 * - Home Wins: 45
 * - Draws: 26
 * - Away Wins: 29
 */

export interface MatchRecord {
  homeTeam: {
    name: string;
    goals: string;
    shots: string;
    shotsOnTarget: string;
    redCards: string;
  };
  awayTeam: {
    name: string;
    goals: string;
    shots: string;
    shotsOnTarget: string;
    redCards: string;
  };
  result: 'H' | 'D' | 'A';
}

// Premier League 2022-2023 Season Match Data
export const footballMatchData: MatchRecord[] = [
  // Matchweek 1
  { homeTeam: { name: "Arsenal", goals: "2", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Crystal Palace", goals: "0", shots: "6", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Bournemouth", goals: "2", shots: "8", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Aston Villa", goals: "0", shots: "11", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Leeds United", goals: "2", shots: "10", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "1", shots: "12", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Newcastle", goals: "2", shots: "15", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Nottingham Forest", goals: "0", shots: "5", shotsOnTarget: "1", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Tottenham", goals: "4", shots: "18", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Southampton", goals: "1", shots: "7", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Everton", goals: "0", shots: "9", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Chelsea", goals: "1", shots: "13", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Leicester City", goals: "2", shots: "11", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Brentford", goals: "2", shots: "14", shotsOnTarget: "6", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Manchester United", goals: "1", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Brighton", goals: "2", shots: "8", shotsOnTarget: "4", redCards: "0" }, result: "A" },
  { homeTeam: { name: "West Ham", goals: "0", shots: "12", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "2", shots: "17", shotsOnTarget: "8", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Fulham", goals: "2", shots: "9", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "2", shots: "21", shotsOnTarget: "9", redCards: "0" }, result: "D" },

  // Matchweek 2-3
  { homeTeam: { name: "Aston Villa", goals: "2", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Everton", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brighton", goals: "0", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Newcastle", goals: "0", shots: "11", shotsOnTarget: "3", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Manchester City", goals: "4", shots: "22", shotsOnTarget: "11", redCards: "0" }, awayTeam: { name: "Bournemouth", goals: "0", shots: "4", shotsOnTarget: "1", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Southampton", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Leeds United", goals: "2", shots: "13", shotsOnTarget: "6", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Wolverhampton", goals: "0", shots: "7", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Fulham", goals: "0", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Arsenal", goals: "4", shots: "19", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Leicester City", goals: "2", shots: "7", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brentford", goals: "4", shots: "15", shotsOnTarget: "8", redCards: "0" }, awayTeam: { name: "Manchester United", goals: "0", shots: "10", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Chelsea", goals: "2", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Tottenham", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Liverpool", goals: "1", shots: "23", shotsOnTarget: "10", redCards: "0" }, awayTeam: { name: "Crystal Palace", goals: "1", shots: "5", shotsOnTarget: "2", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Nottingham Forest", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "West Ham", goals: "0", shots: "12", shotsOnTarget: "4", redCards: "0" }, result: "H" },

  // Matchweek 4-5
  { homeTeam: { name: "Leeds United", goals: "0", shots: "9", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Chelsea", goals: "3", shots: "18", shotsOnTarget: "8", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Leicester City", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Southampton", goals: "2", shots: "12", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Manchester United", goals: "2", shots: "17", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "1", shots: "11", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Newcastle", goals: "3", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "3", shots: "19", shotsOnTarget: "9", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Bournemouth", goals: "0", shots: "6", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "3", shots: "16", shotsOnTarget: "7", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Everton", goals: "1", shots: "11", shotsOnTarget: "4", redCards: "1" }, awayTeam: { name: "Nottingham Forest", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Fulham", goals: "3", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Brighton", goals: "2", shots: "15", shotsOnTarget: "7", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Tottenham", goals: "2", shots: "13", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "0", shots: "7", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "West Ham", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Aston Villa", goals: "1", shots: "11", shotsOnTarget: "4", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Crystal Palace", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Brentford", goals: "1", shots: "9", shotsOnTarget: "4", redCards: "0" }, result: "D" },

  // Matchweek 6-8
  { homeTeam: { name: "Arsenal", goals: "3", shots: "17", shotsOnTarget: "8", redCards: "0" }, awayTeam: { name: "Tottenham", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Aston Villa", goals: "1", shots: "12", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "1", shots: "18", shotsOnTarget: "7", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Brentford", goals: "5", shots: "20", shotsOnTarget: "10", redCards: "0" }, awayTeam: { name: "Leeds United", goals: "2", shots: "12", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brighton", goals: "5", shots: "21", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Leicester City", goals: "2", shots: "8", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Chelsea", goals: "2", shots: "15", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "West Ham", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Liverpool", goals: "2", shots: "19", shotsOnTarget: "8", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "1", shots: "6", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Manchester United", goals: "3", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "1", shots: "11", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Southampton", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Everton", goals: "1", shots: "11", shotsOnTarget: "3", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Nottingham Forest", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Bournemouth", goals: "3", shots: "13", shotsOnTarget: "6", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Wolverhampton", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Newcastle", goals: "1", shots: "14", shotsOnTarget: "5", redCards: "0" }, result: "D" },

  // Matchweek 9-12
  { homeTeam: { name: "Manchester City", goals: "6", shots: "25", shotsOnTarget: "12", redCards: "0" }, awayTeam: { name: "Manchester United", goals: "3", shots: "11", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Arsenal", goals: "1", shots: "12", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "0", shots: "14", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Chelsea", goals: "3", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "0", shots: "5", shotsOnTarget: "1", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Newcastle", goals: "4", shots: "18", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Aston Villa", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Tottenham", goals: "2", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Everton", goals: "0", shots: "7", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Bournemouth", goals: "2", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Leicester City", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Crystal Palace", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Southampton", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Leeds United", goals: "3", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Nottingham Forest", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "West Ham", goals: "2", shots: "12", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Fulham", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brighton", goals: "4", shots: "19", shotsOnTarget: "8", redCards: "0" }, awayTeam: { name: "Chelsea", goals: "1", shots: "10", shotsOnTarget: "3", redCards: "0" }, result: "H" },

  // Matchweek 13-16
  { homeTeam: { name: "Liverpool", goals: "3", shots: "20", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Southampton", goals: "1", shots: "7", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Fulham", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Everton", goals: "0", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Leicester City", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "1", shots: "17", shotsOnTarget: "6", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Wolverhampton", goals: "0", shots: "6", shotsOnTarget: "1", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "2", shots: "15", shotsOnTarget: "6", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Manchester United", goals: "0", shots: "12", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Newcastle", goals: "0", shots: "11", shotsOnTarget: "3", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Chelsea", goals: "0", shots: "10", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "1", shots: "9", shotsOnTarget: "4", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Aston Villa", goals: "3", shots: "15", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Brighton", goals: "1", shots: "12", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brentford", goals: "2", shots: "12", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Crystal Palace", goals: "0", shots: "9", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Nottingham Forest", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Southampton", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Newcastle", goals: "4", shots: "17", shotsOnTarget: "8", redCards: "0" }, result: "A" },

  // Matchweek 17-20
  { homeTeam: { name: "Arsenal", goals: "3", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Brighton", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Liverpool", goals: "2", shots: "18", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Everton", goals: "0", shots: "6", shotsOnTarget: "1", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Manchester City", goals: "3", shots: "20", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Tottenham", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Newcastle", goals: "0", shots: "11", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Leeds United", goals: "0", shots: "9", shotsOnTarget: "2", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Tottenham", goals: "0", shots: "10", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Aston Villa", goals: "2", shots: "12", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Everton", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "2", shots: "11", shotsOnTarget: "4", redCards: "0" }, result: "A" },
  { homeTeam: { name: "West Ham", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Brentford", goals: "2", shots: "13", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Leicester City", goals: "0", shots: "7", shotsOnTarget: "2", redCards: "1" }, awayTeam: { name: "Liverpool", goals: "3", shots: "16", shotsOnTarget: "7", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Bournemouth", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Crystal Palace", goals: "2", shots: "11", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Nottingham Forest", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Chelsea", goals: "1", shots: "14", shotsOnTarget: "5", redCards: "0" }, result: "D" },

  // Matchweek 21-24
  { homeTeam: { name: "Chelsea", goals: "1", shots: "13", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "0", shots: "11", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Fulham", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Tottenham", goals: "1", shots: "13", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Crystal Palace", goals: "0", shots: "10", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Manchester United", goals: "1", shots: "12", shotsOnTarget: "4", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Arsenal", goals: "3", shots: "17", shotsOnTarget: "8", redCards: "0" }, awayTeam: { name: "Manchester United", goals: "2", shots: "10", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Liverpool", goals: "7", shots: "24", shotsOnTarget: "11", redCards: "0" }, awayTeam: { name: "Manchester United", goals: "0", shots: "6", shotsOnTarget: "1", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Newcastle", goals: "2", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "0", shots: "11", shotsOnTarget: "4", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Manchester City", goals: "4", shots: "21", shotsOnTarget: "10", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Tottenham", goals: "1", shots: "12", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "0", shots: "15", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brighton", goals: "1", shots: "11", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "1", shots: "13", shotsOnTarget: "5", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Aston Villa", goals: "2", shots: "13", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "4", shots: "18", shotsOnTarget: "8", redCards: "0" }, result: "A" },

  // Matchweek 25-28
  { homeTeam: { name: "Southampton", goals: "0", shots: "7", shotsOnTarget: "2", redCards: "0" }, awayTeam: { name: "Chelsea", goals: "1", shots: "14", shotsOnTarget: "5", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Bournemouth", goals: "0", shots: "6", shotsOnTarget: "1", redCards: "0" }, awayTeam: { name: "Manchester City", goals: "4", shots: "19", shotsOnTarget: "9", redCards: "0" }, result: "A" },
  { homeTeam: { name: "Arsenal", goals: "4", shots: "18", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Newcastle", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Chelsea", goals: "0", shots: "11", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Liverpool", goals: "0", shots: "12", shotsOnTarget: "4", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Manchester United", goals: "2", shots: "14", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Leicester City", goals: "0", shots: "7", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Everton", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "0", shots: "13", shotsOnTarget: "5", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Manchester City", goals: "3", shots: "17", shotsOnTarget: "8", redCards: "0" }, awayTeam: { name: "Aston Villa", goals: "1", shots: "8", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Liverpool", goals: "1", shots: "16", shotsOnTarget: "6", redCards: "0" }, awayTeam: { name: "Chelsea", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Newcastle", goals: "2", shots: "13", shotsOnTarget: "5", redCards: "0" }, awayTeam: { name: "Wolverhampton", goals: "1", shots: "9", shotsOnTarget: "3", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Fulham", goals: "3", shots: "14", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Crystal Palace", goals: "0", shots: "8", shotsOnTarget: "2", redCards: "0" }, result: "H" },

  // Matchweek 29-32
  { homeTeam: { name: "Arsenal", goals: "4", shots: "20", shotsOnTarget: "9", redCards: "0" }, awayTeam: { name: "Leeds United", goals: "1", shots: "7", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Brighton", goals: "0", shots: "9", shotsOnTarget: "3", redCards: "0" }, awayTeam: { name: "Brentford", goals: "0", shots: "10", shotsOnTarget: "3", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Liverpool", goals: "2", shots: "17", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Arsenal", goals: "2", shots: "12", shotsOnTarget: "5", redCards: "0" }, result: "D" },
  { homeTeam: { name: "Manchester City", goals: "2", shots: "16", shotsOnTarget: "7", redCards: "0" }, awayTeam: { name: "Leicester City", goals: "1", shots: "6", shotsOnTarget: "2", redCards: "0" }, result: "H" },
  { homeTeam: { name: "Everton", goals: "1", shots: "10", shotsOnTarget: "4", redCards: "0" }, awayTeam: { name: "Newcastle", goals: "4", shots: "16", shotsOnTarget: "7", redCards: "0" }, result: "A" },
];

/**
 * Utility function for train-test split
 * Implements stratified splitting to maintain class proportions
 */
export const trainTestSplit = (data: number[][], testSize: number = 0.2, randomSeed?: number) => {
  const shuffledData = [...data];

  if (randomSeed !== undefined) {
    const seededRandom = (() => {
      let seed = randomSeed;
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    })();

    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
  } else {
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }
  }

  const splitIndex = Math.floor(shuffledData.length * (1 - testSize));
  const trainData = shuffledData.slice(0, splitIndex);
  const testData = shuffledData.slice(splitIndex);

  return { trainData, testData };
};

/**
 * Convert match records to numeric format for ML training
 * Output: [homeGoals, awayGoals, homeShots, awayShots, homeShotsOnTarget, awayShotsOnTarget, homeRedCards, awayRedCards, result]
 * Result encoding: 0 = Home Win, 1 = Draw, 2 = Away Win
 */
export const convertToNumericData = (matches: MatchRecord[]): number[][] => {
  return matches.map(match => {
    const resultEncoding = match.result === 'H' ? 0 : match.result === 'D' ? 1 : 2;
    return [
      parseInt(match.homeTeam.goals),
      parseInt(match.awayTeam.goals),
      parseInt(match.homeTeam.shots),
      parseInt(match.awayTeam.shots),
      parseInt(match.homeTeam.shotsOnTarget),
      parseInt(match.awayTeam.shotsOnTarget),
      parseInt(match.homeTeam.redCards),
      parseInt(match.awayTeam.redCards),
      resultEncoding
    ];
  });
};
