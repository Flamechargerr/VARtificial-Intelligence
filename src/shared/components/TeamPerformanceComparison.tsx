import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import TeamPerformanceRadarChart from "./charts/TeamPerformanceRadarChart";
import { Badge } from "@/shared/components/ui/badge";
import { Target, Shield, Users, AlertTriangle, TrendingUp } from "lucide-react";

interface TeamPerformanceComparisonProps {
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
}

const TeamPerformanceComparison: React.FC<TeamPerformanceComparisonProps> = ({ 
  homeTeam, 
  awayTeam 
}) => {
  // Calculate performance metrics for home team
  const homeTeamPerformance = {
    teamName: homeTeam.name,
    attack: Math.min(100, (parseInt(homeTeam.goals || "0") * 10 + parseInt(homeTeam.shotsOnTarget || "0") * 2)),
    defense: Math.min(100, 100 - (parseInt(homeTeam.goals || "0") * 5)), // Lower goals conceded = better defense
    midfield: Math.min(100, parseInt(homeTeam.shots || "0") * 3), // More shots = better midfield control
    discipline: Math.max(0, 100 - (parseInt(homeTeam.redCards || "0") * 20)), // Fewer red cards = better discipline
    form: 75 // Default form, would be dynamic in a real app
  };

  // Calculate performance metrics for away team
  const awayTeamPerformance = {
    teamName: awayTeam.name,
    attack: Math.min(100, (parseInt(awayTeam.goals || "0") * 10 + parseInt(awayTeam.shotsOnTarget || "0") * 2)),
    defense: Math.min(100, 100 - (parseInt(awayTeam.goals || "0") * 5)),
    midfield: Math.min(100, parseInt(awayTeam.shots || "0") * 3),
    discipline: Math.max(0, 100 - (parseInt(awayTeam.redCards || "0") * 20)),
    form: 70 // Default form, would be dynamic in a real app
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="flex items-center text-base md:text-lg">
            <TrendingUp className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            Team Performance Comparison
          </span>
          <Badge variant="outline" className="text-xs md:text-sm">{homeTeam.name} vs {awayTeam.name}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Radar Chart */}
          <div className="lg:col-span-2 h-[300px] md:h-[400px]">
            <TeamPerformanceRadarChart 
              homeTeam={homeTeamPerformance} 
              awayTeam={awayTeamPerformance} 
            />
          </div>
          
          {/* Performance Stats */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold">Performance Metrics</h3>
            
            {/* Attack */}
            <div className="p-3 md:p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <Target className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500" />
                <span className="font-medium text-sm md:text-base">Attack</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{homeTeam.name}</span>
                <span className="font-medium">{homeTeamPerformance.attack}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{awayTeam.name}</span>
                <span className="font-medium">{awayTeamPerformance.attack}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-1.5 md:h-2 rounded-full" 
                  style={{ width: `${homeTeamPerformance.attack}%` }}
                ></div>
                <div 
                  className="bg-red-600 h-1.5 md:h-2 rounded-full -mt-1.5 md:-mt-2" 
                  style={{ width: `${awayTeamPerformance.attack}%` }}
                ></div>
              </div>
            </div>
            
            {/* Defense */}
            <div className="p-3 md:p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <Shield className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-green-500" />
                <span className="font-medium text-sm md:text-base">Defense</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{homeTeam.name}</span>
                <span className="font-medium">{homeTeamPerformance.defense}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{awayTeam.name}</span>
                <span className="font-medium">{awayTeamPerformance.defense}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-1.5 md:h-2 rounded-full" 
                  style={{ width: `${homeTeamPerformance.defense}%` }}
                ></div>
                <div 
                  className="bg-red-600 h-1.5 md:h-2 rounded-full -mt-1.5 md:-mt-2" 
                  style={{ width: `${awayTeamPerformance.defense}%` }}
                ></div>
              </div>
            </div>
            
            {/* Discipline */}
            <div className="p-3 md:p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <AlertTriangle className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-yellow-500" />
                <span className="font-medium text-sm md:text-base">Discipline</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{homeTeam.name}</span>
                <span className="font-medium">{homeTeamPerformance.discipline}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{awayTeam.name}</span>
                <span className="font-medium">{awayTeamPerformance.discipline}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-1.5 md:h-2 rounded-full" 
                  style={{ width: `${homeTeamPerformance.discipline}%` }}
                ></div>
                <div 
                  className="bg-red-600 h-1.5 md:h-2 rounded-full -mt-1.5 md:-mt-2" 
                  style={{ width: `${awayTeamPerformance.discipline}%` }}
                ></div>
              </div>
            </div>
            
            {/* Form */}
            <div className="p-3 md:p-4 rounded-lg border bg-card">
              <div className="flex items-center mb-2">
                <TrendingUp className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 text-purple-500" />
                <span className="font-medium text-sm md:text-base">Current Form</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{homeTeam.name}</span>
                <span className="font-medium">{homeTeamPerformance.form}</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>{awayTeam.name}</span>
                <span className="font-medium">{awayTeamPerformance.form}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 md:h-2 dark:bg-gray-700">
                <div 
                  className="bg-blue-600 h-1.5 md:h-2 rounded-full" 
                  style={{ width: `${homeTeamPerformance.form}%` }}
                ></div>
                <div 
                  className="bg-red-600 h-1.5 md:h-2 rounded-full -mt-1.5 md:-mt-2" 
                  style={{ width: `${awayTeamPerformance.form}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceComparison;