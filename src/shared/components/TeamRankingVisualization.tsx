import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  getAllTeamRankings,
  getTeamRanking,
  getTopTeams,
  getTeamsInRange,
  getFormIndicatorColor,
  getPositionColor,
  getPositionBadgeColor,
  type TeamRanking
} from "@/shared/utils/teamRankingService";
import { Trophy, TrendingUp, Target, Shield } from "lucide-react";

interface TeamRankingVisualizationProps {
  selectedTeam?: string;
  showTopTeams?: number;
  className?: string;
}

const TeamRankingVisualization: React.FC<TeamRankingVisualizationProps> = ({
  selectedTeam,
  showTopTeams = 10,
  className = ""
}) => {
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'full' | 'top' | 'selected'>('top');

  useEffect(() => {
    loadTeamRankings();
  }, [selectedTeam, showTopTeams, viewMode]);

  const loadTeamRankings = () => {
    try {
      setLoading(true);
      let data: TeamRanking[] = [];

      switch (viewMode) {
        case 'full':
          data = getAllTeamRankings();
          break;
        case 'top':
          data = getTopTeams(showTopTeams);
          break;
        case 'selected':
          if (selectedTeam) {
            const teamRanking = getTeamRanking(selectedTeam);
            if (teamRanking) {
              // Get teams around the selected team's position
              const start = Math.max(1, teamRanking.position - 2);
              const end = teamRanking.position + 2;
              data = getTeamsInRange(start, end);
            }
          }
          break;
      }

      setRankings(data);
    } catch (error) {
      console.error("Error loading team rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewModeChange = (mode: 'full' | 'top' | 'selected') => {
    setViewMode(mode);
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              League Table
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading team rankings...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            League Table
            <Badge variant="outline" className="ml-2 text-xs text-green-600 border-green-300">
              2022-23 Season
            </Badge>
          </span>
          <div className="flex space-x-1">
            <Badge
              variant={viewMode === 'top' ? "default" : "secondary"}
              className="cursor-pointer text-xs"
              onClick={() => handleViewModeChange('top')}
            >
              Top {showTopTeams}
            </Badge>
            <Badge
              variant={viewMode === 'full' ? "default" : "secondary"}
              className="cursor-pointer text-xs"
              onClick={() => handleViewModeChange('full')}
            >
              Full Table
            </Badge>
            {selectedTeam && (
              <Badge
                variant={viewMode === 'selected' ? "default" : "secondary"}
                className="cursor-pointer text-xs"
                onClick={() => handleViewModeChange('selected')}
              >
                {selectedTeam}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* League Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pl-2">Pos</th>
                <th className="text-left py-2">Team</th>
                <th className="text-center py-2">P</th>
                <th className="text-center py-2">W</th>
                <th className="text-center py-2">D</th>
                <th className="text-center py-2">L</th>
                <th className="text-center py-2">GF</th>
                <th className="text-center py-2">GA</th>
                <th className="text-center py-2">GD</th>
                <th className="text-center py-2">Pts</th>
                <th className="text-center py-2">Form</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((team) => (
                <tr
                  key={team.teamName}
                  className={`border-b hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedTeam && team.teamName === selectedTeam
                      ? "bg-blue-50 dark:bg-blue-900/30 font-medium"
                      : ""
                    }`}
                >
                  <td className={`py-2 pl-2 font-medium ${getPositionColor(team.position)}`}>
                    {team.position}
                  </td>
                  <td className="py-2">
                    <div className="flex items-center">
                      <span className="truncate max-w-[120px]">{team.teamName}</span>
                    </div>
                  </td>
                  <td className="text-center py-2">{team.gamesPlayed}</td>
                  <td className="text-center py-2 text-green-600 dark:text-green-400">{team.wins}</td>
                  <td className="text-center py-2 text-yellow-600 dark:text-yellow-400">{team.draws}</td>
                  <td className="text-center py-2 text-red-600 dark:text-red-400">{team.losses}</td>
                  <td className="text-center py-2">{team.goalsFor}</td>
                  <td className="text-center py-2">{team.goalsAgainst}</td>
                  <td className={`text-center py-2 font-medium ${team.goalDifference > 0 ? "text-green-600 dark:text-green-400" :
                      team.goalDifference < 0 ? "text-red-600 dark:text-red-400" : ""
                    }`}>
                    {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                  </td>
                  <td className="text-center py-2 font-bold">{team.points}</td>
                  <td className="text-center py-2">
                    <div className="flex justify-center space-x-1">
                      {team.form.map((result, index) => (
                        <div
                          key={index}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${getFormIndicatorColor(result)}`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key */}
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Champions League
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Europa League
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            Conference League
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Relegation
          </Badge>
        </div>

        {/* Selected Team Highlight */}
        {selectedTeam && viewMode !== 'selected' && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="font-medium">{selectedTeam}</span>
              </div>
              {rankings.find(t => t.teamName === selectedTeam) && (
                <Badge className={getPositionBadgeColor(rankings.find(t => t.teamName === selectedTeam)!.position)}>
                  Position: {rankings.find(t => t.teamName === selectedTeam)!.position}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamRankingVisualization;