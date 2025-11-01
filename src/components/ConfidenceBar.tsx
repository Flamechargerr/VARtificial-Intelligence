import React from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";

interface ConfidenceBarProps {
  percentage: number;
  color?: string;
  className?: string;
  modelName?: string;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ 
  percentage,
  color = "bg-primary",
  className = "",
  modelName = ""
}) => {
  // Determine the confidence level display
  const getConfidenceLevel = () => {
    if (percentage < 50) return "Low";
    if (percentage < 75) return "Medium";
    return "High";
  };

  // Get color class based on confidence level
  const getBackgroundGradient = () => {
    if (percentage < 50) {
      return "bg-gradient-to-r from-yellow-400 to-orange-500";
    } else if (percentage < 75) {
      return "bg-gradient-to-r from-blue-400 to-blue-600";
    } else {
      return "bg-gradient-to-r from-green-400 to-green-600";
    }
  };

  const confidenceLevel = getConfidenceLevel();
  const backgroundGradient = color === "bg-primary" ? getBackgroundGradient() : color;

  return (
    <div className={`prediction-confidence-bar relative h-4 rounded-full overflow-hidden bg-gray-200 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${backgroundGradient} relative`}
      >
        {percentage > 30 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-bold text-white transition-all duration-300"
          >
            {percentage.toFixed(1)}%
          </motion.span>
        )}
      </motion.div>
      <div className="flex justify-between w-full text-[10px] text-gray-600 font-medium absolute top-[-18px]">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="absolute top-[-18px] right-0 text-[10px] text-gray-600 font-medium cursor-help"
            >
              {confidenceLevel} ({percentage.toFixed(1)}%)
            </motion.span>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-white dark:bg-gray-800">
            <p className="text-xs font-bold text-gray-900 dark:text-white">{modelName || "Model"} Confidence</p>
            <p className="text-xs">Confidence level: {confidenceLevel}</p>
            <p className="text-xs">Exact confidence: {percentage.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Based on historical match data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ConfidenceBar;