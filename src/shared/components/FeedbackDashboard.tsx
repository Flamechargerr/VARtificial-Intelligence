import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { 
  getFeedbackStats, 
  getAllFeedback,
  getFeedbackColor,
  getFeedbackBadgeColor,
  type FeedbackStats,
  type PredictionFeedback
} from "@/shared/utils/userFeedbackService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, MessageSquare } from "lucide-react";

const FeedbackDashboard: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [feedbackList, setFeedbackList] = useState<PredictionFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbackData();
  }, []);

  const loadFeedbackData = () => {
    try {
      setLoading(true);
      const feedbackStats = getFeedbackStats();
      const allFeedback = getAllFeedback();
      setStats(feedbackStats);
      setFeedbackList(allFeedback);
    } catch (error) {
      console.error("Error loading feedback data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading feedback data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Feedback Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            No feedback data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts
  const feedbackChartData = [
    { name: 'Correct', value: stats.correctPredictions },
    { name: 'Partially Correct', value: stats.partiallyCorrect },
    { name: 'Incorrect', value: stats.incorrectPredictions }
  ];

  const modelAccuracyData = Object.entries(stats.feedbackByModel).map(([modelName, data]) => ({
    name: modelName,
    accuracy: data.accuracyRate
  }));

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Feedback Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Statistics */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Overall Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalFeedback}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Feedback
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.correctPredictions}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Correct
              </div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.partiallyCorrect}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Partially Correct
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.incorrectPredictions}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Incorrect
              </div>
            </div>
          </div>
        </div>

        {/* Accuracy Rate */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Accuracy Rate</h3>
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Accuracy</span>
              <Badge variant="default" className="text-sm">
                {stats.accuracyRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={stats.accuracyRate} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Feedback Distribution Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Feedback Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedbackChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {feedbackChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.name === 'Correct' ? '#10B981' : 
                        entry.name === 'Partially Correct' ? '#F59E0B' : 
                        '#EF4444'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Accuracy Comparison */}
        {modelAccuracyData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Model Accuracy Comparison</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelAccuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Accuracy']} />
                  <Bar dataKey="accuracy" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Feedback */}
        {feedbackList.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {feedbackList.slice(0, 5).map((feedback) => (
                <div 
                  key={feedback.id} 
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        {feedback.match.homeTeam} vs {feedback.match.awayTeam}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {feedback.modelName} - {feedback.predictedOutcome}
                      </div>
                    </div>
                    <Badge className={getFeedbackBadgeColor(feedback.feedback)}>
                      {feedback.feedback === 'correct' && 'Correct'}
                      {feedback.feedback === 'partially_correct' && 'Partially'}
                      {feedback.feedback === 'incorrect' && 'Incorrect'}
                    </Badge>
                  </div>
                  {feedback.comments && (
                    <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                      "{feedback.comments}"
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {new Date(feedback.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackDashboard;