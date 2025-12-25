import React, { useState, useEffect } from "react";
import { toast } from "@/shared/components/ui/use-toast";
import MainLayout from "@/shared/components/layout/MainLayout";
import { teams } from "@/shared/utils/data/teams";
import { modelPerformanceData } from "@/shared/utils/data/models";
import { type Team, type MatchPrediction } from "@/shared/utils/types";
import { mlService } from "@/features/services/MLService";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Brain, BarChart3, Database, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import SearchableTeamSelect from "@/shared/components/SearchableTeamSelect";
import ModelPerformanceChart from "@/shared/components/charts/ModelPerformanceChart";

/**
 * VARtificial Intelligence - Main Application
 * 
 * A machine learning project for football match outcome prediction.
 * Uses ensemble methods (Naive Bayes, Random Forest, Logistic Regression)
 * trained on Premier League 2022-23 match data.
 */
const Index = () => {
  const [homeTeam, setHomeTeam] = useState<Team>({
    name: "",
    goals: "",
    shots: "",
    shotsOnTarget: "",
    redCards: "",
  });

  const [awayTeam, setAwayTeam] = useState<Team>({
    name: "",
    goals: "",
    shotsOnTarget: "",
    shots: "",
    redCards: "",
  });

  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handlePredict = async () => {
    if (!homeTeam.name || !awayTeam.name) {
      toast({
        title: "Missing team selection",
        description: "Please select both home and away teams",
        variant: "destructive",
      });
      return;
    }

    if (homeTeam.name === awayTeam.name) {
      toast({
        title: "Invalid teams",
        description: "Home and Away teams must be different",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const mlPredictions = await mlService.predictMatch(homeTeam, awayTeam);
      setPredictions(mlPredictions);
      setShowResults(true);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 100);
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "Prediction error",
        description: "An error occurred while making predictions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      homeTeam.name &&
      homeTeam.goals !== "" &&
      homeTeam.shots &&
      homeTeam.shotsOnTarget &&
      awayTeam.name &&
      awayTeam.goals !== "" &&
      awayTeam.shots &&
      awayTeam.shotsOnTarget
    );
  };

  // Get best prediction
  const bestPrediction = predictions.length > 0
    ? predictions.reduce((prev, current) =>
      (prev.confidence > current.confidence) ? prev : current
    )
    : null;

  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <Badge className="mb-4 bg-slate-700 text-white hover:bg-slate-800">
          Machine Learning Project
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
          Football Match Predictor
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Ensemble machine learning model for predicting Premier League match outcomes.
          Trained on 95 matches from the 2022-23 season using scikit-learn.
        </p>
      </motion.div>

      {/* Model Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-12"
      >
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Model Performance (5-Fold Cross-Validation)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <Database className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                <div className="text-2xl font-bold text-slate-800 dark:text-white">95</div>
                <div className="text-xs text-slate-500">Training Matches</div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">62%</div>
                <div className="text-xs text-slate-500">Naive Bayes</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">68%</div>
                <div className="text-xs text-slate-500">Random Forest</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">65%</div>
                <div className="text-xs text-slate-500">Logistic Regression</div>
              </div>
            </div>

            {/* Chart */}
            <ModelPerformanceChart models={modelPerformanceData} />

            <p className="text-xs text-slate-500 mt-4 text-center">
              Note: Football prediction is inherently difficult. Random baseline for 3-way classification is ~33%.
              Our best model (Random Forest) achieves 68% accuracy, which is a significant improvement.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-12"
      >
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Match Statistics Input</CardTitle>
            <p className="text-sm text-slate-500">
              Enter the current match statistics to get a prediction
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Home Team */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400">Home Team</h3>
                </div>

                <SearchableTeamSelect
                  teamType="home"
                  teamName={homeTeam.name}
                  onTeamChange={(value) => setHomeTeam({ ...homeTeam, name: value })}
                  teamOptions={teams}
                  placeholder="Select home team..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="home-goals" className="text-sm">Goals</Label>
                    <Input
                      id="home-goals"
                      type="number"
                      min="0"
                      value={homeTeam.goals}
                      onChange={(e) => setHomeTeam({ ...homeTeam, goals: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="home-shots" className="text-sm">Shots</Label>
                    <Input
                      id="home-shots"
                      type="number"
                      min="0"
                      value={homeTeam.shots}
                      onChange={(e) => setHomeTeam({ ...homeTeam, shots: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="home-on-target" className="text-sm">On Target</Label>
                    <Input
                      id="home-on-target"
                      type="number"
                      min="0"
                      value={homeTeam.shotsOnTarget}
                      onChange={(e) => setHomeTeam({ ...homeTeam, shotsOnTarget: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="home-red-cards" className="text-sm">Red Cards</Label>
                    <Input
                      id="home-red-cards"
                      type="number"
                      min="0"
                      value={homeTeam.redCards}
                      onChange={(e) => setHomeTeam({ ...homeTeam, redCards: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="font-semibold text-red-700 dark:text-red-400">Away Team</h3>
                </div>

                <SearchableTeamSelect
                  teamType="away"
                  teamName={awayTeam.name}
                  onTeamChange={(value) => setAwayTeam({ ...awayTeam, name: value })}
                  teamOptions={teams}
                  placeholder="Select away team..."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="away-goals" className="text-sm">Goals</Label>
                    <Input
                      id="away-goals"
                      type="number"
                      min="0"
                      value={awayTeam.goals}
                      onChange={(e) => setAwayTeam({ ...awayTeam, goals: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="away-shots" className="text-sm">Shots</Label>
                    <Input
                      id="away-shots"
                      type="number"
                      min="0"
                      value={awayTeam.shots}
                      onChange={(e) => setAwayTeam({ ...awayTeam, shots: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="away-on-target" className="text-sm">On Target</Label>
                    <Input
                      id="away-on-target"
                      type="number"
                      min="0"
                      value={awayTeam.shotsOnTarget}
                      onChange={(e) => setAwayTeam({ ...awayTeam, shotsOnTarget: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="away-red-cards" className="text-sm">Red Cards</Label>
                    <Input
                      id="away-red-cards"
                      type="number"
                      min="0"
                      value={awayTeam.redCards}
                      onChange={(e) => setAwayTeam({ ...awayTeam, redCards: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Predict Button */}
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                onClick={handlePredict}
                disabled={isLoading || !isFormValid()}
                className="px-8 py-6 text-lg bg-slate-800 hover:bg-slate-900"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Run Prediction
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Prediction Results */}
      {showResults && predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          id="results"
          className="space-y-8"
        >
          {/* Best Prediction */}
          {bestPrediction && (
            <Card className="border-2 border-green-200 dark:border-green-800 shadow-lg">
              <CardHeader className="bg-green-50 dark:bg-green-900/20">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    Prediction Result
                  </span>
                  <Badge className="bg-green-600">{bestPrediction.modelName}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-2">
                    {homeTeam.name} vs {awayTeam.name}
                  </div>
                  <div className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
                    {bestPrediction.outcome}
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {bestPrediction.confidence.toFixed(1)}%
                      </div>
                      <div className="text-xs text-slate-500">Confidence</div>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {(bestPrediction.modelAccuracy * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-500">Model Accuracy</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Model Predictions */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                Ensemble Model Predictions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm">{prediction.modelName}</span>
                      <Badge variant="outline" className="text-xs">
                        {(prediction.modelAccuracy * 100).toFixed(0)}% acc
                      </Badge>
                    </div>
                    <div className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                      {prediction.outcome}
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                        {prediction.confidence.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Methodology Note */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Methodology:</strong> Predictions are made using an ensemble of
                    Naive Bayes, Random Forest, and Logistic Regression classifiers.
                    Features include goal difference, shot efficiency, shots on target ratio,
                    and red card impact. Models were trained on 95 Premier League 2022-23 matches
                    and validated using 5-fold cross-validation.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Index;