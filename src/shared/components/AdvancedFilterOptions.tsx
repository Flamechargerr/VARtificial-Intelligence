import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Slider } from "@/shared/components/ui/slider";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Filter, X } from "lucide-react";

interface AdvancedFilterOptionsProps {
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
  className?: string;
}

const AdvancedFilterOptions: React.FC<AdvancedFilterOptionsProps> = ({
  onApplyFilters,
  onClearFilters,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confidenceRange, setConfidenceRange] = useState<[number, number]>([0, 100]);
  const [predictionType, setPredictionType] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [minAccuracy, setMinAccuracy] = useState<number>(0);
  const [showOnlyCorrect, setShowOnlyCorrect] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  const handleApplyFilters = () => {
    const filters = {
      confidenceRange,
      predictionType,
      dateRange,
      minAccuracy,
      showOnlyCorrect,
      sortBy,
      sortOrder
    };
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setConfidenceRange([0, 100]);
    setPredictionType("");
    setDateRange({ from: "", to: "" });
    setMinAccuracy(0);
    setShowOnlyCorrect(false);
    setSortBy("date");
    setSortOrder("desc");
    onClearFilters();
  };

  return (
    <div className={className}>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Filter className="h-4 w-4" />
        Filters
        {isOpen ? <X className="h-4 w-4" /> : null}
      </Button>

      {isOpen && (
        <Card className="mt-2 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confidence Range */}
            <div>
              <Label className="text-sm font-medium">Confidence Range</Label>
              <div className="pt-2">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={confidenceRange}
                  onValueChange={(value) => setConfidenceRange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{confidenceRange[0]}%</span>
                  <span>{confidenceRange[1]}%</span>
                </div>
              </div>
            </div>

            {/* Prediction Type */}
            <div>
              <Label className="text-sm font-medium">Prediction Type</Label>
              <Select value={predictionType} onValueChange={setPredictionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select prediction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_win">Home Win</SelectItem>
                  <SelectItem value="away_win">Away Win</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <Label className="text-xs text-gray-500">From</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">To</Label>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Minimum Accuracy */}
            <div>
              <Label className="text-sm font-medium">Minimum Accuracy</Label>
              <div className="pt-2">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[minAccuracy]}
                  onValueChange={(value) => setMinAccuracy(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{minAccuracy}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Show Only Correct Predictions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="correct-only"
                checked={showOnlyCorrect}
                onCheckedChange={(checked) => setShowOnlyCorrect(!!checked)}
              />
              <Label htmlFor="correct-only" className="text-sm font-medium">
                Show only correct predictions
              </Label>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm font-medium">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                    <SelectItem value="accuracy">Accuracy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Order</Label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                Clear
              </Button>
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedFilterOptions;