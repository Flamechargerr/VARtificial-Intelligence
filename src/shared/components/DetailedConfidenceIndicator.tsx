import React from "react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Badge } from "@/shared/components/ui/badge";
import { Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface DetailedConfidenceIndicatorProps {
  confidence: number;
  modelName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const DetailedConfidenceIndicator: React.FC<DetailedConfidenceIndicatorProps> = ({ 
  confidence, 
  modelName = "",
  showLabel = false,
  size = "md"
}) => {
  // Determine color based on confidence level
  const getColorClasses = () => {
    if (confidence >= 80) return {
      bg: "bg-green-500",
      text: "text-green-500",
      border: "border-green-500",
      badge: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    };
    if (confidence >= 60) return {
      bg: "bg-yellow-500",
      text: "text-yellow-500",
      border: "border-yellow-500",
      badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200",
      icon: <Zap className="w-4 h-4 text-yellow-500" />
    };
    return {
      bg: "bg-red-500",
      text: "text-red-500",
      border: "border-red-500",
      badge: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200",
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />
    };
  };

  // Determine size classes
  const sizeClasses = {
    sm: { height: "h-2", text: "text-xs", badge: "text-xs" },
    md: { height: "h-3", text: "text-sm", badge: "text-sm" },
    lg: { height: "h-4", text: "text-base", badge: "text-base" }
  };

  const colors = getColorClasses();
  const sizes = sizeClasses[size];

  // Calculate width percentage (clamp between 0 and 100)
  const widthPercentage = Math.min(100, Math.max(0, confidence));

  return (
    <div className="flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex-1">
              <div className={`w-full rounded-full bg-gray-200 dark:bg-gray-700 ${sizes.height}`}>
                <motion.div
                  className={`rounded-full ${colors.bg} ${sizes.height}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between w-full text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-white dark:bg-gray-800">
            <p className="text-xs font-bold text-gray-900 dark:text-white">
              {modelName || "Model"} Confidence
            </p>
            <p className="text-xs">Confidence level: {Math.round(confidence)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {confidence >= 80 
                ? "High confidence prediction" 
                : confidence >= 60 
                  ? "Moderate confidence prediction" 
                  : "Low confidence prediction"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showLabel && (
        <Badge className={`ml-2 ${colors.badge} ${sizes.badge} font-medium`}>
          {colors.icon}
          <span className="ml-1">{Math.round(confidence)}%</span>
        </Badge>
      )}
    </div>
  );
};

export default DetailedConfidenceIndicator;