import React, { useState, useEffect } from "react";
import { NewsStory } from "../types";
import { fetchTopHeadlines } from "../api/news";
import { newsStories } from "../data/news";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NewsWidget() {
  const [stories, setStories] = useState<NewsStory[]>([]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const liveStories = await fetchTopHeadlines();
        if (liveStories && liveStories.length > 0) {
          setStories(liveStories);
          return;
        }
      } catch (e) {
        console.error("Failed to load live news, using local fallback", e);
      }
      setStories(newsStories);
    };
    loadNews();
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;
    const timer = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % stories.length);
    }, 10000); // 10 seconds is natural reading time
    return () => clearInterval(timer);
  }, [stories]);

  const activeNews = stories[currentNewsIndex] || newsStories[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stories.length === 0) return;
    setCurrentNewsIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stories.length === 0) return;
    setCurrentNewsIndex((prev) => (prev + 1) % stories.length);
  };

  return (
    <div
      id="widget_news_feed"
      className="flex flex-col bg-[#111111] border border-[#1e1e1e] rounded-3xl overflow-hidden shadow-xl h-full min-h-[440px]"
    >
      {/* Top half: Large Photo with gradient title overlay */}
      <div id="news_banner_box" className="relative h-[220px] md:h-[280px] shrink-0 overflow-hidden group/news">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img
          src={activeNews.image}
          alt={activeNews.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />

        {/* Navigation arrows overlay */}
        <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between z-20 opacity-0 group-hover/news:opacity-100 transition-opacity">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Story pagination indicator dot list */}
        {stories.length > 0 && (
          <div className="absolute top-4 right-4 z-20 flex gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/5">
            {stories.slice(0, 6).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentNewsIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentNewsIndex ? "bg-[#72DB73] w-3" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-5 z-20">
          <h4 id="news_headline" className="text-base md:text-lg font-black leading-tight text-white mb-1.5 drop-shadow-md">
            {activeNews.title}
          </h4>
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
            <span>{activeNews.source}</span>
            <span>•</span>
            <span>{activeNews.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* Bottom half: Description with scroll */}
      <div id="news_content_box" className="p-6 overflow-y-auto flex-1">
        <p id="news_body_text" className="text-xs md:text-sm text-gray-400 leading-relaxed font-semibold">
          {activeNews.description}
        </p>
      </div>
    </div>
  );
}
