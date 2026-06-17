import React, { useState, useEffect } from "react";
import MainLayout from "@/shared/components/layout/MainLayout";
import { getTeams, predictMatch, getEvaluation } from "@/shared/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "@/shared/components/ui/use-toast";
import { Loader2, Trophy, AlertTriangle } from "lucide-react";

const Index: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [teamsLoading, setTeamsLoading] = useState(true);

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
      .finally(() => setTeamsLoading(false));

    getEvaluation()
      .then(setEvaluation)
      .catch(() => {});
  }, []);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) {
      toast({ title: "Select teams", description: "Please select both home and away teams" });
      return;
    }
    if (homeTeam === awayTeam) {
      toast({ title: "Invalid selection", description: "Home and away teams must be different" });
      return;
    }
    setLoading(true);
    setPrediction(null);
    try {
      const result = await predictMatch(homeTeam, awayTeam);
      setPrediction(result);
    } catch (e: any) {
      toast({ title: "Prediction failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const outcomes = prediction?.predictions || [];
  const topPrediction = outcomes[0];

  return (
    <MainLayout>
      {/* Hero */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Football Match Predictor
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Predicts Premier League match outcomes using historical form, head-to-head records,
          and rolling performance statistics. No in-match data is used.
        </p>
      </div>

      {/* Model Metrics */}
      {evaluation && (
        <Card className="mb-6 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Model Performance (Holdout: 2023-24 Season)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {(evaluation.accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {evaluation.log_loss.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500">Log Loss</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-400">
                  {(evaluation.baseline_accuracy * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Baseline</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              Baseline: always predict home win. Dataset: {evaluation.train_size + evaluation.test_size} matches.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Prediction Form */}
      <Card className="mb-6 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Select Matchup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Home Team
              </label>
              <Select value={homeTeam} onValueChange={setHomeTeam} disabled={teamsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={teamsLoading ? "Loading..." : "Select home team"} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Away Team
              </label>
              <Select value={awayTeam} onValueChange={setAwayTeam} disabled={teamsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={teamsLoading ? "Loading..." : "Select away team"} />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={handlePredict}
            disabled={loading || !homeTeam || !awayTeam}
            className="w-full"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Predict Match Outcome
          </Button>
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {prediction && topPrediction && (
        <Card className="mb-6 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Prediction: {prediction.home_team} vs {prediction.away_team}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Most Likely Outcome
                </span>
                <Badge
                  variant={topPrediction.probability > 50 ? "default" : "secondary"}
                  className={
                    topPrediction.outcome === "Home Win"
                      ? "bg-blue-600"
                      : topPrediction.outcome === "Away Win"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }
                >
                  {topPrediction.outcome} ({topPrediction.probability}%)
                </Badge>
              </div>
              <Progress value={topPrediction.probability} className="h-2" />
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                All Probabilities
              </p>
              {outcomes.map((p: any) => (
                <div key={p.outcome}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">{p.outcome}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {p.probability}%
                    </span>
                  </div>
                  <Progress
                    value={p.probability}
                    className="h-1.5"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Football is inherently unpredictable. This model achieves{" "}
                {prediction.model_accuracy ? `${(prediction.model_accuracy * 100).toFixed(1)}%` : "~53%"}{" "}
                accuracy on historical holdout data. Do not use for betting.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Info */}
      {evaluation?.feature_cols && (
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Features Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              The model uses only pre-match information. No goals, shots, or cards from the actual match are used.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.feature_cols.map((f: string) => (
                <Badge key={f} variant="secondary" className="text-xs font-normal">
                  {f}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
};

export default Index;
