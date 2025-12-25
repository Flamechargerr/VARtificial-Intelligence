import React from "react";
import { Brain, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface TrainingCycleIndicatorProps {
  iteration: number;
  progress: number;
  onClick?: () => void;
}

/**
 * Model Status Indicator
 * 
 * Displays the current status of the ML models.
 * Replaced the "training cycle" animation with a simple status indicator
 * to avoid misleading users about continuous model retraining.
 */
const TrainingCycleIndicator: React.FC<TrainingCycleIndicatorProps> = ({
  iteration,
  progress,
  onClick,
}) => {
  return (
    <div
      className="relative group"
      onClick={onClick}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg px-3 py-1.5 cursor-pointer shadow-md transition-all duration-300"
      >
        <Brain className="w-4 h-4 mr-2 text-blue-400" />
        <span className="text-xs font-medium text-slate-200">
          Model Ready
        </span>
        <Activity className="w-3 h-3 ml-2 text-green-400" />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        className="absolute z-50 -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  w-72 bg-slate-900 text-slate-200 rounded-lg shadow-xl p-4 pointer-events-none"
      >
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                       w-3 h-3 bg-slate-900 rotate-45"></div>

        <div className="flex items-center mb-3">
          <Brain className="w-5 h-5 text-blue-400 mr-2" />
          <h4 className="font-semibold text-sm">Ensemble Model Status</h4>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1 border-b border-slate-700">
            <span className="text-slate-400">Naive Bayes</span>
            <span className="text-green-400 font-medium">Ready</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-700">
            <span className="text-slate-400">Random Forest</span>
            <span className="text-green-400 font-medium">Ready</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-700">
            <span className="text-slate-400">Logistic Regression</span>
            <span className="text-green-400 font-medium">Ready</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 mt-3">
          Models trained on Premier League 2022-23 match data.
          Predictions are made using in-browser inference via Pyodide.
        </p>
      </motion.div>
    </div>
  );
};

export default TrainingCycleIndicator;