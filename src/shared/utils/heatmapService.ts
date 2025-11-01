// Heatmap service to generate prediction heatmap data
export interface HeatmapCell {
  x: number; // Home team goals
  y: number; // Away team goals
  probability: number; // Probability of this scoreline (0-1)
  confidence: number; // Confidence level for this prediction (0-100)
}

export interface HeatmapData {
  cells: HeatmapCell[];
  maxX: number; // Maximum home team goals
  maxY: number; // Maximum away team goals
  homeWinProbability: number; // Overall home win probability
  awayWinProbability: number; // Overall away win probability
  drawProbability: number; // Overall draw probability
  mostLikelyScore: { home: number; away: number };
}

// Mock heatmap data for different match scenarios
// In a real application, this would be generated from ML model predictions
export const generateHeatmapData = (
  homeTeam: string,
  awayTeam: string,
  homeGoals: number,
  awayGoals: number
): HeatmapData => {
  // Base probabilities - these would normally come from ML models
  const baseHomeWin = 0.45;
  const baseAwayWin = 0.35;
  const baseDraw = 0.20;
  
  // Adjust based on team strengths (simplified)
  const teamStrengthDiff = Math.min(1, Math.abs(homeGoals - awayGoals) / 10);
  const homeAdvantage = homeGoals > awayGoals ? teamStrengthDiff : -teamStrengthDiff;
  
  const adjustedHomeWin = Math.min(0.8, Math.max(0.2, baseHomeWin + homeAdvantage * 0.3));
  const adjustedAwayWin = Math.min(0.8, Math.max(0.2, baseAwayWin - homeAdvantage * 0.3));
  const adjustedDraw = 1 - adjustedHomeWin - adjustedAwayWin;
  
  // Generate heatmap cells
  const cells: HeatmapCell[] = [];
  const maxX = 5; // Max 5 goals for home team
  const maxY = 5; // Max 5 goals for away team
  
  // Most likely score based on team stats
  const likelyHomeGoals = Math.min(5, Math.max(0, Math.round(homeGoals / 2)));
  const likelyAwayGoals = Math.min(5, Math.max(0, Math.round(awayGoals / 2)));
  
  // Generate probabilities for each scoreline
  for (let x = 0; x <= maxX; x++) {
    for (let y = 0; y <= maxY; y++) {
      // Calculate base probability using a simple model
      let probability = 0.01; // Base probability
      
      // Increase probability for likely scores
      const distanceFromLikely = Math.abs(x - likelyHomeGoals) + Math.abs(y - likelyAwayGoals);
      const likelihoodFactor = Math.max(0, 1 - distanceFromLikely * 0.2);
      probability += 0.15 * likelihoodFactor;
      
      // Adjust for match outcome probabilities
      if (x > y) {
        // Home win
        probability *= adjustedHomeWin * 2;
      } else if (y > x) {
        // Away win
        probability *= adjustedAwayWin * 2;
      } else {
        // Draw
        probability *= adjustedDraw * 2;
      }
      
      // Normalize probability (simplified)
      probability = Math.min(0.3, probability);
      
      cells.push({
        x,
        y,
        probability,
        confidence: Math.min(100, Math.max(0, 90 - distanceFromLikely * 10))
      });
    }
  }
  
  // Normalize probabilities to sum to 1
  const totalProbability = cells.reduce((sum, cell) => sum + cell.probability, 0);
  cells.forEach(cell => {
    cell.probability = cell.probability / totalProbability;
  });
  
  return {
    cells,
    maxX,
    maxY,
    homeWinProbability: adjustedHomeWin,
    awayWinProbability: adjustedAwayWin,
    drawProbability: adjustedDraw,
    mostLikelyScore: { home: likelyHomeGoals, away: likelyAwayGoals }
  };
};

// Function to get color based on probability
export const getHeatmapColor = (probability: number): string => {
  // Convert probability to a value between 0 and 1
  const normalized = Math.min(1, Math.max(0, probability * 5)); // Scale for better visualization
  
  // Simple color gradient from blue (low) to red (high)
  const r = Math.min(255, Math.floor(normalized * 255));
  const g = Math.min(255, Math.floor((1 - Math.abs(normalized - 0.5) * 2) * 255));
  const b = Math.min(255, Math.floor((1 - normalized) * 255));
  
  return `rgb(${r}, ${g}, ${b})`;
};

// Function to get opacity based on confidence
export const getHeatmapOpacity = (confidence: number): number => {
  return Math.min(1, Math.max(0.3, confidence / 100));
};