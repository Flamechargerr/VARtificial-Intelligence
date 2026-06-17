import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "@/shared/components/layout/MainLayout";
import { getTeams, predictMatch, getEvaluation, getTeamDetails } from "@/shared/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { toast } from "@/shared/components/ui/use-toast";
import {
  Loader2, Trophy, TrendingUp, Shield, AlertTriangle, Activity, Zap,
  Swords, Target, BarChart3, Gauge, ChevronRight, ArrowUp, ArrowDown, Minus
} from "lucide-react";

const teamColors: Record<string, string> = {
  "Arsenal": "#EF0107", "Aston Villa": "#95BFE5", "Bournemouth": "#DA291C",
  "Brentford": "#E30613", "Brighton": "#0057B8", "Burnley": "#6C1D45",
  "Cardiff": "#0070B5", "Chelsea": "#034694", "Crystal Palace": "#1B458F",
  "Everton": "#003399", "Fulham": "#FFFFFF", "Huddersfield": "#0E63AD",
  "Hull": "#F5A623", "Ipswich": "#3A64A3", "Leeds": "#FFFFFF",
  "Leicester": "#003090", "Liverpool": "#C8102E", "Luton": "#F78F1E",
  "Man City": "#6CABDD", "Man United": "#DA291C", "Middlesbrough": "#E21A23",
  "Newcastle": "#241F20", "Norwich": "#FFF200", "Nott'm Forest": "#DD0000",
  "Sheffield United": "#EE2737", "Southampton": "#D71920", "Stoke": "#E03A3E",
  "Sunderland": "#EB172B", "Swansea": "#FFFFFF", "Tottenham": "#132257",
  "Watford": "#FBEE23", "West Brom": "#091453", "West Ham": "#7A263A",
  "Wolves": "#FDB913",
};

const resultColors = { W: "bg-emerald-500", D: "bg-amber-500", L: "bg-red-500" };
const resultTextColors = { W: "text-emerald-400", D: "text-amber-400", L: "text-red-400" };

interface MatchResult {
  date: string;
  home_team: string;
  away_team: string;
  home_goals: number;
  away_goals: number;
  result: string;
  team_result: string;
  venue: string;
  goals_for: number;
  goals_against: number;
}

interface TeamDetails {
  name: string;
  elo: number;
  recent_form: MatchResult[];
  rolling_stats: {
    goals_scored_5: number;
    goals_conceded_5: number;
    win_rate_5: number;
    pts_5: number;
  };
}

interface FeatureImpact {
  feature: string;
  value: number;
  weight: number;
  impact: number;
}

interface PredictionData {
  success: boolean;
  home_team: string;
  away_team: string;
  predictions: { outcome: string; probability: number }[];
  model_accuracy: number;
  feature_breakdown: FeatureImpact[];
  home_recent: MatchResult[];
  away_recent: MatchResult[];
  h2h_history: {
    date: string; home_team: string; away_team: string;
    home_goals: number; away_goals: number; result: string;
  }[];
  h2h_stats: {
    h2h_home_wins: number;
    h2h_draws: number;
    h2h_away_wins: number;
    h2h_matches: number;
  };
}

const Index: React.FC = () => {
  const [teams, setTeams] = useState<string[]>([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [homeDetails, setHomeDetails] = useState<TeamDetails | null>(null);
  const [awayDetails, setAwayDetails] = useState<TeamDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch((e) => toast({ title: "Error", description: e.message, variant: "destructive" }))
      .finally(() => setTeamsLoading(false));
    getEvaluation().then(setEvaluation).catch(() => {});
  }, []);

  // Fetch team details when teams change
  useEffect(() => {
    if (!homeTeam && !awayTeam) return;
    setDetailsLoading(true);
    Promise.all([
      homeTeam ? getTeamDetails(homeTeam) : Promise.resolve(null),
      awayTeam ? getTeamDetails(awayTeam) : Promise.resolve(null),
    ]).then(([h, a]) => {
      setHomeDetails(h);
      setAwayDetails(a);
    }).catch(() => {}).finally(() => setDetailsLoading(false));
  }, [homeTeam, awayTeam]);

  const handlePredict = async () => {
    if (!homeTeam || !awayTeam) {
      toast({ title: "Select teams", description: "Please select both teams" });
      return;
    }
    if (homeTeam === awayTeam) {
      toast({ title: "Invalid", description: "Teams must be different" });
      return;
    }
    setLoading(true);
    setPrediction(null);
    setAnimatedBars(false);
    try {
      const result = await predictMatch(homeTeam, awayTeam);
      setPrediction(result);
      setTimeout(() => setAnimatedBars(true), 100);
    } catch (e: any) {
      toast({ title: "Prediction failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const outcomes = prediction?.predictions || [];
  const top = outcomes[0];
  const homeColor = teamColors[homeTeam] || "#10b981";
  const awayColor = teamColors[awayTeam] || "#ef4444";

  const homeForm = prediction?.home_recent || homeDetails?.recent_form || [];
  const awayForm = prediction?.away_recent || awayDetails?.recent_form || [];
  const h2h = prediction?.h2h_history || [];
  const h2hStats = prediction?.h2h_stats;
  const featureBreakdown = prediction?.feature_breakdown || [];

  const homeElo = homeDetails?.elo || 1500;
  const awayElo = awayDetails?.elo || 1500;

  return (
    <MainLayout>
      {/* Hero */}
      <div className="text-center mb-8 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
            Live Model • {(evaluation?.accuracy * 100).toFixed(1)}% Holdout Accuracy
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Match Predictor</h1>
        <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
          Predicts Premier League outcomes using rolling form, Elo ratings, head-to-head history, and team performance stats.
        </p>
      </div>

      {/* Model Stats */}
      {evaluation && (
        <div className="grid grid-cols-3 gap-3 mb-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <StatCard icon={<Trophy className="w-4 h-4" />} label="Accuracy" value={`${(evaluation.accuracy * 100).toFixed(1)}%`} color="text-emerald-400" />
          <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Log Loss" value={evaluation.log_loss.toFixed(3)} color="text-blue-400" />
          <StatCard icon={<Shield className="w-4 h-4" />} label="Baseline" value={`${(evaluation.baseline_accuracy * 100).toFixed(1)}%`} color="text-white/40" />
        </div>
      )}

      {/* Prediction Form */}
      <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            Select Matchup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <TeamSelect label="Home Team" value={homeTeam} onChange={setHomeTeam} teams={teams} loading={teamsLoading} color={homeColor} />
            <TeamSelect label="Away Team" value={awayTeam} onChange={setAwayTeam} teams={teams} loading={teamsLoading} color={awayColor} />
          </div>

          {homeTeam && awayTeam && (
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg" style={{ backgroundColor: homeColor }} />
                <span className="text-sm font-bold text-white">{homeTeam}</span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white/60 border border-white/10">VS</div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{awayTeam}</span>
                <div className="w-10 h-10 rounded-full border-2 border-white/30 shadow-lg" style={{ backgroundColor: awayColor }} />
              </div>
            </div>
          )}

          <Button
            onClick={handlePredict}
            disabled={loading || !homeTeam || !awayTeam}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white border-0 shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-emerald-500/30 hover:scale-[1.02]"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Zap className="w-5 h-5 mr-2" />}
            {loading ? "Analyzing..." : "Predict Match"}
          </Button>
        </CardContent>
      </Card>

      {/* PRE-MATCH TEAM FORM CARDS (show before prediction too) */}
      {(homeTeam || awayTeam) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-slide-up">
          {homeTeam && <TeamFormCard team={homeTeam} color={homeColor} details={homeDetails} isHome={true} />}
          {awayTeam && <TeamFormCard team={awayTeam} color={awayColor} details={awayDetails} isHome={false} />}
        </div>
      )}

      {/* PREDICTION RESULTS */}
      {prediction && top && (
        <div className="space-y-6 animate-slide-up">
          {/* Main Prediction Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Prediction</h2>
                    <p className="text-xs text-white/40">{homeTeam} vs {awayTeam}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-semibold text-sm px-3 py-1">
                  {top.outcome}
                </Badge>
              </div>

              {/* Animated Probability Bars */}
              <div className="space-y-4">
                {outcomes.map((p) => {
                  const isTop = p.outcome === top.outcome;
                  const color = p.outcome === "Home Win" ? homeColor : p.outcome === "Away Win" ? awayColor : "#f59e0b";
                  return (
                    <div key={p.outcome}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                          <span className={`text-sm font-medium ${isTop ? "text-white" : "text-white/60"}`}>
                            {p.outcome}
                          </span>
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${isTop ? "text-white" : "text-white/60"}`}>
                          {p.probability}%
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1500 ease-out"
                          style={{
                            width: animatedBars ? `${p.probability}%` : "0%",
                            backgroundColor: color,
                            boxShadow: isTop ? `0 0 16px ${color}50` : "none",
                            transition: "width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-5 bg-white/10" />

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5">
                <AlertTriangle className="w-4 h-4 text-yellow-500/80 mt-0.5 shrink-0" />
                <p className="text-xs text-white/40 leading-relaxed">
                  Model accuracy: {(prediction.model_accuracy * 100).toFixed(1)}% on historical holdout data. Football is inherently unpredictable — do not use for betting.
                </p>
              </div>
            </div>
          </Card>

          {/* H2H History */}
          {h2h.length > 0 && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white/70 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-red-400/70" />
                  Head-to-Head History
                  {h2hStats && (
                    <span className="text-xs font-normal text-white/40 ml-1">
                      ({Math.round(h2hStats.h2h_home_wins * h2hStats.h2h_matches)}H
                      {Math.round(h2hStats.h2h_draws * h2hStats.h2h_matches)}D
                      {Math.round(h2hStats.h2h_away_wins * h2hStats.h2h_matches)}A)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {h2h.map((match, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-[10px] text-white/30 tabular-nums w-16 shrink-0">{match.date}</span>
                      <div className="flex-1 flex items-center justify-between gap-2">
                        <span className={`text-xs font-medium ${match.home_team === homeTeam ? "text-white" : "text-white/50"}`}>
                          {match.home_team}
                        </span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10">
                          <span className="text-xs font-bold text-white">{match.home_goals}</span>
                          <span className="text-xs text-white/30">-</span>
                          <span className="text-xs font-bold text-white">{match.away_goals}</span>
                        </div>
                        <span className={`text-xs font-medium text-right ${match.away_team === awayTeam ? "text-white" : "text-white/50"}`}>
                          {match.away_team}
                        </span>
                      </div>
                      <Badge className={`text-[10px] ${
                        match.result === "H" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                        match.result === "A" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                        "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}>
                        {match.result === "H" ? "H" : match.result === "A" ? "A" : "D"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Breakdown */}
          {featureBreakdown.length > 0 && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white/70 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400/70" />
                  Key Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-white/40 mb-3">Top factors influencing this prediction:</p>
                <div className="space-y-2">
                  {featureBreakdown.slice(0, 8).map((feat, i) => {
                    const isPositive = feat.impact > 0;
                    const isHome = feat.feature.startsWith("home_");
                    const isAway = feat.feature.startsWith("away_");
                    const teamLabel = isHome ? homeTeam : isAway ? awayTeam : "";
                    const displayName = feat.feature
                      .replace("home_", "")
                      .replace("away_", "")
                      .replace(/_/g, " ");
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[10px] text-white/30 w-5">{i + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs text-white/70">
                              {displayName}
                              {teamLabel && <span className="text-white/30"> ({teamLabel})</span>}
                            </span>
                            <span className={`text-xs font-bold tabular-nums ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                              {isPositive ? "+" : ""}{feat.impact.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${Math.min(Math.abs(feat.impact) * 50, 100)}%`,
                                backgroundColor: isPositive ? "#10b981" : "#ef4444",
                                marginLeft: isPositive ? "0" : "auto",
                                marginRight: isPositive ? "auto" : "0",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Stats Comparison */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white/70 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-400/70" />
                Stats Comparison (Last 5 Games)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <StatCompare label="Goals Scored" home={homeForm.reduce((a, m) => a + (m.goals_for || 0), 0)} away={awayForm.reduce((a, m) => a + (m.goals_for || 0), 0)} homeColor={homeColor} awayColor={awayColor} />
                <StatCompare label="Goals Conceded" home={homeForm.reduce((a, m) => a + (m.goals_against || 0), 0)} away={awayForm.reduce((a, m) => a + (m.goals_against || 0), 0)} homeColor={homeColor} awayColor={awayColor} lowerIsBetter />
                <StatCompare label="Points" home={homeForm.reduce((a, m) => a + (m.team_result === "W" ? 3 : m.team_result === "D" ? 1 : 0), 0)} away={awayForm.reduce((a, m) => a + (m.team_result === "W" ? 3 : m.team_result === "D" ? 1 : 0), 0)} homeColor={homeColor} awayColor={awayColor} />
              </div>
              <Separator className="bg-white/10 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <EloBar label={homeTeam} elo={homeElo} color={homeColor} max={Math.max(homeElo, awayElo) + 100} />
                <EloBar label={awayTeam} elo={awayElo} color={awayColor} max={Math.max(homeElo, awayElo) + 100} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features List */}
      {evaluation?.feature_cols && (
        <Card className="mt-8 border-white/10 bg-white/5 backdrop-blur-xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400/70" />
              Model Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-white/40 mb-3">Uses only pre-match information. No in-match data is used as input.</p>
            <div className="flex flex-wrap gap-1.5">
              {evaluation.feature_cols.slice(0, 16).map((f: string) => (
                <Badge key={f} variant="secondary" className="text-[10px] font-normal bg-white/5 text-white/50 border-white/10 hover:bg-white/10 transition-colors">
                  {f}
                </Badge>
              ))}
              {evaluation.feature_cols.length > 16 && (
                <Badge variant="secondary" className="text-[10px] font-normal bg-white/5 text-white/50 border-white/10">
                  +{evaluation.feature_cols.length - 16} more
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
};

/* ─── Sub-Components ─── */

function TeamFormCard({ team, color, details, isHome }: { team: string; color: string; details: TeamDetails | null; isHome: boolean }) {
  const form = details?.recent_form || [];
  const stats = details?.rolling_stats;
  const elo = details?.elo;

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 shadow-lg" style={{ backgroundColor: color }} />
            <div>
              <h3 className="text-sm font-bold text-white">{team}</h3>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">{isHome ? "Home" : "Away"}</span>
            </div>
          </div>
          {elo && (
            <div className="text-right">
              <div className="text-xs font-bold text-white">{Math.round(elo)}</div>
              <div className="text-[10px] text-white/40">Elo</div>
            </div>
          )}
        </div>

        {/* Form W-D-L */}
        <div className="flex gap-1.5 mb-3">
          {form.slice(0, 5).map((m, i) => (
            <div
              key={i}
              className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold ${resultColors[m.team_result as keyof typeof resultColors] || "bg-white/10"} text-white`}
              title={`${m.home_team} ${m.home_goals}-${m.away_goals} ${m.away_team} (${m.date})`}
            >
              {m.team_result}
            </div>
          ))}
          {form.length === 0 && <span className="text-xs text-white/30">No recent data</span>}
        </div>

        {/* Mini stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Goals" value={stats.goals_scored_5.toFixed(1)} />
            <MiniStat label="Conceded" value={stats.goals_conceded_5.toFixed(1)} />
            <MiniStat label="Win Rate" value={`${(stats.win_rate_5 * 100).toFixed(0)}%`} />
          </div>
        )}
      </div>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-1.5 rounded-md bg-white/5">
      <div className="text-xs font-bold text-white">{value}</div>
      <div className="text-[9px] text-white/40 uppercase">{label}</div>
    </div>
  );
}

function StatCompare({ label, home, away, homeColor, awayColor, lowerIsBetter }: {
  label: string; home: number; away: number; homeColor: string; awayColor: string; lowerIsBetter?: boolean;
}) {
  const homeWins = lowerIsBetter ? home < away : home > away;
  const awayWins = lowerIsBetter ? away < home : away > home;
  const total = home + away || 1;
  return (
    <div className="text-center">
      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{label}</div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-sm font-bold ${homeWins ? "text-white" : "text-white/40"}`}>{home}</span>
        <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden flex">
          <div style={{ width: `${(home / total) * 100}%`, backgroundColor: homeColor, opacity: 0.8 }} />
          <div style={{ width: `${(away / total) * 100}%`, backgroundColor: awayColor, opacity: 0.8 }} />
        </div>
        <span className={`text-sm font-bold ${awayWins ? "text-white" : "text-white/40"}`}>{away}</span>
      </div>
    </div>
  );
}

function EloBar({ label, elo, color, max }: { label: string; elo: number; color: string; max: number }) {
  const pct = (elo / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/60">{label}</span>
        <span className="text-xs font-bold text-white">{Math.round(elo)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color, opacity: 0.9 }} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors duration-300">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 mb-2 ${color}`}>{icon}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider font-medium mt-0.5">{label}</div>
    </div>
  );
}

function TeamSelect({ label, value, onChange, teams, loading, color }: {
  label: string; value: string; onChange: (v: string) => void; teams: string[]; loading: boolean; color: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">{label}</label>
      <div className="flex items-center gap-3">
        {value && <div className="w-8 h-8 rounded-full shrink-0 border-2 border-white/20 shadow-lg" style={{ backgroundColor: color }} />}
        <Select value={value} onValueChange={onChange} disabled={loading}>
          <SelectTrigger className="bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors h-11">
            <SelectValue placeholder={loading ? "Loading..." : `Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="bg-[#0f172a] border-white/10">
            {teams.map((t) => (
              <SelectItem key={t} value={t} className="text-white/80 focus:bg-white/10 focus:text-white">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: teamColors[t] || "#666" }} />
                  {t}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default Index;
