import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ConfidenceBar from "@/components/ConfidenceBar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Brain, Target, Zap } from "lucide-react";

interface PredictionCardProps {
  modelName: string;
  prediction: string;
  confidence: number;
  accuracy: number;
  className?: string;
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  modelName,
  prediction,
  confidence,
  accuracy,
  className = "",
}) => {
  // Determine badge variant based on confidence
  const getBadgeVariant = () => {
    if (confidence > 80) return "default";
    if (confidence > 60) return "secondary";
    return "outline";
  };

  // Get icon based on model name
  const getModelIcon = () => {
    if (modelName.includes("Bayes")) return <Brain className="w-4 h-4" />;
    if (modelName.includes("Forest")) return <Target className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`shadow-prediction ${className} transition-all duration-300 hover:shadow-2xl`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-2">
                {getModelIcon()}
              </div>
              {modelName}
            </CardTitle>
            <Badge variant={getBadgeVariant()}>
              {confidence.toFixed(0)}% Confident
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Prediction</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{prediction}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Confidence Level
              </h3>
              <ConfidenceBar percentage={confidence} modelName={modelName} />
            </div>
            
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Model Accuracy</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {(accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full" 
                  style={{ width: `${accuracy * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PredictionCard;