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
import { Loader2, Trophy, TrendingUp, Shield, AlertTriangle, Activity, Zap } from "lucide-react";

const teamColors: Record<string, string> = {
  "Arsenal": "#EF0107",
  "Aston Villa": "#95BFE5",
  "Bournemouth": "#DA291C",
  "Brentford": "#E30613",
  "Brighton": "#0057B8",
  "Burnley": "#6C1D45",
  "Cardiff": "#0070B5",
  "Chelsea": "#034694",
  "Crystal Palace": "#1B458F",
  "Everton": "#003399",
  "Fulham": "#FFFFFF",
  "Huddersfield": "#0E63AD",
  "Hull": "#F5A623",
  "Ipswich": "#3A64A3",
  "Leeds": "#FFFFFF",
  "Leicester": "#003090",
  "Liverpool": "#C8102E",
  "Luton": "#F78F1E",
  "Man City": "#6CABDD",
  "Man United": "#DA291C",
  "Middlesbrough": "#E21A23",
  "Newcastle": "#241F20",
  "Norwich": "#FFF200",
  "Nott'm Forest": "#DD0000",
  "Sheffield United": "#EE2737",
  "Southampton": "#D71920",
  "Stoke": "#E03A3E",
  "Sunderland": "#EB172B",
  "Swansea": "#FFFFFF",
  "Tottenham": "#132257",
  "Watford": "#FBEE23",
  "West Brom": "#091453",
  "West Ham": "#7A263A",
  "Wolves": "#FDB913",
};

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
  const top = outcomes[0];
  const homeColor = teamColors[homeTeam] || "#10b981";
  const awayColor = teamColors[awayTeam] || "#ef4444";

  return (
    <MainLayout>
      {/* Hero */}
      <div className="text-center mb-10 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Live Model • 55.4% Holdout Accuracy</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          Match Predictor
        </h1>
        <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
          Predicts Premier League outcomes using rolling form, Elo ratings, head-to-head history, and team performance stats. No in-match data.
        </p>
      </div>

      {/* Model Stats Bar */}
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

          {/* VS Divider */}
          {homeTeam && awayTeam && (
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: homeColor }} />
                <span className="text-sm font-semibold text-white">{homeTeam}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white/60">VS</div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">{awayTeam}</span>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: awayColor }} />
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

      {/* Prediction Results */}
      {prediction && top && (
        <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
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
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-semibold">
                  {top.outcome}
                </Badge>
              </div>

              {/* Probability Bars */}
              <div className="space-y-4">
                {outcomes.map((p: any) => {
                  const isTop = p.outcome === top.outcome;
                  const color = p.outcome === "Home Win" ? homeColor : p.outcome === "Away Win" ? awayColor : "#f59e0b";
                  return (
                    <div key={p.outcome}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className={`text-sm font-medium ${isTop ? "text-white" : "text-white/60"}`}>
                            {p.outcome}
                          </span>
                        </div>
                        <span className={`text-sm font-bold tabular-nums ${isTop ? "text-white" : "text-white/60"}`}>
                          {p.probability}%
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${p.probability}%`,
                            backgroundColor: color,
                            boxShadow: isTop ? `0 0 12px ${color}40` : "none",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator className="my-5 bg-white/10" />

              {/* Disclaimer */}
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-white/5">
                <AlertTriangle className="w-4 h-4 text-yellow-500/80 mt-0.5 shrink-0" />
                <p className="text-xs text-white/40 leading-relaxed">
                  Model accuracy: {prediction.model_accuracy ? `${(prediction.model_accuracy * 100).toFixed(1)}%` : "55.4%"} on historical holdout data. Football is inherently unpredictable — do not use for betting.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Feature Showcase */}
      {evaluation?.feature_cols && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white/70 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400/70" />
              Model Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-white/40 mb-3 leading-relaxed">
              Uses only pre-match information. No goals, shots, or cards from the actual match are used as inputs.
            </p>
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

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-xl p-4 text-center hover:bg-white/10 transition-colors duration-300">
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 mb-2 ${color}`}>
        {icon}
      </div>
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
      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {value && (
          <div className="w-8 h-8 rounded-full shrink-0 border-2 border-white/20 shadow-lg" style={{ backgroundColor: color }} />
        )}
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
