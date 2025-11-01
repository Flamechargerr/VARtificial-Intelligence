import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MatchStatsCardProps {
  title: string;
  homeValue: number | string;
  awayValue: number | string;
  homeLabel: string;
  awayLabel: string;
  icon: React.ReactNode;
  className?: string;
}

const MatchStatsCard: React.FC<MatchStatsCardProps> = ({
  title,
  homeValue,
  awayValue,
  homeLabel,
  awayLabel,
  icon,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`border-0 shadow-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-gray-900 dark:text-white text-lg">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mr-2">
              {icon}
            </div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{homeValue}</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">{homeLabel}</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">{awayValue}</div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">{awayLabel}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchStatsCard;