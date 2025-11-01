// Weather service to simulate weather data and its impact on football matches
export interface WeatherData {
  temperature: number; // in Celsius
  humidity: number; // percentage
  windSpeed: number; // in km/h
  precipitation: number; // in mm
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy';
  pressure: number; // in hPa
}

export interface WeatherImpact {
  homeTeamImpact: number; // -1 to 1, negative means disadvantage
  awayTeamImpact: number; // -1 to 1, negative means disadvantage
  overallImpact: number; // -1 to 1, negative means match quality decreases
  recommendation: string;
}

// Mock weather data for different locations
const mockWeatherData: Record<string, WeatherData> = {
  "Old Trafford": {
    temperature: 15,
    humidity: 75,
    windSpeed: 12,
    precipitation: 2.5,
    weatherCondition: "cloudy",
    pressure: 1013
  },
  "Wembley Stadium": {
    temperature: 18,
    humidity: 65,
    windSpeed: 8,
    precipitation: 0,
    weatherCondition: "sunny",
    pressure: 1015
  },
  "Camp Nou": {
    temperature: 22,
    humidity: 60,
    windSpeed: 5,
    precipitation: 0,
    weatherCondition: "sunny",
    pressure: 1018
  },
  "Santiago Bernabeu": {
    temperature: 20,
    humidity: 55,
    windSpeed: 7,
    precipitation: 0,
    weatherCondition: "sunny",
    pressure: 1016
  },
  "Allianz Arena": {
    temperature: 12,
    humidity: 80,
    windSpeed: 15,
    precipitation: 5.2,
    weatherCondition: "rainy",
    pressure: 1008
  },
  "Signal Iduna Park": {
    temperature: 14,
    humidity: 70,
    windSpeed: 10,
    precipitation: 1.0,
    weatherCondition: "cloudy",
    pressure: 1012
  }
};

// Function to get weather data for a location
export const getWeatherData = (location: string): WeatherData | null => {
  try {
    // In a real application, this would call a weather API
    return mockWeatherData[location] || null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

// Function to calculate weather impact on a match
export const calculateWeatherImpact = (
  weather: WeatherData,
  homeTeam: string,
  awayTeam: string
): WeatherImpact => {
  // Base impact factors
  let homeImpact = 0;
  let awayImpact = 0;
  
  // Temperature impact
  // Teams from warmer climates might struggle in cold weather
  if (weather.temperature < 5) {
    // Cold weather penalty
    homeImpact -= 0.1;
    awayImpact -= 0.1;
  } else if (weather.temperature > 25) {
    // Hot weather penalty
    homeImpact -= 0.05;
    awayImpact -= 0.05;
  }
  
  // Wind impact
  if (weather.windSpeed > 20) {
    // Strong wind affects ball movement
    homeImpact -= 0.15;
    awayImpact -= 0.15;
  } else if (weather.windSpeed > 10) {
    // Moderate wind
    homeImpact -= 0.05;
    awayImpact -= 0.05;
  }
  
  // Precipitation impact
  switch (weather.weatherCondition) {
    case 'rainy':
      // Rain affects ball control and player movement
      homeImpact -= 0.2;
      awayImpact -= 0.2;
      break;
    case 'stormy':
      // Stormy weather significantly affects play
      homeImpact -= 0.3;
      awayImpact -= 0.3;
      break;
    case 'snowy':
      // Snow heavily impacts play
      homeImpact -= 0.35;
      awayImpact -= 0.35;
      break;
  }
  
  // Humidity impact
  if (weather.humidity > 85) {
    // High humidity affects player stamina
    homeImpact -= 0.1;
    awayImpact -= 0.1;
  }
  
  // Pressure impact (affects ball flight)
  if (weather.pressure < 1000) {
    // Low pressure can affect ball flight
    homeImpact -= 0.05;
    awayImpact -= 0.05;
  }
  
  // Team-specific adjustments could be added here
  // For example, teams from rainy climates might handle rain better
  
  // Calculate overall impact
  const overallImpact = (homeImpact + awayImpact) / 2;
  
  // Generate recommendation
  let recommendation = "";
  if (overallImpact < -0.3) {
    recommendation = "Significant weather impact expected. Match quality may be reduced.";
  } else if (overallImpact < -0.1) {
    recommendation = "Moderate weather impact. Some effect on play expected.";
  } else if (overallImpact > 0.1) {
    recommendation = "Favorable weather conditions. Good match quality expected.";
  } else {
    recommendation = "Neutral weather conditions. Normal match quality expected.";
  }
  
  return {
    homeTeamImpact: homeImpact,
    awayTeamImpact: awayImpact,
    overallImpact: overallImpact,
    recommendation: recommendation
  };
};

// Function to get weather icon based on condition
export const getWeatherIcon = (condition: string): string => {
  switch (condition) {
    case 'sunny':
      return '☀️';
    case 'cloudy':
      return '☁️';
    case 'rainy':
      return '🌧️';
    case 'snowy':
      return '❄️';
    case 'stormy':
      return '⛈️';
    default:
      return '🌤️';
  }
};