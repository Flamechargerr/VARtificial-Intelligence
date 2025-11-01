import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { getHeadToHeadStats, type HeadToHeadStats, getFormIndicatorColor } from "@/shared/utils/headToHeadStats";
import { Trophy, Target, TrendingUp, Calendar } from "lucide-react";

interface HeadToHeadStatsProps {
  homeTeam: string;
  awayTeam: string;
  className?: string;
}

const HeadToHeadStats: React.FC<HeadToHeadStatsProps> = ({ 
  homeTeam, 
  awayTeam, 
  className = "" 
}) => {
  const [stats, setStats] = useState<HeadToHeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeadToHeadStats();
  }, [homeTeam, awayTeam]);

  const loadHeadToHeadStats = () => {
    try {
      setLoading(true);
      const data = getHeadToHeadStats(homeTeam, awayTeam);
      setStats(data);
    } catch (error) {
      console.error("Error loading head-to-head stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Head-to-Head Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading head-to-head stats...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.totalMatches === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Head-to-Head Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            No head-to-head data available for {homeTeam} vs {awayTeam}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5" />
          Head-to-Head Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Record */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.homeWins}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {homeTeam} Wins
            </div>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {stats.draws}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Draws
            </div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.awayWins}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {awayTeam} Wins
            </div>
          </div>
        </div>

        {/* Win Percentage */}
        <div>
          <h3 className="text-sm font-medium mb-2">Win Percentage</h3>
          <div className="flex items-center space-x-2">
            <span className="text-xs w-16 truncate">{homeTeam}</span>
            <div className="flex-1">
              <Progress value={stats.winPercentage.home} className="h-2" />
            </div>
            <span className="text-xs w-8 text-right">{Math.round(stats.winPercentage.home)}%</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-xs w-16 truncate">{awayTeam}</span>
            <div className="flex-1">
              <Progress value={stats.winPercentage.away} className="h-2" />
            </div>
            <span className="text-xs w-8 text-right">{Math.round(stats.winPercentage.away)}%</span>
          </div>
        </div>

        {/* Goals */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Goals</span>
              <Target className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs">{homeTeam}</span>
              <span className="text-xs font-medium">{stats.avgHomeGoals.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">{awayTeam}</span>
              <span className="text-xs font-medium">{stats.avgAwayGoals.toFixed(2)}</span>
            </div>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Goals</span>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs">{homeTeam}</span>
              <span className="text-xs font-medium">{stats.homeGoals}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs">{awayTeam}</span>
              <span className="text-xs font-medium">{stats.awayGoals}</span>
            </div>
          </div>
        </div>

        {/* Recent Form */}
        <div>
          <h3 className="text-sm font-medium mb-2">Recent Form</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{homeTeam}</div>
              <div className="flex space-x-1">
                {stats.recentForm.home.map((result, index) => (
                  <div 
                    key={index} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${getFormIndicatorColor(result)}`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">{awayTeam}</div>
              <div className="flex space-x-1">
                {stats.recentForm.away.map((result, index) => (
                  <div 
                    key={index} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${getFormIndicatorColor(result)}`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Match Count */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            Total Matches
          </div>
          <Badge variant="secondary">{stats.totalMatches}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadToHeadStats;