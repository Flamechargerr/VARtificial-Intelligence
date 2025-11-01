import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Badge } from "@/shared/components/ui/badge";
import { matchHistoryService, type MatchHistoryItem } from "@/shared/utils/matchHistory";
import { Trash2, Calendar, Trophy, Target, Edit3 } from "lucide-react";
import PredictionAccuracyStats from "./PredictionAccuracyStats";
import MatchResultUpdater from "./MatchResultUpdater";
import AdvancedFilterOptions from "./AdvancedFilterOptions";

const MatchHistory: React.FC = () => {
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<MatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<MatchHistoryItem | null>(null);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, filters]);

  const loadHistory = () => {
    try {
      const historyData = matchHistoryService.getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading match history:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...history];
    
    // Apply confidence range filter
    if (filters.confidenceRange) {
      const [min, max] = filters.confidenceRange;
      filtered = filtered.filter(match => 
        match.confidence >= min && match.confidence <= max
      );
    }
    
    // Apply prediction type filter
    if (filters.predictionType) {
      filtered = filtered.filter(match => 
        match.prediction.toLowerCase().includes(filters.predictionType.replace('_', ' '))
      );
    }
    
    // Apply date range filter
    if (filters.dateRange?.from) {
      const fromDate = new Date(filters.dateRange.from);
      filtered = filtered.filter(match => 
        new Date(match.timestamp) >= fromDate
      );
    }
    
    if (filters.dateRange?.to) {
      const toDate = new Date(filters.dateRange.to);
      filtered = filtered.filter(match => 
        new Date(match.timestamp) <= toDate
      );
    }
    
    // Apply minimum accuracy filter
    if (filters.minAccuracy > 0) {
      filtered = filtered.filter(match => 
        match.accuracy !== undefined && match.accuracy >= filters.minAccuracy
      );
    }
    
    // Apply show only correct filter
    if (filters.showOnlyCorrect) {
      filtered = filtered.filter(match => 
        match.actualResult !== undefined && match.prediction === match.actualResult
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (filters.sortBy) {
          case 'date':
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          case 'confidence':
            aValue = a.confidence;
            bValue = b.confidence;
            break;
          case 'accuracy':
            aValue = a.accuracy || 0;
            bValue = b.accuracy || 0;
            break;
          default:
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
        }
        
        if (filters.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    setFilteredHistory(filtered);
  };

  const clearHistory = () => {
    matchHistoryService.clearHistory();
    setHistory([]);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const getPredictionColor = (prediction: string) => {
    switch (prediction) {
      case "Home Win":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
      case "Away Win":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "Draw":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const getAccuracyColor = (accuracy?: number) => {
    if (accuracy === undefined) return "";
    if (accuracy >= 80) return "text-green-600 dark:text-green-400";
    if (accuracy >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Match History
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading match history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Accuracy Statistics */}
      <PredictionAccuracyStats />
      
      {/* Match History */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Match History
            </span>
            <div className="flex space-x-2">
              <AdvancedFilterOptions 
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
              {history.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearHistory}
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No match history found with current filters.
            </p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {filteredHistory.map((match) => (
                  <div 
                    key={match.id} 
                    className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {match.homeGoals} - {match.awayGoals}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(match.timestamp).toLocaleDateString()} at {new Date(match.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPredictionColor(match.prediction)}>
                          {match.prediction}
                        </Badge>
                        {!match.actualResult && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMatch(match)}
                            className="h-6 px-2"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center text-sm">
                        <Target className="mr-1 h-4 w-4" />
                        <span>Confidence: {Math.round(match.confidence)}%</span>
                      </div>
                      {match.accuracy !== undefined ? (
                        <div className={`flex items-center text-sm font-medium ${getAccuracyColor(match.accuracy)}`}>
                          <Trophy className="mr-1 h-4 w-4" />
                          <span>Accuracy: {Math.round(match.accuracy)}%</span>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Result not recorded
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
      
      {/* Match Result Updater */}
      {editingMatch && (
        <MatchResultUpdater 
          match={editingMatch} 
          onUpdate={() => {
            setEditingMatch(null);
            loadHistory();
          }} 
        />
      )}
    </div>
  );
};

export default MatchHistory;