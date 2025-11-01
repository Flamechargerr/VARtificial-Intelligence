import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  generatePredictionExplanation, 
  getFactorImpactColor, 
  getFactorWeightColor,
  type PredictionExplanation 
} from "@/shared/utils/predictionExplanationService";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface PredictionExplanationProps {
  modelName: string;
  outcome: string;
  confidence: number;
  homeTeamStats: { 
    name: string;
    goals: number; 
    shots: number; 
    shotsOnTarget: number; 
    redCards: number 
  };
  awayTeamStats: { 
    name: string;
    goals: number; 
    shots: number; 
    shotsOnTarget: number; 
    redCards: number 
  };
  className?: string;
}

const PredictionExplanation: React.FC<PredictionExplanationProps> = ({ 
  modelName,
  outcome,
  confidence,
  homeTeamStats,
  awayTeamStats,
  className = "" 
}) => {
  const [explanation, setExplanation] = useState<PredictionExplanation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictionExplanation();
  }, [modelName, outcome, confidence, homeTeamStats, awayTeamStats]);

  const loadPredictionExplanation = () => {
    try {
      setLoading(true);
      const explanationData = generatePredictionExplanation(
        modelName,
        outcome,
        confidence,
        { 
          goals: homeTeamStats.goals, 
          shots: homeTeamStats.shots, 
          shotsOnTarget: homeTeamStats.shotsOnTarget, 
          redCards: homeTeamStats.redCards 
        },
        { 
          goals: awayTeamStats.goals, 
          shots: awayTeamStats.shots, 
          shotsOnTarget: awayTeamStats.shotsOnTarget, 
          redCards: awayTeamStats.redCards 
        }
      );
      setExplanation(explanationData);
    } catch (error) {
      console.error("Error generating prediction explanation:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            Prediction Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Generating prediction explanation...</p>
        </CardContent>
      </Card>
    );
  }

  if (!explanation) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5" />
            Prediction Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            Unable to generate explanation for this prediction.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          Prediction Explanation: {modelName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prediction Summary */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{explanation.outcome}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Confidence: {Math.round(explanation.confidence)}%
              </div>
            </div>
            <Badge variant="default">
              {modelName}
            </Badge>
          </div>
        </div>

        {/* Key Reasoning */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Info className="w-4 h-4 mr-1" />
            Key Reasoning
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {explanation.reasoning}
          </p>
        </div>

        {/* Key Factors */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            Key Factors
          </h3>
          <div className="space-y-3">
            {explanation.keyFactors.map((factor, index) => (
              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="font-medium">{factor.name}</div>
                  <Badge 
                    variant="secondary" 
                    className={getFactorImpactColor(factor.impact)}
                  >
                    {factor.impact} impact
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {factor.description}
                </div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        factor.weight > 0 ? 'bg-green-500' : factor.weight < 0 ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${Math.abs(factor.weight) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`ml-2 text-sm font-medium ${getFactorWeightColor(factor.weight)}`}>
                    {factor.weight > 0 ? '+' : ''}{(factor.weight * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {explanation.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />
            Areas of Concern
          </h3>
          <ul className="space-y-2">
            {explanation.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-1 text-blue-500" />
            Recommendations
          </h3>
          <ul className="space-y-2">
            {explanation.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <span className="text-sm text-blue-700 dark:text-blue-300">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionExplanation;