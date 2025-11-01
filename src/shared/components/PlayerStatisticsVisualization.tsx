import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import PlayerStatsRadarChart from "./PlayerStatsRadarChart";
import { type Player } from "../utils/types";

interface PlayerStatisticsVisualizationProps {
  players: Player[];
  teamName: string;
}

const PlayerStatisticsVisualization: React.FC<PlayerStatisticsVisualizationProps> = ({ 
  players, 
  teamName 
}) => {
  // Generate mock statistics for each player based on their rating
  const generatePlayerStats = (player: Player) => {
    const baseValue = player.rating || 70;
    return [
      { name: "Pace", value: Math.min(100, baseValue + Math.floor(Math.random() * 20) - 10) },
      { name: "Shooting", value: Math.min(100, baseValue + Math.floor(Math.random() * 20) - 10) },
      { name: "Passing", value: Math.min(100, baseValue + Math.floor(Math.random() * 20) - 10) },
      { name: "Dribbling", value: Math.min(100, baseValue + Math.floor(Math.random() * 20) - 10) },
      { name: "Defending", value: Math.min(100, baseValue + Math.floor(Math.random() * 20) - 10) },
      { name: "Physical", value: Math.min(100, baseValue + Math.floor(Math.random() * 20) - 10) },
    ];
  };

  // Get top players by position
  const getTopPlayersByPosition = () => {
    const positions: Record<string, Player[]> = {};
    
    players.forEach(player => {
      if (!positions[player.position]) {
        positions[player.position] = [];
      }
      positions[player.position].push(player);
    });
    
    // Sort each position by rating and take top 3
    Object.keys(positions).forEach(position => {
      positions[position].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      positions[position] = positions[position].slice(0, 3);
    });
    
    return positions;
  };

  const topPlayersByPosition = getTopPlayersByPosition();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Player Statistics - {teamName}</span>
          <Badge variant="outline">{players.length} Players</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top players by position */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Players by Position</h3>
            <div className="space-y-4">
              {Object.entries(topPlayersByPosition).map(([position, players]) => (
                <div key={position} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{position}</h4>
                  <div className="space-y-2">
                    {players.map((player, index) => (
                      <div key={player.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="mr-2">{index + 1}.</span>
                          <span>{player.name}</span>
                        </div>
                        <Badge variant="secondary">{player.rating || "N/A"}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Player radar charts */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Player Attributes</h3>
            {players.slice(0, 2).map((player) => (
              <div key={player.id} className="mb-6 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{player.name}</span>
                  <Badge variant="outline">{player.position}</Badge>
                </div>
                <PlayerStatsRadarChart 
                  playerName={player.name}
                  stats={generatePlayerStats(player)}
                  color={player.position === "GK" ? "#ef4444" : player.position === "DEF" ? "#3b82f6" : player.position === "MID" ? "#10b981" : "#f59e0b"}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Team average rating */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Team Average Rating</span>
            <Badge variant="default" className="text-lg">
              {players.length > 0 
                ? (players.reduce((sum, player) => sum + (player.rating || 0), 0) / players.length).toFixed(1)
                : "N/A"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStatisticsVisualization;