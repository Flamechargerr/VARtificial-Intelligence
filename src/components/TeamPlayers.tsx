import React from "react";
import { type Player } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Star, Hash } from "lucide-react";

interface TeamPlayersProps {
  teamName: string;
  players: Player[];
  showAll?: boolean;
}

const TeamPlayers: React.FC<TeamPlayersProps> = ({ teamName, players, showAll = false }) => {
  // Determine which players to display
  const displayedPlayers = showAll ? players : players.slice(0, 5);
  
  // Group players by position
  const groupedPlayers: Record<string, Player[]> = {};
  displayedPlayers.forEach(player => {
    if (!groupedPlayers[player.position]) {
      groupedPlayers[player.position] = [];
    }
    groupedPlayers[player.position].push(player);
  });
  
  // Sort positions: GK, DEF, MID, FWD
  const sortedPositions = Object.keys(groupedPlayers).sort((a, b) => {
    const order: Record<string, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
    return (order[a] || 4) - (order[b] || 4);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {teamName} Players
        </h3>
      </div>
      
      <div className="space-y-4">
        {sortedPositions.map((position) => (
          <motion.div
            key={position}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {position}
              </h4>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                ({groupedPlayers[position].length})
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {groupedPlayers[position].map((player, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all duration-300 hover:shadow-md">
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                            {player.name ? (
                              <span className="text-xs font-bold text-blue-800 dark:text-blue-200">
                                {player.name.split(" ").map(n => n[0]).join("")}
                              </span>
                            ) : (
                              <Hash className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          {player.rating && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
                              <Star className="w-2.5 h-2.5 text-yellow-800 fill-current" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {player.name || "Unknown Player"}
                          </h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {player.position}
                            {player.rating && (
                              <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                                ★ {player.rating}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      
      {!showAll && players.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="text-center py-3"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {displayedPlayers.length} of {players.length} players
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TeamPlayers;