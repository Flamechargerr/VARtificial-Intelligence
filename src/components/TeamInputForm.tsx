import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import TeamStatInput from "@/components/TeamStatInput";
import PredictIcon from "@/components/icons/PredictIcon";
import { type Team, type Player } from "@/utils/types";
import TeamDisplay from "@/components/TeamDisplay";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TeamInputFormProps {
  homeTeam: Team;
  setHomeTeam: (team: Team) => void;
  awayTeam: Team;
  setAwayTeam: (team: Team) => void;
  homePlayers: Player[];
  awayPlayers: Player[];
  showAdvancedView: boolean;
  teamFormations: Record<string, string>;
  teamRankings: Record<string, number>;
  isLoading: boolean;
  onPredict: () => void;
  teams: string[];
}

const TeamInputForm: React.FC<TeamInputFormProps> = ({
  homeTeam,
  setHomeTeam,
  awayTeam,
  setAwayTeam,
  homePlayers,
  awayPlayers,
  showAdvancedView,
  teamFormations,
  teamRankings,
  isLoading,
  onPredict,
  teams,
}) => {
  const isFormValid = () => {
    return (
      homeTeam.name &&
      homeTeam.goals !== "" &&
      homeTeam.shots &&
      homeTeam.shotsOnTarget &&
      homeTeam.redCards &&
      awayTeam.name &&
      awayTeam.goals !== "" &&
      awayTeam.shots &&
      awayTeam.shotsOnTarget &&
      awayTeam.redCards
    );
  };

  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeamStatInput
                teamType="home"
                teamName={homeTeam.name}
                onTeamChange={(value) => setHomeTeam({ ...homeTeam, name: value })}
                goals={homeTeam.goals}
                onGoalsChange={(value) => setHomeTeam({ ...homeTeam, goals: value })}
                shots={homeTeam.shots}
                onShotsChange={(value) => setHomeTeam({ ...homeTeam, shots: value })}
                shotsOnTarget={homeTeam.shotsOnTarget}
                onShotsOnTargetChange={(value) => setHomeTeam({ ...homeTeam, shotsOnTarget: value })}
                redCards={homeTeam.redCards}
                onRedCardsChange={(value) => setHomeTeam({ ...homeTeam, redCards: value })}
                teamOptions={teams}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Away Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeamStatInput
                teamType="away"
                teamName={awayTeam.name}
                onTeamChange={(value) => setAwayTeam({ ...awayTeam, name: value })}
                goals={awayTeam.goals}
                onGoalsChange={(value) => setAwayTeam({ ...awayTeam, goals: value })}
                shots={awayTeam.shots}
                onShotsChange={(value) => setAwayTeam({ ...awayTeam, shots: value })}
                shotsOnTarget={awayTeam.shotsOnTarget}
                onShotsOnTargetChange={(value) => setAwayTeam({ ...awayTeam, shotsOnTarget: value })}
                redCards={awayTeam.redCards}
                onRedCardsChange={(value) => setAwayTeam({ ...awayTeam, redCards: value })}
                teamOptions={teams}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
        <TeamDisplay 
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          homePlayers={homePlayers}
          awayPlayers={awayPlayers}
          showAdvancedView={showAdvancedView}
          teamFormations={teamFormations}
          teamRankings={teamRankings}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex justify-center"
      >
        <Button 
          size="lg" 
          onClick={onPredict} 
          disabled={isLoading || !isFormValid()}
          className="w-full max-w-md py-6 text-lg font-bold relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              <span>ANALYZING MATCH DATA...</span>
            </div>
          ) : (
            <>
              <PredictIcon className="mr-2 h-6 w-6" />
              <span>PREDICT MATCH RESULT</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </>
          )}
        </Button>
      </motion.div>
    </section>
  );
};

export default TeamInputForm;