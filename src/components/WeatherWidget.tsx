import React, { useState, useEffect } from "react";
import { WeatherData } from "../types";
import { fetchCurrentWeather } from "../api/weather";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
} from "lucide-react";

interface WeatherWidgetProps {
  currentTime: Date;
}

export default function WeatherWidget({ currentTime }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    let lat = 28.6139; // Default: New Delhi
    let lon = 77.209;

    const loadWeather = async (latitude: number, longitude: number, cityLabel: string) => {
      try {
        const data = await fetchCurrentWeather(latitude, longitude, cityLabel);
        setWeather(data);
      } catch (err) {
        setWeatherError("Failed to load weather");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadWeather(position.coords.latitude, position.coords.longitude, "Your Location");
        },
        () => {
          loadWeather(lat, lon, "New Delhi");
        }
      );
    } else {
      loadWeather(lat, lon, "New Delhi");
    }
  }, []);

  const formatClock = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} | ${strHours}:${minutes} ${ampm}`;
  };

  const getWeatherIcon = (code: number) => {
    if (code === 800 || code === 0) return <Sun className="w-16 h-16 text-yellow-400 animate-pulse" />;
    if ((code >= 801 && code <= 804) || (code >= 1 && code <= 3)) return <Cloud className="w-16 h-16 text-gray-300" />;
    if ((code >= 500 && code <= 531) || (code >= 51 && code <= 65)) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-16 h-16 text-blue-300" />;
    if ((code >= 600 && code <= 622) || (code >= 71 && code <= 75)) return <CloudSnow className="w-16 h-16 text-blue-100" />;
    if ((code >= 200 && code <= 232) || code >= 95) return <CloudLightning className="w-16 h-16 text-yellow-500 animate-bounce" />;
    return <Cloud className="w-16 h-16 text-gray-400" />;
  };

  return (
    <div
      id="widget_weather"
      className="flex flex-col bg-[#101010] rounded-3xl shadow-xl overflow-hidden min-h-[200px]"
    >
      {/* Top Bar: Date & Time Clock */}
      <div
        id="weather_top_clock"
        className="bg-[#1e1e1e] border-b border-white/5 px-6 py-4 flex items-center justify-center font-black text-base md:text-lg text-white select-none text-center"
      >
        <span id="clock_text" className="font-mono tracking-tight text-[#FF4ADE]">{formatClock(currentTime)}</span>
      </div>

      {/* Bottom: Current Status */}
      <div id="weather_stats_panel" className="p-6 flex flex-row items-center justify-between flex-1 gap-4">
        {weatherError ? (
          <div className="text-center text-sm text-gray-500 py-4 w-full">{weatherError}</div>
        ) : weather ? (
          <>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1">
                {getWeatherIcon(weather.conditionCode)}
                <span id="weather_temp_value" className="text-4xl md:text-5xl font-black tracking-tighter">
                  {weather.temp}°C
                </span>
              </div>
              <span id="weather_desc" className="text-[10px] md:text-xs font-semibold text-gray-400 tracking-wide uppercase">
                {weather.description} ({weather.city})
              </span>
            </div>

            {/* Dividers & Weather Metrics */}
            <div className="h-12 w-[1px] bg-white/10" />

            <div className="flex flex-col gap-3 text-xs font-bold text-gray-300">
              <div className="flex items-center gap-2.5">
                <Wind className="w-4 h-4 text-[#72DB73]" />
                <span>{weather.windSpeed} km/h wind</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-[#84C2FF]" />
                <span>{weather.humidity}% humidity</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Gauge className="w-4 h-4 text-[#FF4ADE]" />
                <span>{weather.pressure} mb press</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-sm text-gray-500 py-4 w-full animate-pulse">
            Fetching live weather...
          </div>
        )}
      </div>
    </div>
  );
}
