import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "@/shared/pages/Index";
import NotFound from "@/shared/pages/NotFound";
import { ThemeProvider } from "@/shared/components/layout/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing Python environment...");

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        const increment = Math.random() * 10;
        const newProgress = Math.min(95, prev + increment);
        
        // Update loading messages based on progress
        if (newProgress > 80 && prev <= 80) {
          setLoadingMessage("Finalizing initialization...");
        } else if (newProgress > 65 && prev <= 65) {
          setLoadingMessage("Loading machine learning models...");
        } else if (newProgress > 50 && prev <= 50) {
          setLoadingMessage("Setting up TensorFlow.js...");
        } else if (newProgress > 35 && prev <= 35) {
          setLoadingMessage("Initializing Pyodide environment...");
        } else if (newProgress > 20 && prev <= 20) {
          setLoadingMessage("Preparing neural networks...");
        }
        
        return newProgress;
      });
    }, 700);

    // Add script tag for Pyodide
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
    script.async = true;
    script.onload = () => {
      // Just set loading to false, the actual initialization will happen in the service
      setLoadingProgress(100);
      setLoadingMessage("Ready! Loading application...");
      setTimeout(() => {
        setIsLoading(false);
        clearInterval(progressInterval);
      }, 500);
    };
    document.head.appendChild(script);

    return () => {
      // Clean up script tag on unmount
      clearInterval(progressInterval);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Football field pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 22px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 22px
            )`
          }}></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center max-w-2xl px-4 text-center">
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-green-300 mb-2">
              VARtificial Intelligence
            </h1>
            <p className="text-xl text-blue-200 font-medium">
              Football Match Predictor
            </p>
          </div>
          
          <div className="w-full max-w-md mb-6">
            <div className="text-lg text-blue-200 mb-4 font-medium">{loadingMessage}</div>
            <div className="w-full h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-right text-sm text-blue-300 font-medium">
              {Math.round(loadingProgress)}%
            </div>
          </div>
          
          <div className="mt-8 text-blue-300 animate-pulse">
            {loadingProgress < 100 ? 
              "This might take a few seconds on first load..." :
              "Almost there! Starting the application..."}
          </div>
          
          {/* Stats display */}
          <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-md">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-green-400">89%</div>
              <div className="text-xs text-blue-200">RF Accuracy</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-blue-400">87%</div>
              <div className="text-xs text-blue-200">LR Accuracy</div>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-2xl font-bold text-yellow-400">82%</div>
              <div className="text-xs text-blue-200">NB Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;