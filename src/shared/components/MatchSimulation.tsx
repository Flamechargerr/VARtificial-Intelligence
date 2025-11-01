import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { 
  simulateMatch, 
  type MatchSimulationResult,
  type SimulationEvent 
} from "@/shared/utils/matchSimulationService";
import { Play, Pause, RotateCcw, Trophy, Target, Shield } from "lucide-react";

interface MatchSimulationProps {
  homeTeam: {
    name: string;
    goals: number;
    shots: number;
    shotsOnTarget: number;
    redCards: number;
  };
  awayTeam: {
    name: string;
    goals: number;
    shots: number;
    shotsOnTarget: number;
    redCards: number;
  };
  className?: string;
  onSimulationComplete?: (result: MatchSimulationResult) => void;
}

const MatchSimulation: React.FC<MatchSimulationProps> = ({ 
  homeTeam,
  awayTeam,
  className = "",
  onSimulationComplete
}) => {
  const [simulationResult, setSimulationResult] = useState<MatchSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [liveScore, setLiveScore] = useState({ home: 0, away: 0 });

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCurrentEventIndex(0);
    setLiveScore({ home: 0, away: 0 });
    
    // Simulate the match
    const result = simulateMatch(homeTeam, awayTeam);
    setSimulationResult(result);
    
    if (onSimulationComplete) {
      onSimulationComplete(result);
    }
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setSimulationResult(null);
    setCurrentEventIndex(0);
    setLiveScore({ home: 0, away: 0 });
  };

  // Process events as they happen
  useEffect(() => {
    if (!isSimulating || !simulationResult) return;
    
    if (currentEventIndex < simulationResult.events.length) {
      const event = simulationResult.events[currentEventIndex];
      setLiveScore(event.score);
      
      const timer = setTimeout(() => {
        setCurrentEventIndex(prev => prev + 1);
      }, 1000); // Show each event for 1 second
      
      return () => clearTimeout(timer);
    } else if (currentEventIndex === simulationResult.events.length) {
      // Simulation complete
      setTimeout(() => {
        setIsSimulating(false);
      }, 1000);
    }
  }, [isSimulating, simulationResult, currentEventIndex]);

  if (!simulationResult) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Trophy className="mr-2 h-5 w-5" />
              Match Simulation
            </span>
            <Button 
              onClick={handleStartSimulation} 
              disabled={isSimulating}
              className="flex items-center"
            >
              <Play className="mr-2 h-4 w-4" />
              Simulate Match
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl font-bold mb-4">
              {homeTeam.name} vs {awayTeam.name}
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Click "Simulate Match" to run a simulation of this match based on team statistics.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentEvent = simulationResult.events[currentEventIndex - 1];
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Match Simulation
          </span>
          <div className="flex space-x-2">
            {isSimulating ? (
              <Button 
                onClick={() => setIsSimulating(false)} 
                variant="outline"
                className="flex items-center"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            ) : (
              <Button 
                onClick={handleStartSimulation} 
                disabled={isSimulating}
                className="flex items-center"
              >
                <Play className="mr-2 h-4 w-4" />
                Re-run
              </Button>
            )}
            <Button 
              onClick={handleResetSimulation} 
              variant="outline"
              className="flex items-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Live Score */}
        <div className="text-center py-4">
          <div className="text-5xl font-bold mb-2">
            <span className={liveScore.home > liveScore.away ? "text-green-600" : ""}>
              {liveScore.home}
            </span>
            <span className="mx-4">-</span>
            <span className={liveScore.away > liveScore.home ? "text-green-600" : ""}>
              {liveScore.away}
            </span>
          </div>
          <div className="text-xl">
            {homeTeam.name} vs {awayTeam.name}
          </div>
        </div>

        {/* Current Event */}
        {currentEvent && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="font-medium">
                {currentEvent.minute}' - {currentEvent.description}
              </div>
              <Badge variant="secondary">
                {currentEvent.eventType.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        )}

        {/* Final Result */}
        {!isSimulating && currentEventIndex > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-center">
              <div className="font-bold text-lg mb-2">Final Result</div>
              <div className="text-3xl font-bold">
                {simulationResult.finalScore.home} - {simulationResult.finalScore.away}
              </div>
              <div className="mt-2">
                {simulationResult.result === 'home_win' && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {homeTeam.name} Wins
                  </Badge>
                )}
                {simulationResult.result === 'away_win' && (
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {awayTeam.name} Wins
                  </Badge>
                )}
                {simulationResult.result === 'draw' && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    Match Drawn
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Match Statistics */}
        {simulationResult && !isSimulating && (
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Target className="mr-2 h-5 w-5" />
              Match Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-medium mb-2">{homeTeam.name}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Shots:</span>
                    <span>{simulationResult.matchStats.home.shots} ({simulationResult.matchStats.home.shotsOnTarget} on target)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Possession:</span>
                    <span>{simulationResult.matchStats.home.possession}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Corners:</span>
                    <span>{simulationResult.matchStats.home.corners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fouls:</span>
                    <span>{simulationResult.matchStats.home.fouls}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="font-medium mb-2">{awayTeam.name}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Shots:</span>
                    <span>{simulationResult.matchStats.away.shots} ({simulationResult.matchStats.away.shotsOnTarget} on target)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Possession:</span>
                    <span>{simulationResult.matchStats.away.possession}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Corners:</span>
                    <span>{simulationResult.matchStats.away.corners}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fouls:</span>
                    <span>{simulationResult.matchStats.away.fouls}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {isSimulating && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ 
                width: `${(currentEventIndex / Math.max(1, simulationResult.events.length)) * 100}%` 
              }}
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchSimulation;