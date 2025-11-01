import React from "react";
import { type Player } from "@/utils/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Trophy, Hash } from "lucide-react";

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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{teamName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Formation: {formation}</p>
          </div>
        </div>
        
        {fifaRanking && (
          <Badge variant="secondary" className="transition-all duration-300 hover:scale-110">
            <Trophy className="w-3 h-3 mr-1" />
            FIFA Ranking: #{fifaRanking}
          </Badge>
        )}
      </div>
      
      <div className="relative">
        {/* Football field visualization */}
        <div className="bg-green-600 rounded-xl p-6 relative overflow-hidden border-4 border-white">
          {/* Field markings */}
          <div className="absolute inset-0 border-2 border-white/30 rounded-lg"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 border-2 border-white/30 rounded-b-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-16 border-2 border-white/30 rounded-t-full"></div>
          
          {/* Formation lines */}
          <div className="space-y-8">
            {formationParts.map((count, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex justify-center space-x-4"
              >
                {Array.from({ length: count }).map((_, playerIndex) => {
                  const playersInLine = getPlayersForLine(index);
                  const player = playersInLine[playerIndex];
                  
                  return (
                    <motion.div
                      key={playerIndex}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                      className="relative group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 flex items-center justify-center shadow-lg transition-all duration-300 hover:shadow-xl">
                        {player ? (
                          <span className="text-xs font-bold text-gray-800">
                            {player.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        ) : (
                          <Hash className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      {player && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 0 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 
                                    bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-gray-300">{player.position}</div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Players</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{players.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Formation</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{formation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamFormation;