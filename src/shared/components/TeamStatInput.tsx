import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Target, Crosshair, CheckCircle, AlertTriangle } from "lucide-react";
import SearchableTeamSelect from "./SearchableTeamSelect";

interface TeamStatInputProps {
  teamType: "home" | "away";
  teamName: string;
  onTeamChange: (team: string) => void;
  goals: string;
  onGoalsChange: (goals: string) => void;
  shots: string;
  onShotsChange: (shots: string) => void;
  shotsOnTarget: string;
  onShotsOnTargetChange: (shotsOnTarget: string) => void;
  redCards: string;
  onRedCardsChange: (redCards: string) => void;
  teamOptions: string[];
  className?: string;
}

const TeamStatInput: React.FC<TeamStatInputProps> = ({
  teamType,
  teamName,
  onTeamChange,
  goals,
  onGoalsChange,
  shots,
  onShotsChange,
  shotsOnTarget,
  onShotsOnTargetChange,
  redCards,
  onRedCardsChange,
  teamOptions,
  className = "",
}) => {
  const isHome = teamType === "home";
  const bgGradient = isHome
    ? "bg-gradient-to-br from-blue-50 to-blue-50/70"
    : "bg-gradient-to-br from-red-50 to-red-50/70";
  const borderColor = isHome ? "border-home-light" : "border-away-light";
  const textColor = isHome ? "text-home-dark" : "text-away-dark";
  const labelColor = isHome ? "text-home-DEFAULT" : "text-away-DEFAULT";
  const shadowColor = isHome ? "shadow-blue-100/50" : "shadow-red-100/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`stat-input-card ${bgGradient} border ${borderColor} ${shadowColor} ${className}`}
    >
      <div className="flex items-center mb-3 md:mb-4 space-x-2">
        <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${isHome ? "bg-home-DEFAULT" : "bg-away-DEFAULT"}`}></div>
        <h3 className={`text-base md:text-lg font-semibold ${textColor}`}>
          {isHome ? "Home Team" : "Away Team"}
        </h3>
        <Badge variant={isHome ? "default" : "destructive"} className="ml-auto text-xs transition-all duration-300 hover:scale-110">
          {isHome ? "HOME" : "AWAY"}
        </Badge>
      </div>

      <div className="space-y-3 md:space-y-4">
        <SearchableTeamSelect
          teamType={teamType}
          teamName={teamName}
          onTeamChange={onTeamChange}
          teamOptions={teamOptions}
          placeholder={`Search for ${isHome ? "home" : "away"} team...`}
        />

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div>
            <Label htmlFor={`${teamType}-goals`} className={`mb-1 block font-medium ${labelColor} text-sm md:text-base`}>
              Goals *
            </Label>
            <div className="relative">
              <Input
                id={`${teamType}-goals`}
                type="number"
                min="0"
                value={goals}
                onChange={(e) => onGoalsChange(e.target.value)}
                className="focused-input bg-white/80 backdrop-blur-sm pl-7 md:pl-8 text-sm md:text-base"
                placeholder="0"
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Target className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor={`${teamType}-shots`} className={`mb-1 block font-medium ${labelColor} text-sm md:text-base`}>
              Shots *
            </Label>
            <div className="relative">
              <Input
                id={`${teamType}-shots`}
                type="number"
                min="0"
                value={shots}
                onChange={(e) => onShotsChange(e.target.value)}
                className="focused-input bg-white/80 backdrop-blur-sm pl-7 md:pl-8 text-sm md:text-base"
                placeholder="0"
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Crosshair className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor={`${teamType}-on-target`} className={`mb-1 block font-medium ${labelColor} text-sm md:text-base`}>
              On Target *
            </Label>
            <div className="relative">
              <Input
                id={`${teamType}-on-target`}
                type="number"
                min="0"
                value={shotsOnTarget}
                onChange={(e) => onShotsOnTargetChange(e.target.value)}
                className="focused-input bg-white/80 backdrop-blur-sm pl-7 md:pl-8 text-sm md:text-base"
                placeholder="0"
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor={`${teamType}-red-cards`} className={`mb-1 block font-medium ${labelColor} text-sm md:text-base`}>
              Red Cards *
            </Label>
            <div className="relative">
              <Input
                id={`${teamType}-red-cards`}
                type="number"
                min="0"
                value={redCards}
                onChange={(e) => onRedCardsChange(e.target.value)}
                className="focused-input bg-white/80 backdrop-blur-sm pl-7 md:pl-8 text-sm md:text-base"
                placeholder="0"
              />
              <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamStatInput;