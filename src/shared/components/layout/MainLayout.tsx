import React from "react";
import { Brain, Github } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main Layout Component
 * 
 * Clean, professional layout for the ML application.
 * Removed: Training cycle indicators, animated backgrounds, gimmicky elements.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-4">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-800 dark:bg-slate-700 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  VARtificial Intelligence
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ML-based Football Match Prediction
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Flamechargerr/VARtificial-Intelligence"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6 mt-12">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <strong>Tech Stack:</strong> React, TypeScript, scikit-learn, Pyodide
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              © {new Date().getFullYear()} VARtificial Intelligence
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;