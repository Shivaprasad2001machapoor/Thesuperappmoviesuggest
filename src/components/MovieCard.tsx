import React from "react";
import { Movie } from "../types";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      id={`movie_card_${movie.id}`}
      onClick={onClick}
      className="group flex-none w-[150px] md:w-[180px] bg-[#141414] rounded-2xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-black/60 relative border border-white/5 hover:border-white/20 select-none"
    >
      {/* Poster image */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        <img
          src={movie.poster}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Rating badge overlay */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/15 text-[10px] font-extrabold flex items-center gap-1 text-yellow-400 z-10 shadow-sm">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span>{movie.rating}</span>
        </div>
      </div>

      {/* Info footer */}
      <div className="p-3 flex flex-col gap-1">
        <h4 className="text-xs md:text-sm font-black text-white group-hover:text-[#72DB73] truncate transition-colors tracking-tight">
          {movie.title}
        </h4>
        <span className="text-[10px] font-bold text-gray-500">{movie.year}</span>
      </div>
    </div>
  );
}
