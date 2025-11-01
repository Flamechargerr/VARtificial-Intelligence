import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Goal, User, Clock, Trophy, AlertTriangle, RotateCcw } from "lucide-react";
import { matchUpdateService, type MatchState, type MatchEvent } from "@/shared/services/MatchUpdateService";

interface InteractiveMatchTimelineProps {
  homeTeam: string;
  awayTeam: string;
  className?: string;
}

const InteractiveMatchTimeline: React.FC<InteractiveMatchTimelineProps> = ({ 
  homeTeam, 
  awayTeam,
  className = ""
}) => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MatchEvent | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x speed

  useEffect(() => {
    // Start the match simulation when component mounts
    matchUpdateService.startMatch(homeTeam, awayTeam);
    
    // Subscribe to match updates
    const unsubscribe = matchUpdateService.subscribe((state) => {
      setMatchState(state);
    });

    // Clean up subscription and stop match when component unmounts
    return () => {
      unsubscribe();
      matchUpdateService.stopMatch();
    };
  }, [homeTeam, awayTeam]);

  // Restart the match
  const restartMatch = () => {
    matchUpdateService.stopMatch();
    setTimeout(() => {
      matchUpdateService.startMatch(homeTeam, awayTeam);
    }, 500);
    setSelectedEvent(null);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, we would control the simulation speed here
  };

  // Get icon for event type
  const getEventIcon = (eventType: MatchEvent['type']) => {
    switch (eventType) {
      case 'goal':
        return <Goal className="w-4 h-4" />;
      case 'yellow_card':
        return <AlertTriangle className="w-4 h-4" />;
      case 'red_card':
        return <AlertTriangle className="w-4 h-4" />;
      case 'substitution':
        return <User className="w-4 h-4" />;
      case 'half_time':
        return <Clock className="w-4 h-4" />;
      case 'full_time':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Get color for event type
  const getEventColor = (eventType: MatchEvent['type']) => {
    switch (eventType) {
      case 'goal':
        return "bg-green-500 text-white";
      case 'yellow_card':
        return "bg-yellow-500 text-white";
      case 'red_card':
        return "bg-red-500 text-white";
      case 'substitution':
        return "bg-blue-500 text-white";
      case 'half_time':
        return "bg-purple-500 text-white";
      case 'full_time':
        return "bg-indigo-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Get team color
  const getTeamColor = (team: string) => {
    if (team === homeTeam) {
      return "text-blue-600 dark:text-blue-400";
    } else if (team === awayTeam) {
      return "text-red-600 dark:text-red-400";
    }
    return "text-gray-600 dark:text-gray-400";
  };

  if (!matchState) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Interactive Match Timeline</span>
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Initializing match simulation...</p>
        </CardContent>
      </Card>
    );
  }

  // Sort events by minute
  const sortedEvents = [...matchState.events].sort((a, b) => a.minute - b.minute);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Interactive Match Timeline
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={matchState.isLive ? "default" : "secondary"}>
              {matchState.isLive ? "LIVE" : "ENDED"}
            </Badge>
            <button
              onClick={restartMatch}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Restart match"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Match Header */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className={`font-bold ${getTeamColor(homeTeam)}`}>{matchState.homeTeam}</div>
            <div className="text-3xl font-bold mt-1">{matchState.homeScore}</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">VS</div>
            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">{matchState.currentMinute}'</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minute</div>
          </div>
          
          <div className="text-center">
            <div className={`font-bold ${getTeamColor(awayTeam)}`}>{matchState.awayTeam}</div>
            <div className="text-3xl font-bold mt-1">{matchState.awayScore}</div>
          </div>
        </div>

        {/* Timeline Controls */}
        <div className="flex items-center justify-between mb-4 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              {isPlaying ? (
                <div className="w-4 h-4 flex items-center justify-center">⏸</div>
              ) : (
                <div className="w-4 h-4 flex items-center justify-center">▶</div>
              )}
            </button>
            <div className="text-sm">
              Speed: {speed}x
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {sortedEvents.length} events
          </div>
        </div>

        {/* Interactive Timeline */}
        <div className="relative mb-6">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
          
          {/* Timeline Events */}
          <div className="space-y-4 pl-10 pr-4">
            {sortedEvents.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No events yet</p>
                <p className="text-sm mt-1">Match events will appear here as they happen</p>
              </div>
            ) : (
              sortedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative group ${selectedEvent?.id === event.id ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-8 top-3 w-6 h-6 rounded-full flex items-center justify-center z-10">
                    <div className={`w-4 h-4 rounded-full ${getEventColor(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                  </div>
                  
                  {/* Event Card */}
                  <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-sm">{event.description}</div>
                        {event.player && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {event.player}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs py-0.5 px-2"
                        >
                          {event.minute}'
                        </Badge>
                        <div className={`text-xs font-medium ${getTeamColor(event.team)}`}>
                          {event.team}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Selected Event Details */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <h3 className="font-semibold mb-2">Event Details</h3>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${getEventColor(selectedEvent.type)}`}>
                      {getEventIcon(selectedEvent.type)}
                    </div>
                    <span className="font-medium">{selectedEvent.type.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="outline">{selectedEvent.minute}'</Badge>
                </div>
                <p className="text-sm mb-2">{selectedEvent.description}</p>
                {selectedEvent.player && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Player: {selectedEvent.player}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Team: <span className={getTeamColor(selectedEvent.team)}>{selectedEvent.team}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Time: {selectedEvent.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default InteractiveMatchTimeline;