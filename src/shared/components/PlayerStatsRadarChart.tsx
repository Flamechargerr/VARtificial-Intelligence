import React from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";

interface PlayerStat {
  name: string;
  value: number;
}

interface PlayerStatsRadarChartProps {
  playerName: string;
  stats: PlayerStat[];
  color?: string;
}

const PlayerStatsRadarChart: React.FC<PlayerStatsRadarChartProps> = ({ 
  playerName, 
  stats,
  color = "#3b82f6"
}) => {
  // Normalize stats to a 0-100 scale if needed
  const normalizedStats = stats.map(stat => ({
    ...stat,
    value: stat.value > 100 ? 100 : stat.value
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={normalizedStats}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name={playerName}
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlayerStatsRadarChart;