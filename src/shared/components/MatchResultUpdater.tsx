import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { toast } from "@/shared/components/ui/use-toast";
import { matchHistoryService, type MatchHistoryItem } from "@/shared/utils/matchHistory";
import { motion } from "framer-motion";
import { Save, Trophy, Target } from "lucide-react";

interface MatchResultUpdaterProps {
  match: MatchHistoryItem;
  onUpdate: () => void;
}

const MatchResultUpdater: React.FC<MatchResultUpdaterProps> = ({ match, onUpdate }) => {
  const [homeGoals, setHomeGoals] = useState<string>(match.homeGoals.toString());
  const [awayGoals, setAwayGoals] = useState<string>(match.awayGoals.toString());
  const [actualResult, setActualResult] = useState<string>(match.actualResult || "");
  
  const determineResult = (home: number, away: number): string => {
    if (home > away) return "Home Win";
    if (away > home) return "Away Win";
    return "Draw";
  };
  
  const handleUpdateResult = () => {
    const home = parseInt(homeGoals);
    const away = parseInt(awayGoals);
    
    if (isNaN(home) || isNaN(away)) {
      toast({
        title: "Invalid input",
        description: "Please enter valid goal numbers",
        variant: "destructive",
      });
      return;
    }
    
    const result = determineResult(home, away);
    const accuracy = match.prediction === result ? 100 : 0;
    
    matchHistoryService.updateMatchResult(match.id, result, accuracy);
    
    toast({
      title: "Match result updated",
      description: `Result for ${match.homeTeam} vs ${match.awayTeam} has been updated`,
    });
    
    onUpdate();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-base">
            <Trophy className="mr-2 h-4 w-4" />
            Update Match Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium">{match.homeTeam} vs {match.awayTeam}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Predicted: {match.prediction} ({match.confidence.toFixed(0)}% confidence)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeGoals" className="text-sm">Home Goals</Label>
                <Input
                  id="homeGoals"
                  type="number"
                  min="0"
                  value={homeGoals}
                  onChange={(e) => setHomeGoals(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="awayGoals" className="text-sm">Away Goals</Label>
                <Input
                  id="awayGoals"
                  type="number"
                  min="0"
                  value={awayGoals}
                  onChange={(e) => setAwayGoals(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="actualResult" className="text-sm">Actual Result</Label>
              <Select value={actualResult} onValueChange={setActualResult}>
                <SelectTrigger id="actualResult" className="mt-1">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home Win">Home Win</SelectItem>
                  <SelectItem value="Draw">Draw</SelectItem>
                  <SelectItem value="Away Win">Away Win</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleUpdateResult}
              className="w-full"
              disabled={!homeGoals || !awayGoals || !actualResult}
            >
              <Save className="mr-2 h-4 w-4" />
              Update Result
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MatchResultUpdater;