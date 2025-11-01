import React from "react";
import { type Player } from "@/shared/utils/types";
import TeamPlayers from "@/shared/components/TeamPlayers";
import TeamFormation from "@/shared/components/TeamFormation";
import TeamNews from "@/shared/components/TeamNews";
import PlayerInjuryReport from "@/shared/components/PlayerInjuryReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { motion } from "framer-motion";

interface TeamDisplayProps {
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  homePlayers: Player[];
  awayPlayers: Player[];
  showAdvancedView: boolean;
  teamFormations: Record<string, string>;
  teamRankings: Record<string, number>;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
  homeTeam,
  awayTeam,
  homePlayers,
  awayPlayers,
  showAdvancedView,
  teamFormations,
  teamRankings,
}) => {
  if (!homeTeam.name && !awayTeam.name) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showAdvancedView && (homeTeam.name || awayTeam.name) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-4 md:my-6">
          {homeTeam.name && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-base md:text-lg">
                    <Badge variant="default" className="mr-2 transition-all duration-300 hover:scale-110 text-xs md:text-sm">Home</Badge>
                    {homeTeam.name} Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamFormation 
                    teamName={homeTeam.name} 
                    players={homePlayers}
                    formation={teamFormations[homeTeam.name] || "4-3-3"}
                    fifaRanking={teamRankings[homeTeam.name]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
          {awayTeam.name && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center text-red-900 dark:text-red-100 text-base md:text-lg">
                    <Badge variant="destructive" className="mr-2 transition-all duration-300 hover:scale-110 text-xs md:text-sm">Away</Badge>
                    {awayTeam.name} Formation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamFormation 
                    teamName={awayTeam.name} 
                    players={awayPlayers}
                    formation={teamFormations[awayTeam.name] || "4-3-3"}
                    fifaRanking={teamRankings[awayTeam.name]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Team News Section */}
      {showAdvancedView && (homeTeam.name || awayTeam.name) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-4 md:my-6">
          {homeTeam.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <TeamNews teamName={homeTeam.name} />
            </motion.div>
          )}
          {awayTeam.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <TeamNews teamName={awayTeam.name} />
            </motion.div>
          )}
        </div>
      )}

      {/* Player Injury Reports */}
      {showAdvancedView && (homeTeam.name || awayTeam.name) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-4 md:my-6">
          {homeTeam.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <PlayerInjuryReport teamName={homeTeam.name} />
            </motion.div>
          )}
          {awayTeam.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <PlayerInjuryReport teamName={awayTeam.name} />
            </motion.div>
          )}
        </div>
      )}

      {(homeTeam.name || awayTeam.name) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 my-4 md:my-6">
          {homeTeam.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center text-blue-900 dark:text-blue-100 text-base md:text-lg">
                    <Badge variant="default" className="mr-2 transition-all duration-300 hover:scale-110 text-xs md:text-sm">Home</Badge>
                    {homeTeam.name} Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamPlayers 
                    teamName={homeTeam.name} 
                    players={homePlayers}
                    showAll={showAdvancedView}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
          {awayTeam.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/20 dark:to-pink-900/20 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-center text-red-900 dark:text-red-100 text-base md:text-lg">
                    <Badge variant="destructive" className="mr-2 transition-all duration-300 hover:scale-110 text-xs md:text-sm">Away</Badge>
                    {awayTeam.name} Players
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamPlayers 
                    teamName={awayTeam.name} 
                    players={awayPlayers}
                    showAll={showAdvancedView}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default TeamDisplay;