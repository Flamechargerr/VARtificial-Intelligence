/**
 * Premier League Teams (2022-23 Season)
 * 
 * This list matches the teams in our training dataset.
 * Using Premier League clubs ensures consistency between
 * the prediction model and the user interface.
 */
export const teams = [
  "Arsenal",
  "Aston Villa",
  "Bournemouth",
  "Brentford",
  "Brighton",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Leeds United",
  "Leicester City",
  "Liverpool",
  "Manchester City",
  "Manchester United",
  "Newcastle",
  "Nottingham Forest",
  "Southampton",
  "Tottenham",
  "West Ham",
  "Wolverhampton",
];

/**
 * Team Stadium/Location Mapping
 * 
 * Maps each Premier League team to their home stadium
 * for weather impact analysis and match context.
 */
export const teamLocations: Record<string, string> = {
  "Arsenal": "Emirates Stadium, London",
  "Aston Villa": "Villa Park, Birmingham",
  "Bournemouth": "Vitality Stadium, Bournemouth",
  "Brentford": "Gtech Community Stadium, London",
  "Brighton": "Amex Stadium, Brighton",
  "Chelsea": "Stamford Bridge, London",
  "Crystal Palace": "Selhurst Park, London",
  "Everton": "Goodison Park, Liverpool",
  "Fulham": "Craven Cottage, London",
  "Leeds United": "Elland Road, Leeds",
  "Leicester City": "King Power Stadium, Leicester",
  "Liverpool": "Anfield, Liverpool",
  "Manchester City": "Etihad Stadium, Manchester",
  "Manchester United": "Old Trafford, Manchester",
  "Newcastle": "St James' Park, Newcastle",
  "Nottingham Forest": "City Ground, Nottingham",
  "Southampton": "St Mary's Stadium, Southampton",
  "Tottenham": "Tottenham Hotspur Stadium, London",
  "West Ham": "London Stadium, London",
  "Wolverhampton": "Molineux Stadium, Wolverhampton",
};