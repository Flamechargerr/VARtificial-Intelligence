import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] via-[#0d1f17] to-[#0a0f1a] relative">
      {/* Subtle pitch line pattern overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            hsl(142 76% 36%) 40px,
            hsl(142 76% 36%) 41px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            hsl(142 76% 36%) 40px,
            hsl(142 76% 36%) 41px
          )`
        }}
      />
      
      {/* Stadium light glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                VARtificial Intelligence
              </h1>
              <p className="text-xs text-emerald-400/80 font-medium tracking-wide uppercase">
                Premier League Match Predictor
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-md mt-16">
        <div className="max-w-5xl mx-auto px-4 py-5 text-center">
          <p className="text-xs text-white/40">
            Football is inherently unpredictable. This model achieves ~55% accuracy on historical holdout data.
          </p>
          <p className="text-xs text-white/30 mt-1">
            Not a betting system. For educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
