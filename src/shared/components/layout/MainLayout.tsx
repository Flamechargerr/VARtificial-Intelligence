import React, { useState } from "react";
import FootballIcon from "../icons/FootballIcon";
import TrainingCycleIndicator from "../TrainingCycleIndicator";
import TrainingExplanation from "../TrainingExplanation";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
  trainingIteration?: number;
  trainingProgress?: number;
  showAdvancedView?: boolean;
  onToggleView?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  trainingIteration = 0,
  trainingProgress = 0,
  showAdvancedView = false,
  onToggleView,
}) => {
  const [showTrainingInfo, setShowTrainingInfo] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <header className="bg-gradient-to-r from-football-blue to-football-green shadow-xl py-4 md:py-6 relative overflow-hidden">
        {/* Header background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gray-200 bg-opacity-20"></div>
        </div>
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="p-2 md:p-3 bg-white/20 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-300 hover:scale-110">
                <FootballIcon className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-white">VARtificial Intelligence</h1>
                <p className="text-xs md:text-sm text-blue-100 font-medium hidden sm:block">
                  Advanced Football Match Prediction using Machine Learning
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              {trainingIteration > 0 && (
                <TrainingCycleIndicator 
                  iteration={trainingIteration} 
                  progress={trainingProgress}
                  onClick={() => setShowTrainingInfo(!showTrainingInfo)}
                />
              )}
              {onToggleView && (
                <Button 
                  variant="outline" 
                  onClick={onToggleView}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-xs md:text-sm py-1.5 px-2 md:py-2 md:px-4"
                >
                  <span className="hidden xs:block">
                    {showAdvancedView ? "Simple View" : "Advanced View"}
                  </span>
                  <span className="block xs:hidden">
                    {showAdvancedView ? "Simple" : "Advanced"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-4 md:py-8 relative z-10">
        {showTrainingInfo && trainingIteration > 0 && (
          <div className="mb-6 md:mb-8 animate-fade-down">
            <TrainingExplanation 
              trainingIteration={trainingIteration}
              modelPerformance={[
                { name: "Naive Bayes", accuracy: 0.82 + (0.001 * trainingIteration) },
                { name: "Random Forest", accuracy: 0.89 + (0.0008 * trainingIteration) },
                { name: "Logistic Regression", accuracy: 0.87 + (0.0009 * trainingIteration) }
              ]}
            />
          </div>
        )}
        {children}
      </main>

      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white border-t border-gray-700 py-6 md:py-8 mt-12 md:mt-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="flex items-center">
              <FootballIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mr-2 md:mr-3" />
              <div>
                <p className="text-gray-300 font-semibold text-sm md:text-base">
                  VARtificial Intelligence — Powered by Machine Learning
                </p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">
                  Predicting football matches with advanced analytics
                </p>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <p className="text-gray-400 text-xs md:text-sm">
                © {new Date().getFullYear()} VARtificial Intelligence
              </p>
              <div className="flex space-x-4 mt-1">
                <span className="text-xs text-gray-500 hidden sm:block">ML Models Training</span>
                <span className="text-xs text-green-400">● Live</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;