import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Download } from "lucide-react";
import { exportPredictions, type ExportData } from "@/shared/utils/exportPredictions";
import { type MatchPrediction } from "@/shared/utils/types";

interface ExportPredictionsButtonProps {
  homeTeam: string;
  awayTeam: string;
  predictions: MatchPrediction[];
}

const ExportPredictionsButton: React.FC<ExportPredictionsButtonProps> = ({
  homeTeam,
  awayTeam,
  predictions
}) => {
  const handleExport = (format: 'csv' | 'json' | 'txt') => {
    const exportData: ExportData = {
      homeTeam,
      awayTeam,
      predictions,
      timestamp: new Date()
    };
    
    exportPredictions(exportData, format);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('txt')}>
          Export as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportPredictionsButton;