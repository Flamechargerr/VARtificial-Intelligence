import React, { useState, useMemo } from "react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

interface SearchableTeamSelectProps {
  teamType: "home" | "away";
  teamName: string;
  onTeamChange: (team: string) => void;
  teamOptions: string[];
  placeholder?: string;
}

const SearchableTeamSelect: React.FC<SearchableTeamSelectProps> = ({
  teamType,
  teamName,
  onTeamChange,
  teamOptions,
  placeholder = "Search for a team...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const isHome = teamType === "home";

  // Remove duplicates and sort teams
  const uniqueTeams = useMemo(() => {
    return [...new Set(teamOptions)].sort();
  }, [teamOptions]);

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm) return uniqueTeams;
    return uniqueTeams.filter(team => 
      team.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [uniqueTeams, searchTerm]);

  // Get popular teams (top 10)
  const popularTeams = useMemo(() => {
    return uniqueTeams.slice(0, 10);
  }, [uniqueTeams]);

  // Handle team selection
  const handleSelect = (team: string) => {
    onTeamChange(team);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Handle clear selection
  const handleClear = () => {
    onTeamChange("");
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${teamType}-team-search`} className="text-sm font-medium">
        {isHome ? "Home" : "Away"} Team *
      </Label>
      
      <div className="relative">
        {/* Search Input */}
        <div 
          className={`flex items-center border rounded-md bg-white/80 backdrop-blur-sm transition-all duration-200 ${
            isOpen 
              ? "ring-2 ring-blue-500 border-blue-500 shadow-lg" 
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="pl-3">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          
          <Input
            id={`${teamType}-team-search`}
            type="text"
            placeholder={teamName || placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-r-none pr-8"
          />
          
          {teamName && (
            <button
              onClick={handleClear}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-hidden"
            >
              <ScrollArea className="h-60">
                {/* Selected Team Display */}
                {teamName && (
                  <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selected</div>
                    <div 
                      className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/30 rounded cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50"
                      onClick={() => handleSelect(teamName)}
                    >
                      <span className="font-medium">{teamName}</span>
                      <Badge variant={isHome ? "default" : "destructive"} className="text-xs">
                        {isHome ? "HOME" : "AWAY"}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Popular Teams */}
                {!searchTerm && (
                  <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Popular Teams</div>
                    <div className="space-y-1">
                      {popularTeams.map((team) => (
                        <div
                          key={team}
                          className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            teamName === team ? "bg-blue-100 dark:bg-blue-900/50" : ""
                          }`}
                          onClick={() => handleSelect(team)}
                        >
                          {team}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Search Results */}
                <div className="p-2">
                  {searchTerm && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {filteredTeams.length} result{filteredTeams.length !== 1 ? "s" : ""}
                    </div>
                  )}
                  
                  {filteredTeams.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No teams found
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredTeams.map((team) => (
                        <div
                          key={team}
                          className={`p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            teamName === team ? "bg-blue-100 dark:bg-blue-900/50" : ""
                          }`}
                          onClick={() => handleSelect(team)}
                        >
                          {team}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Click outside to close */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SearchableTeamSelect;