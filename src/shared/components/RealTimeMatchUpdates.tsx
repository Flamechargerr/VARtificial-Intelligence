import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { matchUpdateService, type MatchState, type MatchEvent } from "../services/MatchUpdateService";
import { Goal, User, Clock, Trophy } from "lucide-react";

interface RealTimeMatchUpdatesProps {
  homeTeam: string;
  awayTeam: string;
}

const RealTimeMatchUpdates: React.FC<RealTimeMatchUpdatesProps> = ({ homeTeam, awayTeam }) => {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Start the match simulation when component mounts
    matchUpdateService.startMatch(homeTeam, awayTeam);
    setIsSubscribed(true);

    // Subscribe to match updates
    const unsubscribe = matchUpdateService.subscribe((state) => {
      setMatchState(state);
    });

    // Clean up subscription and stop match when component unmounts
    return () => {
      unsubscribe();
      matchUpdateService.stopMatch();
      setIsSubscribed(false);
    };
  }, [homeTeam, awayTeam]);

  // Get icon for event type
  const getEventIcon = (eventType: MatchEvent['type']) => {
    switch (eventType) {
      case 'goal':
        return <Goal className="w-4 h-4 text-green-500" />;
      case 'yellow_card':
        return <div className="w-4 h-4 bg-yellow-500 rounded-sm"></div>;
      case 'red_card':
        return <div className="w-4 h-4 bg-red-500 rounded-sm"></div>;
      case 'substitution':
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get color for event type
  const getEventColor = (eventType: MatchEvent['type']) => {
    switch (eventType) {
      case 'goal':
        return "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800";
      case 'yellow_card':
        return "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800";
      case 'red_card':
        return "bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-800";
      case 'substitution':
        return "bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  if (!matchState) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Match Updates</span>
            <Badge variant="secondary">Loading...</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Initializing match simulation...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Match Updates</span>
          <Badge variant={matchState.isLive ? "default" : "secondary"}>
            {matchState.isLive ? "LIVE" : "ENDED"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Match Score */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="font-bold text-lg">{matchState.homeTeam}</div>
            <div className="text-3xl font-bold">{matchState.homeScore}</div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">VS</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{matchState.currentMinute}'</div>
          </div>
          
          <div className="text-center">
            <div className="font-bold text-lg">{matchState.awayTeam}</div>
            <div className="text-3xl font-bold">{matchState.awayScore}</div>
          </div>
        </div>

        {/* Match Events */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 flex items-center">
            <Trophy className="w-4 h-4 mr-2" />
            Recent Events
          </h3>
          
          {matchState.events.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm">
              {matchState.isLive ? "Waiting for match events..." : "No events recorded"}
            </p>
          ) : (
            <ScrollArea className="h-64 pr-4">
              <div className="space-y-3">
                <AnimatePresence>
                  {matchState.events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg border ${getEventColor(event.type)}`}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">{event.description}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{event.minute}'</span>
                          </div>
                          {event.player && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {event.player}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMatchUpdates;