import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DetailedConfidenceIndicator from "./DetailedConfidenceIndicator";
import { type MatchPrediction } from "@/utils/types";
import { BarChart3, Brain, Target, Zap } from "lucide-react";

interface PredictionConfidenceOverviewProps {
  predictions: MatchPrediction[];
  homeTeam: string;
  awayTeam: string;
}

const PredictionConfidenceOverview: React.FC<PredictionConfidenceOverviewProps> = ({ 
  predictions, 
  homeTeam, 
  awayTeam 
}) => {
  // Get icon based on model name
  const getModelIcon = (modelName: string) => {
    if (modelName.includes("Bayes")) return <Brain className="w-4 h-4" />;
    if (modelName.includes("Forest")) return <Target className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  // Find the prediction with highest confidence
  const bestPrediction = predictions.reduce((prev, current) => 
    (prev.confidence > current.confidence) ? prev : current
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Prediction Confidence Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Best Prediction Highlight */}
          <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h3 className="font-semibold text-lg mb-2">Best Prediction</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-3">
                  {getModelIcon(bestPrediction.modelName)}
                </div>
                <div>
                  <p className="font-medium">{bestPrediction.modelName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {homeTeam} vs {awayTeam}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl">{bestPrediction.outcome}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(bestPrediction.confidence)}% confidence
                </p>
              </div>
            </div>
          </div>

          {/* All Predictions */}
          <div>
            <h3 className="font-semibold mb-3">All Model Predictions</h3>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-2">
                        {getModelIcon(prediction.modelName)}
                      </div>
                      <span className="font-medium">{prediction.modelName}</span>
                    </div>
                    <span className="font-bold">{prediction.outcome}</span>
                  </div>
                  <DetailedConfidenceIndicator 
                    confidence={prediction.confidence} 
                    modelName={prediction.modelName}
                    showLabel={true}
                    size="md"
                  />
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Model Accuracy</span>
                    <span className="font-medium">
                      {Math.round(prediction.modelAccuracy * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confidence Summary */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Confidence Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {predictions.filter(p => p.confidence >= 80).length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">High Confidence</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {predictions.filter(p => p.confidence >= 60 && p.confidence < 80).length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Moderate Confidence</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {predictions.filter(p => p.confidence < 60).length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Low Confidence</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionConfidenceOverview;