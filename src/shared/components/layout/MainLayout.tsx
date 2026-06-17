import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  VARtificial Intelligence
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Football match prediction using historical data
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 mt-12">
        <div className="container max-w-4xl mx-auto px-4 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>
            Football is inherently unpredictable. This model does not consistently beat bookmaker odds.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
