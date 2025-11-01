import React from "react";
import { type MatchPrediction } from "@/shared/utils/types";
import PredictionCard from "./PredictionCard";
import StatsRadarChart from "./charts/StatsRadarChart";
import ModelPerformanceChart from "./charts/ModelPerformanceChart";
import StatisticsIcon from "./icons/StatisticsIcon";
import ChartIcon from "./icons/ChartIcon";
import PredictIcon from "./icons/PredictIcon";
import TrophyIcon from "./icons/TrophyIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import RealTimeMatchButton from "./RealTimeMatchButton";
import ExportPredictionsButton from "./ExportPredictionsButton";
import PredictionConfidenceOverview from "./PredictionConfidenceOverview";
import SharePredictionsButton from "./SharePredictionsButton";
import ConfidenceCalibration from "./ConfidenceCalibration";
import PredictionHeatmap from "./PredictionHeatmap";
import MatchSimulation from "./MatchSimulation";
import BettingOddsComparison from "./BettingOddsComparison";
import PredictionExplanation from "./PredictionExplanation";
import FeedbackDashboard from "./FeedbackDashboard";
import { Target, Trophy, DollarSign, Lightbulb } from "lucide-react";

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
    <section id="results" className="pt-6 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="p-2 md:p-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg">
              <TrophyIcon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Match Analysis & Predictions</h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                {homeTeam.name} vs {awayTeam.name}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 md:gap-3">
            <Badge className="text-base md:text-lg py-1.5 px-3 md:py-2 md:px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Best Prediction: {bestPrediction.modelName}
            </Badge>
            <div className="flex gap-1.5 md:gap-2">
              <RealTimeMatchButton homeTeam={homeTeam.name} awayTeam={awayTeam.name} />
              <ExportPredictionsButton 
                homeTeam={homeTeam.name} 
                awayTeam={awayTeam.name} 
                predictions={predictions} 
              />
              <SharePredictionsButton 
                homeTeam={homeTeam.name} 
                awayTeam={awayTeam.name} 
                predictions={predictions} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <div className="flex items-center mb-4 md:mb-6 space-x-2 md:space-x-3">
              <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <PredictIcon className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">Model Predictions</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {predictions.map((prediction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                >
                  <PredictionCard
                    id={`prediction-${index}`}
                    modelName={prediction.modelName}
                    prediction={prediction.outcome}
                    confidence={prediction.confidence}
                    accuracy={prediction.modelAccuracy}
                    match={{
                      homeTeam: homeTeam.name,
                      awayTeam: awayTeam.name
                    }}
                    className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-4 md:p-6">
                <PredictionConfidenceOverview 
                  predictions={predictions} 
                  homeTeam={homeTeam.name} 
                  awayTeam={awayTeam.name} 
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confidence Calibration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50/50 to-teal-50/50 dark:from-green-900/20 dark:to-teal-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-green-900 dark:text-green-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/50 rounded-full mr-2 md:mr-3">
                    <PredictIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  Confidence Calibration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {predictions.map((prediction, index) => (
                    <ConfidenceCalibration
                      key={index}
                      modelId={prediction.modelName.toLowerCase().replace(/\s+/g, '_')}
                      rawConfidence={prediction.confidence}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prediction Heatmap Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-orange-900 dark:text-orange-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full mr-2 md:mr-3">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  Prediction Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PredictionHeatmap
                  homeTeam={{
                    name: homeTeam.name,
                    goals: parseInt(homeTeam.goals) || 0
                  }}
                  awayTeam={{
                    name: awayTeam.name,
                    goals: parseInt(awayTeam.goals) || 0
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Match Simulation Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-purple-900 dark:text-purple-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-2 md:mr-3">
                    <Trophy className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Match Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MatchSimulation
                  homeTeam={{
                    name: homeTeam.name,
                    goals: parseInt(homeTeam.goals) || 0,
                    shots: parseInt(homeTeam.shots) || 0,
                    shotsOnTarget: parseInt(homeTeam.shotsOnTarget) || 0,
                    redCards: parseInt(homeTeam.redCards) || 0
                  }}
                  awayTeam={{
                    name: awayTeam.name,
                    goals: parseInt(awayTeam.goals) || 0,
                    shots: parseInt(awayTeam.shots) || 0,
                    shotsOnTarget: parseInt(awayTeam.shotsOnTarget) || 0,
                    redCards: parseInt(awayTeam.redCards) || 0
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Betting Odds Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-green-900 dark:text-green-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/50 rounded-full mr-2 md:mr-3">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-green-600 dark:text-green-400" />
                  </div>
                  Betting Odds Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BettingOddsComparison
                  homeTeam={homeTeam.name}
                  awayTeam={awayTeam.name}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prediction Explanations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-900/20 dark:to-amber-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-yellow-900 dark:text-yellow-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full mr-2 md:mr-3">
                    <Lightbulb className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  Prediction Explanations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predictions.map((prediction, index) => (
                    <PredictionExplanation
                      key={index}
                      modelName={prediction.modelName}
                      outcome={prediction.outcome}
                      confidence={prediction.confidence}
                      homeTeamStats={{
                        name: homeTeam.name,
                        goals: parseInt(homeTeam.goals) || 0,
                        shots: parseInt(homeTeam.shots) || 0,
                        shotsOnTarget: parseInt(homeTeam.shotsOnTarget) || 0,
                        redCards: parseInt(homeTeam.redCards) || 0
                      }}
                      awayTeamStats={{
                        name: awayTeam.name,
                        goals: parseInt(awayTeam.goals) || 0,
                        shots: parseInt(awayTeam.shots) || 0,
                        shotsOnTarget: parseInt(awayTeam.shotsOnTarget) || 0,
                        redCards: parseInt(awayTeam.redCards) || 0
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feedback Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
          <div className="lg:col-span-3">
            <FeedbackDashboard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-2 md:mr-3">
                    <StatisticsIcon className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  Match Statistics Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                {homeTeam.name && awayTeam.name && (
                  <div className="h-[250px] md:h-[350px]">
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
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center text-purple-900 dark:text-purple-100 text-lg md:text-xl">
                  <div className="p-1.5 md:p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full mr-2 md:mr-3">
                    <ChartIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  Model Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] md:h-[350px]">
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