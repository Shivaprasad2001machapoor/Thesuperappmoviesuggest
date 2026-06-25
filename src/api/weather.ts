import axios from "axios";
import { WeatherData } from "../types";

export const fetchCurrentWeather = async (lat: number, lon: number, cityLabel: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`/api/weather?lat=${lat}&lon=${lon}&q=${encodeURIComponent(cityLabel)}`);
    return response.data;
  } catch (error) {
    console.warn("Express weather proxy unavailable, falling back to direct client-side keyless Open-Meteo API:", error);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure`;
      const response = await axios.get(url);
      const current = response.data.current;
      const code = current.weather_code;

      let desc = "Cloudy";
      if (code === 0) desc = "Clear Sky";
      else if (code >= 1 && code <= 3) desc = "Partly Cloudy";
      else if (code === 45 || code === 48) desc = "Foggy";
      else if (code >= 51 && code <= 55) desc = "Drizzling";
      else if (code >= 61 && code <= 65) desc = "Heavy Rain";
      else if (code >= 71 && code <= 75) desc = "Snowing";
      else if (code >= 80 && code <= 82) desc = "Showers";
      else if (code >= 95) desc = "Thunderstorm";

      return {
        source: "Open-Meteo (Direct Client Fallback)",
        temp: Math.round(current.temperature_2m),
        description: desc,
        conditionCode: code,
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        pressure: Math.round(current.surface_pressure),
        city: cityLabel || "Your Location",
      };
    } catch (fallbackError) {
      console.error("Direct weather API failed:", fallbackError);
      throw fallbackError;
    }
  }
};
