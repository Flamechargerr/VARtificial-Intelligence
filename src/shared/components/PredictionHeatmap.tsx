import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  generateHeatmapData,
  getHeatmapColor,
  getHeatmapOpacity,
  type HeatmapData
} from "@/shared/utils/heatmapService";
import { Target, Trophy, TrendingUp } from "lucide-react";

interface PredictionHeatmapProps {
  homeTeam: {
    name: string;
    goals: number;
  };
  awayTeam: {
    name: string;
    goals: number;
  };
  className?: string;
}

const PredictionHeatmap: React.FC<PredictionHeatmapProps> = ({
  homeTeam,
  awayTeam,
  className = ""
}) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeatmapData();
  }, [homeTeam, awayTeam]);

  const loadHeatmapData = () => {
    try {
      setLoading(true);
      const data = generateHeatmapData(
        homeTeam.name,
        awayTeam.name,
        homeTeam.goals,
        awayTeam.goals
      );
      setHeatmapData(data);
    } catch (error) {
      console.error("Error generating heatmap data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Prediction Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Generating prediction heatmap...</p>
        </CardContent>
      </Card>
    );
  }

  if (!heatmapData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Prediction Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            Unable to generate heatmap for {homeTeam.name} vs {awayTeam.name}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Prediction Heatmap: {homeTeam.name} vs {awayTeam.name}
          </span>
          <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
            Statistical Model
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Outcome Probabilities */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {(heatmapData.homeWinProbability * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {homeTeam.name} Win
            </div>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {(heatmapData.drawProbability * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Draw
            </div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {(heatmapData.awayWinProbability * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {awayTeam.name} Win
            </div>
          </div>
        </div>

        {/* Most Likely Score */}
        <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Most Likely Score</div>
          <div className="text-2xl font-bold">
            {heatmapData.mostLikelyScore.home} - {heatmapData.mostLikelyScore.away}
          </div>
        </div>

        {/* Heatmap Visualization */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Scoreline Probabilities
          </h3>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Y-axis labels (away team goals) */}
              <div className="flex mb-1">
                <div className="w-8"></div>
                {[...Array(heatmapData.maxY + 1)].map((_, y) => (
                  <div key={y} className="w-12 text-center text-xs text-gray-500">
                    {y}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              {[...Array(heatmapData.maxX + 1)].map((_, x) => (
                <div key={x} className="flex items-center mb-1">
                  {/* X-axis label (home team goals) */}
                  <div className="w-8 text-xs text-gray-500 text-right pr-1">
                    {x}
                  </div>

                  {/* Heatmap cells */}
                  {[...Array(heatmapData.maxY + 1)].map((_, y) => {
                    const cell = heatmapData.cells.find(c => c.x === x && c.y === y);
                    return (
                      <div
                        key={y}
                        className="w-12 h-12 flex items-center justify-center text-xs font-medium border border-gray-200 dark:border-gray-700 rounded relative group"
                        style={{
                          backgroundColor: cell ? getHeatmapColor(cell.probability) : 'transparent',
                          opacity: cell ? getHeatmapOpacity(cell.confidence) : 1
                        }}
                      >
                        {cell && (
                          <>
                            <span className="text-white drop-shadow">
                              {Math.round(cell.probability * 100)}%
                            </span>
                            <div className="absolute bottom-0 right-0 text-[8px] text-white bg-black/30 rounded-tl px-1">
                              {Math.round(cell.confidence)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* X-axis label */}
              <div className="flex mt-2">
                <div className="w-8"></div>
                <div className="text-xs text-gray-500 flex items-center justify-center w-full">
                  {homeTeam.name} Goals
                </div>
              </div>
            </div>
          </div>

          {/* Y-axis label */}
          <div className="text-xs text-gray-500 text-center mt-2">
            {awayTeam.name} Goals
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
            <span>Low Probability</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 mr-1"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-1"></div>
            <span>High Probability</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionHeatmap;