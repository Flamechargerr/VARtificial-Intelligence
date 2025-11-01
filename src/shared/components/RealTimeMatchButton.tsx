import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/shared/components/ui/dialog";
import InteractiveMatchTimeline from "./InteractiveMatchTimeline";
import { Play } from "lucide-react";

interface RealTimeMatchButtonProps {
  homeTeam: string;
  awayTeam: string;
}

const RealTimeMatchButton: React.FC<RealTimeMatchButtonProps> = ({ homeTeam, awayTeam }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Only show button if both teams are selected
  if (!homeTeam || !awayTeam) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Play className="w-4 h-4 mr-2" />
          Simulate Live Match
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interactive Match Timeline</DialogTitle>
        </DialogHeader>
        <InteractiveMatchTimeline homeTeam={homeTeam} awayTeam={awayTeam} />
      </DialogContent>
    </Dialog>
  );
};

export default RealTimeMatchButton;