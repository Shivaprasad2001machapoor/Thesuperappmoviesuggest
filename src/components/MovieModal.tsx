import React from "react";
import { Movie } from "../types";
import { X, Star, Calendar, Users, Clapperboard, Clock } from "lucide-react";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="movie_modal_backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        id="movie_modal_container"
        className="relative w-full max-w-4xl bg-[#0b0b0b] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          id="btn_close_movie_modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#1a1a1a] hover:bg-[#252525] text-white rounded-full transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Large Poster */}
        <div className="w-full md:w-[40%] aspect-[2/3] md:aspect-auto md:min-h-[480px] bg-zinc-900 relative">
          <img
            src={movie.poster}
            alt={movie.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Metadata Description */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6 overflow-y-auto max-h-[500px] md:max-h-none">
          <div className="flex flex-col gap-4">
            <h3 id="modal_movie_title" className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight pr-8">
              {movie.title}
            </h3>

            {/* Quick Badges Line */}
            <div className="flex flex-wrap items-center gap-3.5 text-xs text-gray-400 font-extrabold tracking-wide uppercase">
              <span className="flex items-center gap-1.5 text-yellow-400">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {movie.rating}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <Clock className="w-4 h-4" />
                {movie.runtime || `${100 + (movie.title.length * 3) % 65} min`}
              </span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] border border-white/5 text-[10px] text-gray-300">
                {movie.genre.split(",")[0]}
              </span>
            </div>

            <p id="modal_movie_plot" className="text-sm text-gray-400 leading-relaxed font-medium pt-2 border-t border-white/5">
              {movie.plot}
            </p>
          </div>

          <div className="flex flex-col gap-3.5 pt-4 border-t border-white/5 text-xs md:text-sm">
            <div className="flex items-start gap-2.5">
              <Clapperboard className="w-4.5 h-4.5 text-[#72DB73] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-gray-500 uppercase tracking-wider block text-[10px]">Director</span>
                <span className="text-white font-bold">{movie.director}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Users className="w-4.5 h-4.5 text-[#72DB73] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-gray-500 uppercase tracking-wider block text-[10px]">Starring Cast</span>
                <span className="text-white font-semibold">{movie.cast.join(", ")}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="w-4.5 h-4.5 text-[#72DB73] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-gray-500 uppercase tracking-wider block text-[10px]">Release Year</span>
                <span className="text-white font-bold">{movie.year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
