import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import { Target, Flame, Trophy, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { matchHistoryService, type PredictionStreak } from "@/shared/utils/matchHistory";

interface PredictionStreakTrackerProps {
  className?: string;
}

const PredictionStreakTracker: React.FC<PredictionStreakTrackerProps> = ({ className = "" }) => {
  const [streakData, setStreakData] = useState<PredictionStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = () => {
    try {
      const data = matchHistoryService.getStreakData();
      setStreakData(data);
    } catch (error) {
      console.error('Error loading streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate accuracy percentage
  const calculateAccuracy = () => {
    if (!streakData || streakData.totalPredictions === 0) return 0;
    return (streakData.totalCorrect / streakData.totalPredictions) * 100;
  };

  // Get streak level based on current streak
  const getStreakLevel = () => {
    if (!streakData) return "Beginner";
    
    if (streakData.currentStreak >= 10) return "Expert";
    if (streakData.currentStreak >= 5) return "Advanced";
    if (streakData.currentStreak >= 3) return "Intermediate";
    if (streakData.currentStreak >= 1) return "Novice";
    return "Beginner";
  };

  // Get streak color based on current streak
  const getStreakColor = () => {
    if (!streakData) return "text-gray-500";
    
    if (streakData.currentStreak >= 10) return "text-purple-500";
    if (streakData.currentStreak >= 5) return "text-blue-500";
    if (streakData.currentStreak >= 3) return "text-green-500";
    if (streakData.currentStreak >= 1) return "text-yellow-500";
    return "text-gray-500";
  };

  // Get streak badge variant
  const getStreakBadgeVariant = () => {
    if (!streakData) return "secondary";
    
    if (streakData.currentStreak >= 10) return "default";
    if (streakData.currentStreak >= 5) return "default";
    if (streakData.currentStreak >= 3) return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5" />
            Prediction Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading streak data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!streakData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5" />
            Prediction Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            No prediction data available. Make some predictions to start tracking your streak!
          </p>
        </CardContent>
      </Card>
    );
  }

  const accuracy = calculateAccuracy();
  const streakLevel = getStreakLevel();
  const streakColor = getStreakColor();
  const streakBadgeVariant = getStreakBadgeVariant();

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5" />
            Prediction Streak
          </CardTitle>
          <Badge variant={streakBadgeVariant} className={streakColor}>
            {streakLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Flame className={`w-8 h-8 ${streakColor} mr-2`} />
              <h3 className="text-2xl font-bold">Current Streak</h3>
            </div>
            <div className="text-5xl font-bold mb-2">
              <span className={streakColor}>{streakData.currentStreak}</span>
              <span className="text-gray-400">/{streakData.longestStreak}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current / Best streak
            </p>
          </div>

          {/* Streak Progress */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg text-center"
            >
              <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {streakData.totalPredictions}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Predictions</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg text-center"
            >
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {streakData.totalCorrect}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Correct Predictions</p>
            </motion.div>
          </div>

          {/* Accuracy */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Accuracy</h3>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
              {accuracy.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${accuracy}%` }}
              ></div>
            </div>
          </div>

          {/* Streak Achievements */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Achievements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                  <span>First Prediction</span>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-orange-500 mr-2" />
                  <span>3 in a Row</span>
                </div>
                {streakData.currentStreak >= 3 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-red-500 mr-2" />
                  <span>5 in a Row</span>
                </div>
                {streakData.currentStreak >= 5 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Flame className="w-5 h-5 text-purple-500 mr-2" />
                  <span>10 in a Row</span>
                </div>
                {streakData.currentStreak >= 10 ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Streak Tips */}
          {streakData.currentStreak > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Keep it up!</span> You're on a {streakData.currentStreak}-prediction streak. 
                Don't let it break - make your next prediction count!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionStreakTracker;