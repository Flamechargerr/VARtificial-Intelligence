import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import { Target, TrendingUp, CheckCircle, XCircle, BarChart3, Flame } from "lucide-react";
import { matchHistoryService, type MatchHistoryItem } from "@/shared/utils/matchHistory";
import PredictionStreakTracker from "./PredictionStreakTracker";

interface AccuracyStats {
  totalPredictions: number;
  correctPredictions: number;
  accuracyRate: number;
  modelAccuracy: number;
  confidenceAccuracy: {
    high: { correct: number; total: number; rate: number };
    medium: { correct: number; total: number; rate: number };
    low: { correct: number; total: number; rate: number };
  };
}

const PredictionAccuracyStats: React.FC = () => {
  const [accuracyStats, setAccuracyStats] = useState<AccuracyStats | null>(null);
  const [timeRange, setTimeRange] = useState<"all" | "last10" | "last30">("all");
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);

  useEffect(() => {
    const historyData = matchHistoryService.getHistory();
    setHistory(historyData);

    if (historyData.length > 0) {
      calculateAccuracyStats(historyData);
    }
  }, [timeRange]);

  const calculateAccuracyStats = (historyData: MatchHistoryItem[]) => {
    // Filter data based on time range
    let filteredData = [...historyData];
    if (timeRange === "last10") {
      filteredData = historyData.slice(0, 10);
    } else if (timeRange === "last30") {
      filteredData = historyData.slice(0, 30);
    }

    const totalPredictions = filteredData.length;
    let correctPredictions = 0;

    // Confidence-based accuracy tracking
    const confidenceStats = {
      high: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      low: { correct: 0, total: 0 }
    };

    filteredData.forEach(match => {
      if (match.actualResult) {
        // Check if prediction was correct
        if (match.prediction === match.actualResult) {
          correctPredictions++;

          // Update confidence-based stats
          if (match.confidence >= 80) {
            confidenceStats.high.correct++;
            confidenceStats.high.total++;
          } else if (match.confidence >= 60) {
            confidenceStats.medium.correct++;
            confidenceStats.medium.total++;
          } else {
            confidenceStats.low.correct++;
            confidenceStats.low.total++;
          }
        } else {
          // Update confidence-based stats for incorrect predictions
          if (match.confidence >= 80) {
            confidenceStats.high.total++;
          } else if (match.confidence >= 60) {
            confidenceStats.medium.total++;
          } else {
            confidenceStats.low.total++;
          }
        }
      }
    });

    // Calculate rates
    const accuracyRate = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

    const highConfidenceRate = confidenceStats.high.total > 0
      ? (confidenceStats.high.correct / confidenceStats.high.total) * 100
      : 0;

    const mediumConfidenceRate = confidenceStats.medium.total > 0
      ? (confidenceStats.medium.correct / confidenceStats.medium.total) * 100
      : 0;

    const lowConfidenceRate = confidenceStats.low.total > 0
      ? (confidenceStats.low.correct / confidenceStats.low.total) * 100
      : 0;

    // Use actual model accuracy instead of inflated estimate
    // Random Forest (best model) has 68% accuracy from 5-fold CV
    const modelAccuracy = 68;

    setAccuracyStats({
      totalPredictions,
      correctPredictions,
      accuracyRate,
      modelAccuracy,
      confidenceAccuracy: {
        high: {
          correct: confidenceStats.high.correct,
          total: confidenceStats.high.total,
          rate: highConfidenceRate
        },
        medium: {
          correct: confidenceStats.medium.correct,
          total: confidenceStats.medium.total,
          rate: mediumConfidenceRate
        },
        low: {
          correct: confidenceStats.low.correct,
          total: confidenceStats.low.total,
          rate: lowConfidenceRate
        }
      }
    });
  };

  if (!accuracyStats) {
    return (
      <div className="space-y-6">
        {/* Streak Tracker */}
        <PredictionStreakTracker />

        {/* Accuracy Stats */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Prediction Accuracy Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No prediction history available. Make some predictions to see accuracy statistics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Streak Tracker */}
      <PredictionStreakTracker />

      {/* Accuracy Stats */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Prediction Accuracy Statistics
            </CardTitle>
            <div className="flex space-x-2">
              <Badge
                variant={timeRange === "all" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setTimeRange("all")}
              >
                All Time
              </Badge>
              <Badge
                variant={timeRange === "last10" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setTimeRange("last10")}
              >
                Last 10
              </Badge>
              <Badge
                variant={timeRange === "last30" ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setTimeRange("last30")}
              >
                Last 30
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Accuracy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Predictions</h3>
                  <Target className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {accuracyStats.totalPredictions}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Correct Predictions</h3>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {accuracyStats.correctPredictions}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Accuracy Rate</h3>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {accuracyStats.accuracyRate.toFixed(1)}%
                </p>
              </motion.div>
            </div>

            {/* Confidence-Based Accuracy */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Confidence-Based Accuracy</h3>
              <div className="space-y-4">
                {/* High Confidence */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">High Confidence (80%+)</span>
                      <Badge variant="default" className="ml-2 text-xs">
                        {accuracyStats.confidenceAccuracy.high.correct}/{accuracyStats.confidenceAccuracy.high.total}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      {accuracyStats.confidenceAccuracy.high.rate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={accuracyStats.confidenceAccuracy.high.rate}
                    className="h-2"
                    indicatorColor="bg-green-500"
                  />
                </div>

                {/* Medium Confidence */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Medium Confidence (60-79%)</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {accuracyStats.confidenceAccuracy.medium.correct}/{accuracyStats.confidenceAccuracy.medium.total}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      {accuracyStats.confidenceAccuracy.medium.rate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={accuracyStats.confidenceAccuracy.medium.rate}
                    className="h-2"
                    indicatorColor="bg-yellow-500"
                  />
                </div>

                {/* Low Confidence */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">Low Confidence (&lt;60%)</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {accuracyStats.confidenceAccuracy.low.correct}/{accuracyStats.confidenceAccuracy.low.total}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      {accuracyStats.confidenceAccuracy.low.rate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={accuracyStats.confidenceAccuracy.low.rate}
                    className="h-2"
                    indicatorColor="bg-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Model Performance */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Model Accuracy</h3>
                <BarChart3 className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex items-center">
                <div className="w-full mr-4">
                  <Progress value={accuracyStats.modelAccuracy} className="h-2" />
                </div>
                <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                  {accuracyStats.modelAccuracy.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Based on your prediction history and current model performance
              </p>
            </div>

            {/* Recent Predictions */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Predictions</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.slice(0, 5).map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="text-sm">
                      <span className="font-medium">{match.homeTeam}</span> vs <span className="font-medium">{match.awayTeam}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={match.actualResult === match.prediction ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {match.prediction}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {match.confidence.toFixed(0)}%
                      </span>
                      {match.actualResult === match.prediction ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionAccuracyStats;