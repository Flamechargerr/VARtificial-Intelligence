import React, { useState } from "react";
import { type Player } from "@/shared/utils/types";
import { motion } from "framer-motion";
import { Users, Trophy, Hash, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Card, CardContent } from "@/shared/components/ui/card";

interface FormationPosition {
  x: number;
  y: number;
  position: string;
}

interface AdvancedFormationVisualizationProps {
  teamName: string;
  players: Player[];
  formation: string;
  fifaRanking?: number;
}

const AdvancedFormationVisualization: React.FC<AdvancedFormationVisualizationProps> = ({
  teamName,
  players,
  formation,
  fifaRanking,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Define formation positions based on common formations
  const getFormationPositions = (formation: string): FormationPosition[] => {
    switch (formation) {
      case "4-3-3":
        return [
          // GK
          { x: 50, y: 90, position: "GK" },
          // DEF
          { x: 20, y: 70, position: "LB" },
          { x: 35, y: 75, position: "CB" },
          { x: 65, y: 75, position: "CB" },
          { x: 80, y: 70, position: "RB" },
          // MID
          { x: 30, y: 50, position: "LM" },
          { x: 50, y: 55, position: "CM" },
          { x: 70, y: 50, position: "RM" },
          // FWD
          { x: 30, y: 25, position: "LW" },
          { x: 50, y: 15, position: "ST" },
          { x: 70, y: 25, position: "RW" },
        ];
      case "4-2-3-1":
        return [
          // GK
          { x: 50, y: 90, position: "GK" },
          // DEF
          { x: 20, y: 70, position: "LB" },
          { x: 35, y: 75, position: "CB" },
          { x: 65, y: 75, position: "CB" },
          { x: 80, y: 70, position: "RB" },
          // MID (Defensive)
          { x: 35, y: 55, position: "CDM" },
          { x: 65, y: 55, position: "CDM" },
          // MID (Attacking)
          { x: 30, y: 35, position: "LAM" },
          { x: 50, y: 30, position: "CAM" },
          { x: 70, y: 35, position: "RAM" },
          // FWD
          { x: 50, y: 15, position: "ST" },
        ];
      case "4-4-2":
        return [
          // GK
          { x: 50, y: 90, position: "GK" },
          // DEF
          { x: 20, y: 70, position: "LB" },
          { x: 35, y: 75, position: "CB" },
          { x: 65, y: 75, position: "CB" },
          { x: 80, y: 70, position: "RB" },
          // MID
          { x: 25, y: 50, position: "LM" },
          { x: 40, y: 55, position: "CM" },
          { x: 60, y: 55, position: "CM" },
          { x: 75, y: 50, position: "RM" },
          // FWD
          { x: 40, y: 25, position: "ST" },
          { x: 60, y: 25, position: "ST" },
        ];
      default:
        // Default 4-3-3
        return [
          { x: 50, y: 90, position: "GK" },
          { x: 20, y: 70, position: "LB" },
          { x: 35, y: 75, position: "CB" },
          { x: 65, y: 75, position: "CB" },
          { x: 80, y: 70, position: "RB" },
          { x: 30, y: 50, position: "LM" },
          { x: 50, y: 55, position: "CM" },
          { x: 70, y: 50, position: "RM" },
          { x: 30, y: 25, position: "LW" },
          { x: 50, y: 15, position: "ST" },
          { x: 70, y: 25, position: "RW" },
        ];
    }
  };

  // Group players by position
  const groupedPlayers: Record<string, Player[]> = {};
  players.forEach(player => {
    if (!groupedPlayers[player.position]) {
      groupedPlayers[player.position] = [];
    }
    groupedPlayers[player.position].push(player);
  });

  // Assign players to positions
  const formationPositions = getFormationPositions(formation);
  const assignedPlayers = formationPositions.map(pos => {
    const playersInPosition = groupedPlayers[pos.position] || [];
    return {
      ...pos,
      player: playersInPosition.length > 0 ? playersInPosition[0] : null
    };
  });

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
        
        {fifaRanking && (
          <div className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold">
            <Trophy className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            #{fifaRanking}
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Football field visualization */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-4 md:p-6 relative overflow-hidden border-4 border-white shadow-lg aspect-video">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 border-2 border-white/30 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-12 md:w-24 md:h-16 border-2 border-white/30 rounded-b-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 md:w-24 md:h-16 border-2 border-white/30 rounded-t-full"></div>
          
          {/* Formation players */}
          <div className="absolute inset-0">
            {assignedPlayers.map((pos, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      onClick={() => setSelectedPlayer(pos.player || null)}
                    >
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        selectedPlayer?.id === pos.player?.id 
                          ? "bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white scale-110" 
                          : "bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 hover:scale-110"
                      }`}>
                        {pos.player ? (
                          <span className="text-[8px] md:text-xs font-bold text-gray-800">
                            {pos.player.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        ) : (
                          <Hash className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-[6px] md:text-[8px] font-bold rounded px-1 py-0.5 whitespace-nowrap">
                        {pos.position}
                      </div>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-900 text-white text-xs">
                    {pos.player ? (
                      <div className="space-y-1">
                        <div className="font-bold">{pos.player.name}</div>
                        <div className="text-gray-300">{pos.position}</div>
                        {pos.player.rating && (
                          <div className="flex items-center text-yellow-400">
                            <span className="mr-1">★</span>
                            <span>{pos.player.rating}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-300">No player assigned</div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
      
      {/* Player details when selected */}
      {selectedPlayer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
              <span className="text-xs md:text-sm font-bold text-blue-800 dark:text-blue-200">
                {selectedPlayer.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 dark:text-white">{selectedPlayer.name}</h4>
              <div className="flex items-center space-x-2 text-xs md:text-sm">
                <span className="text-gray-600 dark:text-gray-300">{selectedPlayer.position}</span>
                {selectedPlayer.rating && (
                  <span className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <span className="mr-1">★</span>
                    <span>{selectedPlayer.rating}</span>
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
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

export default AdvancedFormationVisualization;