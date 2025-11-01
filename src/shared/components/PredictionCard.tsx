import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import { Brain, Target, Zap, MessageSquare } from "lucide-react";
import DetailedConfidenceIndicator from "./DetailedConfidenceIndicator";
import UserFeedback from "./UserFeedback";

interface PredictionCardProps {
  id?: string;
  modelName: string;
  prediction: string;
  confidence: number;
  accuracy: number;
  match?: {
    homeTeam: string;
    awayTeam: string;
  };
  className?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  id,
  modelName,
  prediction,
  confidence,
  accuracy,
  match,
  className = "",
}) => {
  const [showFeedback, setShowFeedback] = useState(false);

  // Determine badge variant based on confidence
  const getBadgeVariant = () => {
    if (confidence > 80) return "default";
    if (confidence > 60) return "secondary";
    return "outline";
  };

  // Get icon based on model name
  const getModelIcon = () => {
    if (modelName.includes("Bayes")) return <Brain className="w-3 h-3 md:w-4 md:h-4" />;
    if (modelName.includes("Forest")) return <Target className="w-3 h-3 md:w-4 md:h-4" />;
    return <Zap className="w-3 h-3 md:w-4 md:h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`shadow-prediction ${className} transition-all duration-300 hover:shadow-2xl`}>
        <CardHeader className="pb-2 md:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-base md:text-lg">
              <div className="p-1 md:p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-1.5 md:mr-2">
                {getModelIcon()}
              </div>
              <span className="truncate">{modelName}</span>
            </CardTitle>
            <Badge variant={getBadgeVariant()} className="text-xs">
              {confidence.toFixed(0)}% Confident
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            <div>
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prediction</h3>
              <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{prediction}</p>
            </div>
            
            <div>
              <h3 className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Confidence Level
              </h3>
              <DetailedConfidenceIndicator 
                confidence={confidence} 
                modelName={modelName}
                showLabel={true}
                size="sm"
              />
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-gray-500 dark:text-gray-400">Model Accuracy</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 md:h-2 rounded-full" 
                  style={{ width: `${accuracy * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Feedback Button */}
            {id && match && (
              <div className="pt-2">
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {showFeedback ? "Hide Feedback" : "Provide Feedback"}
                </button>
                
                {showFeedback && (
                  <div className="mt-3">
                    <UserFeedback
                      predictionId={id}
                      modelName={modelName}
                      match={match}
                      predictedOutcome={prediction}
                      confidence={confidence}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PredictionCard;