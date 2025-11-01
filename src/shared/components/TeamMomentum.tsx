import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { 
  getTeamMomentum, 
  getMomentumColor, 
  getMomentumBgColor, 
  getFormIndicatorColor,
  getFormTrendIcon,
  type MomentumData 
} from "@/shared/utils/momentumService";
import { TrendingUp, Target, Shield, Zap } from "lucide-react";

interface TeamMomentumProps {
  teamName: string;
  className?: string;
}

const TeamMomentum: React.FC<TeamMomentumProps> = ({ 
  teamName,
  className = "" 
}) => {
  const [momentumData, setMomentumData] = useState<MomentumData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMomentumData();
  }, [teamName]);

  const loadMomentumData = () => {
    try {
      setLoading(true);
      const data = getTeamMomentum(teamName);
      setMomentumData(data);
    } catch (error) {
      console.error("Error loading momentum data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Team Momentum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading momentum data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!momentumData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Team Momentum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            Momentum data not available for {teamName}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Team Momentum: {teamName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Momentum Score */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getMomentumBgColor(momentumData.momentumScore)}`}>
            <span className={`text-2xl font-bold ${getMomentumColor(momentumData.momentumScore)}`}>
              {momentumData.momentumScore}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Momentum Score
          </p>
          <p className="text-xs mt-1 px-2">
            {momentumData.momentumDescription}
          </p>
        </div>

        {/* Momentum Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Momentum</span>
            <span className={getMomentumColor(momentumData.momentumScore)}>
              {momentumData.momentumScore}/100
            </span>
          </div>
          <Progress 
            value={momentumData.momentumScore} 
            className="h-2"
          />
        </div>

        {/* Recent Form */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-1" />
            Recent Form (Last 5 Matches)
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {momentumData.currentForm.map((result, index) => (
                <div 
                  key={index} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${getFormIndicatorColor(result)}`}
                >
                  {result}
                </div>
              ))}
            </div>
            <Badge variant="secondary" className="flex items-center">
              Trend: {getFormTrendIcon(momentumData.formTrend)} {momentumData.formTrend}
            </Badge>
          </div>
        </div>

        {/* Goals Analysis */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Target className="w-4 h-4 mr-1" />
            Recent Goals
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Goals Scored</div>
              <div className="flex items-center">
                <div className="text-lg font-bold text-green-700 dark:text-green-300">
                  {momentumData.recentGoals.scored.reduce((a, b) => a + b, 0)}
                </div>
                <div className="ml-2 text-xs text-gray-500">
                  (avg: {(momentumData.recentGoals.scored.reduce((a, b) => a + b, 0) / momentumData.recentGoals.scored.length).toFixed(1)})
                </div>
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Goals Conceded</div>
              <div className="flex items-center">
                <div className="text-lg font-bold text-red-700 dark:text-red-300">
                  {momentumData.recentGoals.conceded.reduce((a, b) => a + b, 0)}
                </div>
                <div className="ml-2 text-xs text-gray-500">
                  (avg: {(momentumData.recentGoals.conceded.reduce((a, b) => a + b, 0) / momentumData.recentGoals.conceded.length).toFixed(1)})
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Sheets */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            Clean Sheets
          </h3>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Recent Clean Sheets</span>
              <Badge variant="default" className="text-sm">
                {momentumData.cleanSheets}
              </Badge>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(momentumData.cleanSheets / 5) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {momentumData.cleanSheets} out of last 5 matches
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMomentum;