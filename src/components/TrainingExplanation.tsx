import React from "react";
import { Brain, ChartLine, Lightbulb, RefreshCw, TrendingUp, Cpu } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface TrainingExplanationProps {
  trainingIteration: number;
  modelPerformance: any[];
  className?: string;
}

const TrainingExplanation: React.FC<TrainingExplanationProps> = ({
  trainingIteration,
  modelPerformance,
  className = "",
}) => {
  // Calculate improvement over time
  const baseAccuracy = 82; // Starting accuracy percentage
  const currentBestAccuracy = modelPerformance.length 
    ? Math.max(...modelPerformance.map(m => m.accuracy * 100))
    : baseAccuracy + trainingIteration * 0.5;
  
  const improvementPercentage = currentBestAccuracy - baseAccuracy;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`overflow-hidden ${className}`}>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <Brain className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <CardTitle className="text-xl">ML Training Process</CardTitle>
              <CardDescription>
                How our models learn and improve over time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg"
            >
              <div className="p-2 bg-blue-100 rounded-full">
                <RefreshCw className="w-5 h-5 text-blue-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900">Training Cycles</h3>
                <p className="text-xs text-blue-700">
                  The system has completed {trainingIteration} training cycles
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Overall progress</span>
                    <span>Cycle {trainingIteration}/50</span>
                  </div>
                  <Progress value={Math.min(100, trainingIteration * 2)} className="h-1.5" />
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card className="p-4 border rounded-lg h-full">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-1.5 bg-indigo-100 rounded-full">
                      <ChartLine className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-semibold">Model Improvement</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Initial accuracy</span>
                        <span className="text-gray-900 font-medium">{baseAccuracy}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-gray-400 rounded-full" 
                          style={{ width: `${baseAccuracy}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Current accuracy</span>
                        <span className="text-indigo-900 font-medium">{currentBestAccuracy.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full">
                        <motion.div 
                          className="h-full bg-indigo-500 rounded-full" 
                          initial={{ width: `${baseAccuracy}%` }}
                          animate={{ width: `${currentBestAccuracy}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        ></motion.div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-600 pt-2">
                      <span className="text-green-600 font-medium">+{improvementPercentage.toFixed(1)}%</span> improvement 
                      through continuous learning
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Card className="p-4 border rounded-lg h-full">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="p-1.5 bg-amber-100 rounded-full">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-semibold">How It Works</h3>
                  </div>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="bg-amber-100 text-amber-800 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-2 mt-0.5">1</span>
                      <span>Models analyze patterns in football matches</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-amber-100 text-amber-800 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-2 mt-0.5">2</span>
                      <span>Each cycle improves pattern recognition</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-amber-100 text-amber-800 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-2 mt-0.5">3</span>
                      <span>The system gains accuracy with diminishing returns to prevent overfitting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-amber-100 text-amber-800 rounded-full w-4 h-4 flex items-center justify-center text-[10px] mr-2 mt-0.5">4</span>
                      <span>Optimal performance is reached after ~50 cycles</span>
                    </li>
                  </ul>
                </Card>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-indigo-900">Training Insights</h3>
              </div>
              <p className="text-xs text-indigo-700">
                The continuous training process allows our models to adapt to new patterns in football data, 
                improving prediction accuracy over time. Each training cycle processes additional match data 
                to refine the models' understanding of key performance indicators.
              </p>
              <div className="mt-3 flex items-center text-xs text-indigo-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Training efficiency: {Math.min(100, trainingIteration * 2).toFixed(0)}%</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TrainingExplanation;