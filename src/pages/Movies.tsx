import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { CategoryId, Movie } from "../types";
import { categoryMovies } from "../data/movies";
import { fetchMoviesByCategory } from "../api/movies";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { Film, ArrowLeft, Loader2 } from "lucide-react";

export default function Movies() {
  const navigate = useNavigate();
  const selectedCategories = useStore((state) => state.categories);
  const user = useStore((state) => state.user);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [moviesData, setMoviesData] = useState<Record<CategoryId, Movie[]>>({} as any);
  const [loading, setLoading] = useState<boolean>(true);

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (selectedCategories.length < 3) {
      navigate("/categories");
    }
  }, [user, selectedCategories, navigate]);

  useEffect(() => {
    if (selectedCategories.length === 0) return;

    const fetchAllMovies = async () => {
      setLoading(true);
      const newMoviesData: Record<CategoryId, Movie[]> = {} as any;

      const fetchPromises = selectedCategories.map(async (catId) => {
        try {
          const liveMovies = await fetchMoviesByCategory(catId);
          if (liveMovies && liveMovies.length > 0) {
            newMoviesData[catId] = liveMovies;
            return;
          }
        } catch (e) {
          console.error(`Failed to fetch movies for category ${catId}:`, e);
        }
        // Fallback to local curated library
        newMoviesData[catId] = categoryMovies[catId] || [];
      });

      await Promise.all(fetchPromises);
      setMoviesData(newMoviesData);
      setLoading(false);
    };

    fetchAllMovies();
  }, [selectedCategories]);

  return (
    <div
      id="entertainment_discovery_container"
      className="flex flex-col min-h-screen bg-black text-white p-6 md:p-12 lg:p-16 gap-8 select-none"
    >
      {/* Header Bar */}
      <header id="discovery_header_bar" className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex flex-col gap-1.5">
          <h2 id="discovery_logo" className="text-2xl md:text-3xl font-serif text-[#72DB73] font-black tracking-tight">
            Super app
          </h2>
          <span className="text-xs text-gray-500 font-extrabold tracking-widest uppercase">
            Entertainment
          </span>
        </div>

        {/* Back to Dashboard Trigger */}
        <button
          id="btn_back_to_dashboard"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#111111] hover:bg-[#1a1a1a] border border-white/15 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#72DB73]" />
          <span>Dashboard</span>
        </button>
      </header>

      {/* Hero Invitation Panel */}
      <section
        id="discovery_hero_invitation"
        className="rounded-3xl p-6 md:p-8 bg-gradient-to-r from-[#141414] to-[#070707] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex flex-col gap-2">
          <h1 id="discovery_greeting_heading" className="text-xl md:text-2xl font-black tracking-tight text-white">
            Entertainment curated for you
          </h1>
          <p id="discovery_greeting_subtitle" className="text-xs md:text-sm text-gray-400">
            A handpicked selection of movies and shows based on your favorite genres.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-[#72DB73]"
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Lists of Categories */}
      <main id="genre_movie_lists_wrapper" className="flex-1">
        <div id="genre_movie_lists" className="flex flex-col gap-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500 font-extrabold text-sm tracking-widest uppercase">
              <Loader2 className="w-10 h-10 text-[#72DB73] animate-spin" />
              <span>Loading your entertainment feed...</span>
            </div>
          ) : (
            selectedCategories.map((catId) => {
              const movies = moviesData[catId] || [];
              if (movies.length === 0) return null;

              return (
                <section key={catId} id={`section_${catId}`} className="flex flex-col gap-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 border-b border-[#111111] pb-3">
                    <Film className="w-5 h-5 text-[#72DB73]" />
                    <h3 className="text-xl md:text-2xl font-black capitalize tracking-tight text-white">
                      {catId}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-[#1e1e1e] border border-white/5 text-[9px] font-black uppercase text-gray-400">
                      {movies.length} Films
                    </span>
                  </div>

                  {/* Horizontal Movies Row */}
                  <div
                    id={`movie_scroller_${catId}`}
                    className="flex flex-row gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
                  >
                    {movies.map((m) => (
                      <div key={m.id} className="snap-start shrink-0">
                        <MovieCard movie={m} onClick={() => setSelectedMovie(m)} />
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      </main>

      {/* Detail Overlay Dialog Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
