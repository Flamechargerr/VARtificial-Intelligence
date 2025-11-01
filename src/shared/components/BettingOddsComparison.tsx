import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  getBettingOdds, 
  compareOdds, 
  oddsToProbability, 
  getOddsColor,
  type BettingOdds, 
  type OddsComparison 
} from "@/shared/utils/bettingOddsService";
import { TrendingUp, DollarSign, BarChart3 } from "lucide-react";

interface BettingOddsComparisonProps {
  homeTeam: string;
  awayTeam: string;
  className?: string;
}

const BettingOddsComparison: React.FC<BettingOddsComparisonProps> = ({ 
  homeTeam,
  awayTeam,
  className = "" 
}) => {
  const [bettingOdds, setBettingOdds] = useState<BettingOdds[]>([]);
  const [oddsComparison, setOddsComparison] = useState<OddsComparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBettingOdds();
  }, [homeTeam, awayTeam]);

  const loadBettingOdds = () => {
    try {
      setLoading(true);
      const odds = getBettingOdds(homeTeam, awayTeam);
      setBettingOdds(odds);
      
      if (odds.length > 0) {
        const comparison = compareOdds(odds);
        setOddsComparison(comparison);
      }
    } catch (error) {
      console.error("Error loading betting odds:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Betting Odds Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading betting odds...</p>
        </CardContent>
      </Card>
    );
  }

  if (!bettingOdds || bettingOdds.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Betting Odds Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            No betting odds available for {homeTeam} vs {awayTeam}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5" />
          Betting Odds Comparison: {homeTeam} vs {awayTeam}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Best Odds Summary */}
        {oddsComparison && (
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Home Win</div>
              <div className={`text-xl font-bold ${getOddsColor(oddsComparison.homeWin.bestOdds)}`}>
                {oddsComparison.homeWin.bestOdds.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {oddsComparison.homeWin.bestBookmaker}
              </div>
              <div className="text-xs mt-1">
                <Badge variant="secondary">
                  {oddsToProbability(oddsComparison.homeWin.bestOdds)}% prob
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Draw</div>
              <div className={`text-xl font-bold ${getOddsColor(oddsComparison.draw.bestOdds)}`}>
                {oddsComparison.draw.bestOdds.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {oddsComparison.draw.bestBookmaker}
              </div>
              <div className="text-xs mt-1">
                <Badge variant="secondary">
                  {oddsToProbability(oddsComparison.draw.bestOdds)}% prob
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Away Win</div>
              <div className={`text-xl font-bold ${getOddsColor(oddsComparison.awayWin.bestOdds)}`}>
                {oddsComparison.awayWin.bestOdds.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {oddsComparison.awayWin.bestBookmaker}
              </div>
              <div className="text-xs mt-1">
                <Badge variant="secondary">
                  {oddsToProbability(oddsComparison.awayWin.bestOdds)}% prob
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Implied Probabilities */}
        {oddsComparison && (
          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              Implied Probabilities
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Home</div>
                <div className="font-medium">{oddsComparison.impliedProbabilities.homeWin}%</div>
              </div>
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Draw</div>
                <div className="font-medium">{oddsComparison.impliedProbabilities.draw}%</div>
              </div>
              <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Away</div>
                <div className="font-medium">{oddsComparison.impliedProbabilities.awayWin}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Bookmaker Comparison */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Bookmaker Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Bookmaker</th>
                  <th className="text-center py-2">Home</th>
                  <th className="text-center py-2">Draw</th>
                  <th className="text-center py-2">Away</th>
                </tr>
              </thead>
              <tbody>
                {bettingOdds.map((odds, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2">{odds.bookmaker}</td>
                    <td className={`text-center py-2 font-medium ${getOddsColor(odds.homeWin)}`}>
                      {odds.homeWin.toFixed(2)}
                    </td>
                    <td className={`text-center py-2 font-medium ${getOddsColor(odds.draw)}`}>
                      {odds.draw.toFixed(2)}
                    </td>
                    <td className={`text-center py-2 font-medium ${getOddsColor(odds.awayWin)}`}>
                      {odds.awayWin.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Value Bets Indicator */}
        {oddsComparison && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Value Bet Opportunity
              </span>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {oddsComparison.homeWin.bestBookmaker} offers the best odds for {homeTeam} at{" "}
              <span className={getOddsColor(oddsComparison.homeWin.bestOdds)}>
                {oddsComparison.homeWin.bestOdds.toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BettingOddsComparison;