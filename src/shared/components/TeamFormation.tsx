import React, { useState } from "react";
import { type Player } from "@/shared/utils/types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Trophy, Hash, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import AdvancedFormationVisualization from "./AdvancedFormationVisualization";

interface TeamFormationProps {
  teamName: string;
  players: Player[];
  formation: string;
  fifaRanking?: number;
}

const TeamFormation: React.FC<TeamFormationProps> = ({
  teamName,
  players,
  formation,
  fifaRanking,
}) => {
  const [viewMode, setViewMode] = useState<"simple" | "advanced">("simple");
  const [hoveredPlayer, setHoveredPlayer] = useState<Player | null>(null);
  
  // Parse formation (e.g., "4-3-3" -> [4, 3, 3])
  const formationParts = formation.split("-").map(Number);
  
  // Group players by position
  const groupedPlayers: Record<string, Player[]> = {};
  players.forEach(player => {
    if (!groupedPlayers[player.position]) {
      groupedPlayers[player.position] = [];
    }
    groupedPlayers[player.position].push(player);
  });

  // Get players for each line
  const getPlayersForLine = (lineIndex: number) => {
    const positions = ["GK", "DEF", "MID", "FWD"];
    if (lineIndex === 0) return groupedPlayers["GK"] || [];
    return groupedPlayers[positions[lineIndex]] || [];
  };

  // Get position name based on line index
  const getPositionName = (lineIndex: number) => {
    const positions = ["Goalkeeper", "Defenders", "Midfielders", "Forwards"];
    return positions[lineIndex] || "";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{teamName}</h3>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Formation: {formation}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === "simple" ? "advanced" : "simple")}
            className="flex items-center text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full transition-colors"
          >
            <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            {viewMode === "simple" ? "Advanced" : "Simple"}
          </button>
          
          {fifaRanking && (
            <Badge variant="secondary" className="transition-all duration-300 hover:scale-105 text-xs md:text-sm py-1 px-2 md:py-1.5 md:px-3">
              <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              FIFA Ranking: #{fifaRanking}
            </Badge>
          )}
        </div>
      </div>
      
      {viewMode === "advanced" ? (
        <AdvancedFormationVisualization 
          teamName={teamName}
          players={players}
          formation={formation}
          fifaRanking={fifaRanking}
        />
      ) : (
        <>
          <div className="relative">
            {/* Football field visualization */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 md:p-6 relative overflow-hidden border-4 border-white shadow-lg">
              {/* Field markings */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 border-2 border-white/30 rounded-full"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-12 md:w-24 md:h-16 border-2 border-white/30 rounded-b-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 md:w-24 md:h-16 border-2 border-white/30 rounded-t-full"></div>
              
              {/* Formation lines */}
              <div className="space-y-6 md:space-y-8">
                {formationParts.map((count, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex justify-center space-x-2 md:space-x-4"
                  >
                    {/* Position label */}
                    <div className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                      <span className="text-white/80 text-xs font-medium">{getPositionName(index)}</span>
                    </div>
                    
                    {Array.from({ length: count }).map((_, playerIndex) => {
                      const playersInLine = getPlayersForLine(index);
                      const player = playersInLine[playerIndex];
                      
                      return (
                        <TooltipProvider key={playerIndex}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                                className="relative group cursor-pointer"
                                onMouseEnter={() => setHoveredPlayer(player || null)}
                                onMouseLeave={() => setHoveredPlayer(null)}
                              >
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl">
                                  {player ? (
                                    <span className="text-xs font-bold text-gray-800">
                                      {player.name.split(" ").map(n => n[0]).join("")}
                                    </span>
                                  ) : (
                                    <Hash className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                                  )}
                                </div>
                                {player && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                    <span className="text-[6px] md:text-[8px] font-bold text-white">
                                      {player.position.substring(0, 2)}
                                    </span>
                                  </div>
                                )}
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-gray-900 text-white text-xs md:text-sm">
                              {player ? (
                                <div className="space-y-1">
                                  <div className="font-bold">{player.name}</div>
                                  <div className="text-gray-300">{player.position}</div>
                                  {player.rating && (
                                    <div className="flex items-center text-yellow-400">
                                      <span className="mr-1">★</span>
                                      <span>{player.rating}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-gray-300">No player assigned</div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Player details when hovered */}
          {hoveredPlayer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                  <span className="text-xs md:text-sm font-bold text-blue-800 dark:text-blue-200">
                    {hoveredPlayer.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{hoveredPlayer.name}</h4>
                  <div className="flex items-center space-x-2 text-xs md:text-sm">
                    <span className="text-gray-600 dark:text-gray-300">{hoveredPlayer.position}</span>
                    {hoveredPlayer.rating && (
                      <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <span className="mr-1">★</span>
                        <span>{hoveredPlayer.rating}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 md:p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Users className="w-3 h-3 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Total Players</p>
                <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{players.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 md:p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                <Trophy className="w-3 h-3 md:w-4 md:h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Formation</p>
                <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{formation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamFormation;