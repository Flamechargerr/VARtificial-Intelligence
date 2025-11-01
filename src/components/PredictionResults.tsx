import React from "react";
import { type MatchPrediction } from "@/types";
import PredictionCard from "@/components/PredictionCard";
import StatsRadarChart from "@/components/StatsRadarChart";
import ModelPerformanceChart from "@/components/ModelPerformanceChart";
import StatisticsIcon from "@/components/StatisticsIcon";
import ChartIcon from "@/components/ChartIcon";
import PredictIcon from "@/components/PredictIcon";
import TrophyIcon from "@/components/TrophyIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface PredictionResultsProps {
  predictions: MatchPrediction[];
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
  modelPerformanceData: any[];
}

const PredictionResults: React.FC<PredictionResultsProps> = ({
  predictions,
  homeTeam,
  awayTeam,
  modelPerformanceData,
}) => {
  if (predictions.length === 0) {
    return null;
  }

  // Find the prediction with highest confidence
  const bestPrediction = predictions.reduce((prev, current) => 
    (prev.confidence > current.confidence) ? prev : current
  );

  return (
    <section id="results" className="pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg">
              <TrophyIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Match Analysis & Predictions</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {homeTeam.name} vs {awayTeam.name}
              </p>
            </div>
          </div>
          
          <Badge className="text-lg py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            Best Prediction: {bestPrediction.modelName}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-3">
            <div className="flex items-center mb-6 space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <PredictIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Model Predictions</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                >
                  <PredictionCard
                    modelName={prediction.modelName}
                    prediction={prediction.outcome}
                    confidence={prediction.confidence}
                    accuracy={prediction.modelAccuracy}
                    className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-900 dark:text-blue-100">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-3">
                    <StatisticsIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Match Statistics Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                {homeTeam.name && awayTeam.name && (
                  <div className="h-[350px]">
                    <StatsRadarChart
                      data={{
                        homeTeam: {
                          name: homeTeam.name,
                          goals: parseInt(homeTeam.goals),
                          shots: parseInt(homeTeam.shots),
                          shotsOnTarget: parseInt(homeTeam.shotsOnTarget),
                          redCards: parseInt(homeTeam.redCards),
                        },
                        awayTeam: {
                          name: awayTeam.name,
                          goals: parseInt(awayTeam.goals),
                          shots: parseInt(awayTeam.shots),
                          shotsOnTarget: parseInt(awayTeam.shotsOnTarget),
                          redCards: parseInt(awayTeam.redCards),
                        },
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900 dark:text-purple-100">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-3">
                    <ChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Model Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ModelPerformanceChart models={modelPerformanceData} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PredictionResults;