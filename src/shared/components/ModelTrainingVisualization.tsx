import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Database, Zap, TrendingUp, Cpu, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

interface TrainingStep {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
}

interface ModelPerformance {
  name: string;
  accuracy: number;
  precision: number;
  f1Score: number;
}

interface ModelTrainingVisualizationProps {
  trainingIteration: number;
  modelPerformance: ModelPerformance[];
  className?: string;
}

const ModelTrainingVisualization: React.FC<ModelTrainingVisualizationProps> = ({
  trainingIteration,
  modelPerformance,
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTraining, setIsTraining] = useState(true);
  const [accuracyData, setAccuracyData] = useState<number[]>([75, 78, 80, 82, 83]);
  
  const trainingSteps: TrainingStep[] = [
    {
      id: 1,
      name: "Data Collection",
      description: "Gathering match statistics and historical data",
      icon: <Database className="w-5 h-5" />,
      duration: 2000
    },
    {
      id: 2,
      name: "Data Preprocessing",
      description: "Cleaning and normalizing data for training",
      icon: <Zap className="w-5 h-5" />,
      duration: 1500
    },
    {
      id: 3,
      name: "Model Training",
      description: "Training machine learning models on processed data",
      icon: <Brain className="w-5 h-5" />,
      duration: 3000
    },
    {
      id: 4,
      name: "Validation",
      description: "Testing model accuracy on validation dataset",
      icon: <Activity className="w-5 h-5" />,
      duration: 2000
    },
    {
      id: 5,
      name: "Optimization",
      description: "Fine-tuning model parameters for better performance",
      icon: <Cpu className="w-5 h-5" />,
      duration: 2500
    }
  ];

  useEffect(() => {
    if (!isTraining) return;
    
    const timer = setTimeout(() => {
      if (currentStep < trainingSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Training cycle complete
        setIsTraining(false);
        
        // Update accuracy data with new value
        const newAccuracy = Math.min(95, accuracyData[accuracyData.length - 1] + (Math.random() * 2));
        setAccuracyData(prev => [...prev.slice(1), newAccuracy]);
        
        // Reset for next cycle
        setTimeout(() => {
          setCurrentStep(0);
          setIsTraining(true);
        }, 3000);
      }
    }, trainingSteps[currentStep].duration);
    
    return () => clearTimeout(timer);
  }, [currentStep, isTraining, trainingSteps, accuracyData]);

  // Calculate overall progress
  const progress = ((currentStep + 1) / trainingSteps.length) * 100;
  
  // Get best model accuracy
  const bestAccuracy = modelPerformance.length 
    ? Math.max(...modelPerformance.map(m => m.accuracy * 100))
    : 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Brain className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <CardTitle className="text-lg">Model Training Visualization</CardTitle>
            </div>
            <div className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Cycle #{trainingIteration}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            {/* Training Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">{trainingSteps[currentStep].name}</span>
                <span className="text-gray-500 dark:text-gray-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {trainingSteps[currentStep].description}
              </p>
            </div>

            {/* Animated Training Steps */}
            <div className="grid grid-cols-5 gap-2">
              {trainingSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                    index === currentStep
                      ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                      : index < currentStep
                      ? "bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700"
                      : "bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`p-1.5 rounded-full ${
                    index === currentStep
                      ? "bg-blue-500 text-white"
                      : index < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300"
                  }`}>
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-medium mt-1 text-center">
                    {step.name.split(" ")[0]}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Accuracy Visualization */}
            <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Model Accuracy Progress
                </h3>
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                  {bestAccuracy.toFixed(1)}%
                </span>
              </div>
              
              {/* Animated Accuracy Chart */}
              <div className="h-24 relative">
                <div className="absolute inset-0 flex items-end space-x-1">
                  {accuracyData.map((value, index) => (
                    <motion.div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                      initial={{ height: 0 }}
                      animate={{ height: `${(value / 100) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <div className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t"></div>
                      <span className="text-[8px] mt-1 text-gray-500 dark:text-gray-400">
                        {value.toFixed(0)}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                <span>Cycle {trainingIteration - 4}</span>
                <span>Cycle {trainingIteration}</span>
              </div>
            </div>

            {/* Model Performance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {modelPerformance.map((model, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium truncate">{model.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${
                        model.accuracy > 0.85 ? "bg-green-500" : 
                        model.accuracy > 0.8 ? "bg-yellow-500" : "bg-red-500"
                      }`}></div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Accuracy</span>
                        <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Precision</span>
                        <span className="font-medium">{(model.precision * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">F1 Score</span>
                        <span className="font-medium">{(model.f1Score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Training Status */}
            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isTraining ? "training" : "complete"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center"
                >
                  {isTraining ? (
                    <>
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                      <span className="text-sm text-blue-700 dark:text-blue-400">
                        Training in progress...
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-green-700 dark:text-green-400">
                        Training cycle complete!
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModelTrainingVisualization;