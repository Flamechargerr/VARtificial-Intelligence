import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Target, Zap, Trophy, Shield } from "lucide-react";

interface TeamStats {
  name: string;
  goals: number;
  shots: number;
  shotsOnTarget: number;
  redCards: number;
  wins: number;
  draws: number;
  losses: number;
}

interface TeamComparisonProps {
  homeTeam: TeamStats;
  awayTeam: TeamStats;
}

const TeamComparison: React.FC<TeamComparisonProps> = ({ homeTeam, awayTeam }) => {
  // Calculate derived statistics
  const homeShotEfficiency = homeTeam.shots > 0 ? (homeTeam.shotsOnTarget / homeTeam.shots) * 100 : 0;
  const awayShotEfficiency = awayTeam.shots > 0 ? (awayTeam.shotsOnTarget / awayTeam.shots) * 100 : 0;
  
  const homeDiscipline = 100 - (homeTeam.redCards * 10); // Assuming max 10 red cards
  const awayDiscipline = 100 - (awayTeam.redCards * 10);
  
  // Comparison data for charts
  const comparisonData = [
    { 
      name: "Goals", 
      home: homeTeam.goals, 
      away: awayTeam.goals,
      homeColor: "#3b82f6",
      awayColor: "#ef4444"
    },
    { 
      name: "Shots", 
      home: homeTeam.shots, 
      away: awayTeam.shots,
      homeColor: "#3b82f6",
      awayColor: "#ef4444"
    },
    { 
      name: "Shot Efficiency", 
      home: homeShotEfficiency, 
      away: awayShotEfficiency,
      homeColor: "#3b82f6",
      awayColor: "#ef4444"
    },
    { 
      name: "Discipline", 
      home: homeDiscipline, 
      away: awayDiscipline,
      homeColor: "#3b82f6",
      awayColor: "#ef4444"
    }
  ];

  // Form data for win/draw/loss comparison
  const formData = [
    { name: "Wins", home: homeTeam.wins, away: awayTeam.wins },
    { name: "Draws", home: homeTeam.draws, away: awayTeam.draws },
    { name: "Losses", home: homeTeam.losses, away: awayTeam.losses }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="flex items-center text-base md:text-lg">
            <Target className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            Team Comparison
          </span>
          <Badge variant="outline" className="text-xs md:text-sm">{homeTeam.name} vs {awayTeam.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Statistical Comparison Chart */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Statistical Comparison</h3>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 15, right: 15, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [Number(value).toFixed(1), 'Value']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="home" name={homeTeam.name}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.homeColor} />
                    ))}
                  </Bar>
                  <Bar dataKey="away" name={awayTeam.name}>
                    {comparisonData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.awayColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Form Statistics */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
              <Shield className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
              Recent Form
            </h3>
            <div className="space-y-3 md:space-y-4">
              {formData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm font-medium">{item.name}</span>
                    <span className="text-xs md:text-sm font-medium">{item.home} - {item.away}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.home / (item.home + item.away || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Stats */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center">
              <Zap className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
              Detailed Statistics
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <div className="flex flex-wrap justify-between mb-1 gap-1">
                  <span className="text-xs md:text-sm font-medium">Shot Efficiency</span>
                  <span className="text-xs md:text-sm font-medium">
                    {homeTeam.name}: {homeShotEfficiency.toFixed(1)}% | {awayTeam.name}: {awayShotEfficiency.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={(homeShotEfficiency / (homeShotEfficiency + awayShotEfficiency || 1)) * 100} 
                  className="w-full h-2"
                />
              </div>
              
              <div>
                <div className="flex flex-wrap justify-between mb-1 gap-1">
                  <span className="text-xs md:text-sm font-medium">Discipline</span>
                  <span className="text-xs md:text-sm font-medium">
                    {homeTeam.name}: {homeDiscipline.toFixed(0)}% | {awayTeam.name}: {awayDiscipline.toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={(homeDiscipline / (homeDiscipline + awayDiscipline || 1)) * 100} 
                  className="w-full h-2"
                />
              </div>
              
              <div>
                <div className="flex flex-wrap justify-between mb-1 gap-1">
                  <span className="text-xs md:text-sm font-medium">Red Cards</span>
                  <span className="text-xs md:text-sm font-medium">
                    {homeTeam.name}: {homeTeam.redCards} | {awayTeam.name}: {awayTeam.redCards}
                  </span>
                </div>
                <Progress 
                  value={(awayTeam.redCards / (homeTeam.redCards + awayTeam.redCards || 1)) * 100} 
                  className="w-full h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamComparison;