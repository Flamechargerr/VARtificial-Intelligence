import React, { useState, useEffect } from "react";
import { toast } from "@/shared/components/ui/use-toast";
import MainLayout from "@/shared/components/layout/MainLayout";
import TeamInputForm from "@/shared/components/TeamInputForm";
import PredictionResults from "@/shared/components/PredictionResults";
import { teams, teamLocations } from "@/shared/utils/data/teams";
import { getTeamPlayers } from "@/shared/utils/data/players";
import { modelPerformanceData } from "@/shared/utils/data/models";
import { teamFormations, teamRankings } from "@/shared/utils/constants/teamData";
import { type Team, type MatchPrediction, type Player } from "@/shared/utils/types";
import { mlService } from "@/features/services/MLService";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Target, Zap, Trophy } from "lucide-react";
import MatchStatsCard from "@/shared/components/MatchStatsCard";
import { matchHistoryService } from "@/shared/utils/matchHistory";
import TeamComparison from "@/shared/components/TeamComparison";
import TeamInputSkeleton from "@/shared/components/TeamInputSkeleton";
import PredictionResultsSkeleton from "@/shared/components/PredictionResultsSkeleton";
import TeamComparisonSkeleton from "@/shared/components/TeamComparisonSkeleton";
import TeamPerformanceComparison from "@/shared/components/TeamPerformanceComparison";
import PredictionAccuracyStats from "@/shared/components/PredictionAccuracyStats";
import HeadToHeadStats from "@/shared/components/HeadToHeadStats";
import WeatherImpact from "@/shared/components/WeatherImpact";
import TeamMomentum from "@/shared/components/TeamMomentum";
import TeamRankingVisualization from "@/shared/components/TeamRankingVisualization";

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
    shots: "",
    shotsOnTarget: "",
    redCards: "",
  });

  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const [trainingIteration, setTrainingIteration] = useState(0);
  const [trainingProgress, setTrainingProgress] = useState(0);

  useEffect(() => {
    if (homeTeam.name) {
      setHomePlayers(getTeamPlayers(homeTeam.name));
    }
  }, [homeTeam.name]);

  useEffect(() => {
    if (awayTeam.name) {
      setAwayPlayers(getTeamPlayers(awayTeam.name));
    }
  }, [awayTeam.name]);

  useEffect(() => {
    const trainingInterval = setInterval(() => {
      setTrainingIteration(prev => prev + 1);
      // Make progress more visually interesting by making it cycle
      setTrainingProgress(prev => (prev + 33) % 100);
      mlService.improveModels();
    }, 30000);

    return () => clearInterval(trainingInterval);
  }, []);

  const handlePredict = async () => {
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
      
      // Save to match history
      if (mlPredictions.length > 0) {
        const bestPrediction = mlPredictions.reduce((prev, current) => 
          (prev.confidence > current.confidence) ? prev : current
        );
        
        matchHistoryService.saveMatch({
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
          homeGoals: parseInt(homeTeam.goals) || 0,
          awayGoals: parseInt(awayTeam.goals) || 0,
          prediction: bestPrediction.outcome,
          confidence: bestPrediction.confidence
        });
      }
      
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

  // Calculate shot efficiency
  const calculateShotEfficiency = (shots: string, shotsOnTarget: string) => {
    if (!shots || !shotsOnTarget || parseInt(shots) === 0) return 0;
    return (parseInt(shotsOnTarget) / parseInt(shots)) * 100;
  };

  // Get location for weather data
  const getLocationForTeam = (teamName: string): string => {
    return teamLocations[teamName] || `${teamName} Stadium`;
  };

  return (
    <MainLayout
      trainingIteration={trainingIteration}
      trainingProgress={trainingProgress}
      showAdvancedView={showAdvancedView}
      onToggleView={() => setShowAdvancedView(!showAdvancedView)}
    >
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 md:mb-12"
      >
        <Badge className="mb-3 md:mb-4 bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-xs md:text-sm py-1 px-3">
          AI-Powered Predictions
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-3 md:mb-4">
          Football Match Predictor
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-xl md:max-w-2xl mx-auto px-4">
          Enter match statistics to predict the final result with advanced machine learning models. 
          Our system analyzes team performance, player data, and historical patterns to provide accurate predictions.
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center text-blue-600 dark:text-blue-400 text-sm md:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">3</div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">ML Algorithms</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center text-green-600 dark:text-green-400 text-sm md:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300">89%</div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Highest Model</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 md:pb-4">
            <CardTitle className="flex items-center text-purple-600 dark:text-purple-400 text-sm md:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 mr-1.5 md:mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l-1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-300">10K+</div>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Matches Analyzed</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Match Stats Overview */}
      {homeTeam.name && awayTeam.name && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
        >
          <MatchStatsCard
            title="Shots"
            homeValue={homeTeam.shots || 0}
            awayValue={awayTeam.shots || 0}
            homeLabel={homeTeam.name}
            awayLabel={awayTeam.name}
            icon={<Target className="w-3 h-3 md:w-4 md:h-4" />}
          />
          <MatchStatsCard
            title="Shot Efficiency"
            homeValue={`${calculateShotEfficiency(homeTeam.shots, homeTeam.shotsOnTarget).toFixed(1)}%`}
            awayValue={`${calculateShotEfficiency(awayTeam.shots, awayTeam.shotsOnTarget).toFixed(1)}%`}
            homeLabel={homeTeam.name}
            awayLabel={awayTeam.name}
            icon={<Zap className="w-3 h-3 md:w-4 md:h-4" />}
          />
          <MatchStatsCard
            title="Red Cards"
            homeValue={homeTeam.redCards || 0}
            awayValue={awayTeam.redCards || 0}
            homeLabel={homeTeam.name}
            awayLabel={awayTeam.name}
            icon={<Trophy className="w-3 h-3 md:w-4 md:h-4" />}
          />
        </motion.div>
      )}

      {/* Team Momentum */}
      {homeTeam.name && awayTeam.name && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 md:mb-12"
        >
          <TeamMomentum teamName={homeTeam.name} />
          <TeamMomentum teamName={awayTeam.name} />
        </motion.div>
      )}

      {/* Weather Impact */}
      {homeTeam.name && awayTeam.name && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <WeatherImpact 
            location={getLocationForTeam(homeTeam.name)}
            homeTeam={homeTeam.name}
            awayTeam={awayTeam.name}
          />
        </motion.div>
      )}

      {/* Head-to-Head Stats */}
      {homeTeam.name && awayTeam.name && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <HeadToHeadStats 
            homeTeam={homeTeam.name} 
            awayTeam={awayTeam.name} 
          />
        </motion.div>
      )}

      {/* Team Comparison */}
      {homeTeam.name && awayTeam.name && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <TeamComparison
            homeTeam={{
              name: homeTeam.name,
              goals: parseInt(homeTeam.goals) || 0,
              shots: parseInt(homeTeam.shots) || 0,
              shotsOnTarget: parseInt(homeTeam.shotsOnTarget) || 0,
              redCards: parseInt(homeTeam.redCards) || 0,
              wins: 12,
              draws: 6,
              losses: 4
            }}
            awayTeam={{
              name: awayTeam.name,
              goals: parseInt(awayTeam.goals) || 0,
              shots: parseInt(awayTeam.shots) || 0,
              shotsOnTarget: parseInt(awayTeam.shotsOnTarget) || 0,
              redCards: parseInt(awayTeam.redCards) || 0,
              wins: 10,
              draws: 8,
              losses: 6
            }}
          />
        </motion.div>
      )}

      {/* Team Ranking Visualization */}
      {homeTeam.name && awayTeam.name && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <TeamRankingVisualization 
            selectedTeam={homeTeam.name} 
            showTopTeams={8}
          />
        </motion.div>
      )}

      {/* Team Performance Comparison */}
      {homeTeam.name && awayTeam.name && !isLoading && showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <TeamPerformanceComparison
            homeTeam={homeTeam}
            awayTeam={awayTeam}
          />
        </motion.div>
      )}

      {/* Team Comparison Skeleton */}
      {homeTeam.name && awayTeam.name && isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 md:mb-12"
        >
          <TeamComparisonSkeleton />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        {isLoading ? <TeamInputSkeleton /> : (
          <TeamInputForm
            homeTeam={homeTeam}
            setHomeTeam={setHomeTeam}
            awayTeam={awayTeam}
            setAwayTeam={setAwayTeam}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
            showAdvancedView={showAdvancedView}
            teamFormations={teamFormations}
            teamRankings={teamRankings}
            isLoading={isLoading}
            onPredict={handlePredict}
            teams={teams}
          />
        )}
      </motion.div>

      {isLoading && showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          id="results"
        >
          <PredictionResultsSkeleton />
        </motion.div>
      )}

      {!isLoading && showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          id="results"
          className="space-y-8 md:space-y-12"
        >
          {/* Prediction Accuracy Statistics */}
          <PredictionAccuracyStats />
          
          {/* Prediction Results */}
          <PredictionResults
            predictions={predictions}
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            modelPerformanceData={modelPerformanceData}
          />
        </motion.div>
      )}
    </MainLayout>
  );
};

export default Index;