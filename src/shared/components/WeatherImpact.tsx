import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { getWeatherData, calculateWeatherImpact, type WeatherData, type WeatherImpact, getWeatherIcon } from "@/shared/utils/weatherService";
import { Cloud, Thermometer, Droplets, Wind, Gauge, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

interface WeatherImpactProps {
  location: string;
  homeTeam: string;
  awayTeam: string;
  className?: string;
}

const WeatherImpact: React.FC<WeatherImpactProps> = ({ 
  location, 
  homeTeam, 
  awayTeam, 
  className = "" 
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [impact, setImpact] = useState<WeatherImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeatherData();
  }, [location]);

  const loadWeatherData = () => {
    try {
      setLoading(true);
      const weatherData = getWeatherData(location);
      setWeather(weatherData);
      
      if (weatherData) {
        const impactData = calculateWeatherImpact(weatherData, homeTeam, awayTeam);
        setImpact(impactData);
      }
    } catch (error) {
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Weather Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading weather data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!weather || !impact) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Weather Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            Weather data not available for {location}.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert impact values to percentages for progress bars
  const homeImpactPercentage = Math.max(0, Math.min(100, 50 + (impact.homeTeamImpact * 50)));
  const awayImpactPercentage = Math.max(0, Math.min(100, 50 + (impact.awayTeamImpact * 50)));
  const overallImpactPercentage = Math.max(0, Math.min(100, 50 + (impact.overallImpact * 50)));

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="mr-2 h-5 w-5" />
          Weather Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Weather */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <div className="text-2xl mb-1">{getWeatherIcon(weather.weatherCondition)}</div>
            <div className="text-sm font-medium capitalize">{weather.weatherCondition}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Condition</div>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <Thermometer className="w-5 h-5 mx-auto mb-1 text-orange-500" />
            <div className="text-lg font-bold">{weather.temperature}°C</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
          </div>
          <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-center">
            <Droplets className="w-5 h-5 mx-auto mb-1 text-cyan-500" />
            <div className="text-lg font-bold">{weather.humidity}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
          </div>
        </div>

        {/* Detailed Weather Data */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              <Wind className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">Wind</span>
            </div>
            <span className="text-sm font-medium">{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center">
              <Gauge className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">Pressure</span>
            </div>
            <span className="text-sm font-medium">{weather.pressure} hPa</span>
          </div>
        </div>

        {/* Weather Impact on Teams */}
        <div>
          <h3 className="text-sm font-medium mb-3">Team Impact</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{homeTeam}</span>
                <span className={impact.homeTeamImpact > 0 ? "text-green-600" : impact.homeTeamImpact < 0 ? "text-red-600" : ""}>
                  {impact.homeTeamImpact > 0 ? '+' : ''}{(impact.homeTeamImpact * 100).toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={homeImpactPercentage} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{awayTeam}</span>
                <span className={impact.awayTeamImpact > 0 ? "text-green-600" : impact.awayTeamImpact < 0 ? "text-red-600" : ""}>
                  {impact.awayTeamImpact > 0 ? '+' : ''}{(impact.awayTeamImpact * 100).toFixed(0)}%
                </span>
              </div>
              <Progress 
                value={awayImpactPercentage} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Overall Impact */}
        <div>
          <h3 className="text-sm font-medium mb-3">Overall Match Impact</h3>
          <div className="space-y-2">
            <Progress 
              value={overallImpactPercentage} 
              className="h-3"
            />
            <div className="text-center">
              <Badge 
                variant={impact.overallImpact > 0.1 ? "default" : impact.overallImpact < -0.1 ? "destructive" : "secondary"}
                className="text-xs"
              >
                {impact.overallImpact > 0.1 ? "Positive Impact" : impact.overallImpact < -0.1 ? "Negative Impact" : "Neutral Impact"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {impact.recommendation}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherImpact;