import React from "react";
import { motion } from "framer-motion";

interface ConfidenceIndicatorProps {
  confidence: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ 
  confidence, 
  size = "md",
  showLabel = false
}) => {
  // Determine color based on confidence level
  const getColor = () => {
    if (confidence >= 80) return "text-green-500";
    if (confidence >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  // Determine size classes
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  // Calculate width percentage (clamp between 0 and 100)
  const widthPercentage = Math.min(100, Math.max(0, confidence));

  return (
    <div className="flex items-center">
      <div className="flex-1">
        <div className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${sizeClasses[size]}`}>
          <motion.div
            className={`rounded-full ${getColor()} ${sizeClasses[size]}`}
            initial={{ width: 0 }}
            animate={{ width: `${widthPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      {showLabel && (
        <span className={`ml-2 font-medium ${getColor()} ${textSize[size]}`}>
          {Math.round(confidence)}%
        </span>
      )}
    </div>
  );
};

export default ConfidenceIndicator;