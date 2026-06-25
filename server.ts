import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Fallbacks imports for server-side responses
import { newsStories } from "./src/data/news.js";
import { categoryMovies } from "./src/data/movies.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- API Router ---

// 1. Weather Route: Proxies OpenWeatherMap, fallbacks to Open-Meteo
app.get("/api/weather", async (req, res) => {
  const { lat, lon, q } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  const latitude = lat ? parseFloat(lat as string) : 28.6139; // New Delhi
  const longitude = lon ? parseFloat(lon as string) : 77.209;
  const cityLabel = q ? (q as string) : "New Delhi";

  // Check if OpenWeatherMap API Key is configured properly
  if (apiKey && apiKey !== "MY_OPENWEATHERMAP_API_KEY" && apiKey.trim() !== "") {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
      if (lat && lon) {
        url += `&lat=${latitude}&lon=${longitude}`;
      } else {
        url += `&q=${encodeURIComponent(cityLabel)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return res.json({
          source: "OpenWeatherMap",
          temp: Math.round(data.main.temp),
          description: data.weather[0]?.description || "Cloudy",
          conditionCode: data.weather[0]?.id || 800,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          pressure: data.main.pressure,
          city: data.name || cityLabel,
        });
      }
    } catch (e) {
      console.error("Error fetching from OpenWeatherMap, falling back to Open-Meteo:", e);
    }
  }

  // Graceful high-quality fallback: Open-Meteo API (No auth required)
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Open-Meteo request failed");
    const data = await response.json();

    const current = data.current;
    const code = current.weather_code;

    // Translate weather code (WMO standard)
    let desc = "Cloudy";
    if (code === 0) desc = "Clear Sky";
    else if (code >= 1 && code <= 3) desc = "Partly Cloudy";
    else if (code === 45 || code === 48) desc = "Foggy";
    else if (code >= 51 && code <= 55) desc = "Drizzling";
    else if (code >= 61 && code <= 65) desc = "Heavy Rain";
    else if (code >= 71 && code <= 75) desc = "Snowing";
    else if (code >= 80 && code <= 82) desc = "Showers";
    else if (code >= 95) desc = "Thunderstorm";

    return res.json({
      source: "Open-Meteo (Keyless Fallback)",
      temp: Math.round(current.temperature_2m),
      description: desc,
      conditionCode: code,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      pressure: Math.round(current.surface_pressure),
      city: lat && lon ? "Your Location" : cityLabel,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch weather data from fallback source" });
  }
});

// 2. News Route: Proxies NewsAPI, falls back to pre-cached top stories
app.get("/api/news", async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;

  if (apiKey && apiKey !== "MY_NEWS_API_KEY" && apiKey.trim() !== "") {
    try {
      const url = `https://newsapi.org/v2/everything?q=movies+OR+cinema+OR+entertainment+OR+hollywood&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
          const mappedArticles = data.articles.map((art: any, index: number) => ({
            id: `api_news_${index}`,
            title: art.title,
            description: art.description || art.content || "Read more about this exciting update in cinema space.",
            image: art.urlToImage || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600",
            publishedAt: new Date(art.publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            source: art.source?.name || "News Feed",
          }));
          return res.json({
            source: "NewsAPI",
            stories: mappedArticles,
          });
        }
      }
    } catch (e) {
      console.error("Error fetching from NewsAPI, using fallback database:", e);
    }
  }

  // Pre-cached offline fallback
  return res.json({
    source: "Pre-Cached Database (Keyless Fallback)",
    stories: newsStories,
  });
});

// 3. Movies Route: Proxies OMDB, falls back to rich curated categories
app.get("/api/movies", async (req, res) => {
  const { category } = req.query;
  const apiKey = process.env.OMDB_API_KEY;

  const catId = (category as string) || "action";

  if (apiKey && apiKey !== "MY_OMDB_API_KEY" && apiKey.trim() !== "") {
    try {
      // Map category ID to search keywords
      const searchTerms: Record<string, string[]> = {
        action: ["Mad Max", "John Wick", "Gladiator", "Dark Knight"],
        drama: ["Shawshank", "Forrest Gump", "The Godfather", "Schindler"],
        romance: ["Titanic", "La La Land", "The Notebook", "About Time"],
        thriller: ["Inception", "Shutter Island", "Silence of the Lambs", "Se7en"],
        western: ["Good Bad Ugly", "Django Unchained", "Unforgiven", "True Grit"],
        horror: ["The Conjuring", "It Clown", "Quiet Place", "Hereditary"],
        fantasy: ["Lord of the Rings", "Harry Potter", "Avatar Pandora", "Chronicles of Narnia"],
        fiction: ["Interstellar Space", "The Matrix", "Blade Runner 2049", "Dune Arrakis"],
        music: ["Bohemian Rhapsody", "Star Is Born", "Whiplash Drum", "Sound of Music"],
      };

      const terms = searchTerms[catId] || searchTerms["action"];
      
      // Perform detail query for the matching terms to assemble standard high-quality metadata
      const moviePromises = terms.map(async (term) => {
        try {
          const searchUrl = `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(term)}`;
          const response = await fetch(searchUrl);
          if (response.ok) {
            const detail = await response.json();
            if (detail.Response === "True") {
              return {
                id: `omdb_${detail.imdbID}`,
                title: detail.Title,
                year: detail.Year,
                genre: detail.Genre,
                rating: detail.imdbRating ? `${detail.imdbRating}/10` : "8.0/10",
                director: detail.Director,
                cast: detail.Actors ? detail.Actors.split(",").map((s: string) => s.trim()) : [],
                plot: detail.Plot || "No plot synopsis currently available from the registry.",
                poster: detail.Poster !== "N/A" ? detail.Poster : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400",
                runtime: detail.Runtime || "N/A",
              };
            }
          }
        } catch (e) {
          console.error(`Error querying detail for ${term}:`, e);
        }
        return null;
      });

      const fetchedMovies = (await Promise.all(moviePromises)).filter(Boolean);
      if (fetchedMovies.length > 0) {
        return res.json({
          source: "OMDB API",
          movies: fetchedMovies,
        });
      }
    } catch (e) {
      console.error("Error fetching from OMDB API, falling back to local database:", e);
    }
  }

  // Pre-cached high-quality default fallback
  return res.json({
    source: "Pre-Cached Database (Keyless Fallback)",
    movies: categoryMovies[catId as keyof typeof categoryMovies] || categoryMovies["action"],
  });
});

// --- Vite and SPA Handler setup ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
