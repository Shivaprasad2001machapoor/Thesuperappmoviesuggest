import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import WeatherWidget from "../components/WeatherWidget";
import NewsWidget from "../components/NewsWidget";
import TimerWidget from "../components/TimerWidget";
import NotesWidget from "../components/NotesWidget";
import { ArrowRight, LogOut } from "lucide-react";
import userAvatar from "../assets/images/user_avatar_1782290697763.jpg";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const selectedCategories = useStore((state) => state.categories);
  const resetStore = useStore((state) => state.resetStore);

  // Time ticker state
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clockTicker = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTicker);
  }, []);

  // Protect route
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (selectedCategories.length < 3) {
      navigate("/categories");
    }
  }, [user, selectedCategories, navigate]);

  const handleLogout = () => {
    resetStore();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div
      id="dashboard_container"
      className="flex flex-col min-h-screen bg-[#000000] text-white p-4 md:p-8 lg:p-12 relative select-none overflow-x-hidden"
    >
      {/* Top action header */}
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center mb-6">
        <span className="text-sm font-black tracking-widest text-[#72DB73] uppercase">
          Dashboard
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4.5 py-2 text-xs font-black uppercase tracking-wider text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-500/10 rounded-full cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit App</span>
        </button>
      </div>

      {/* 3-Column Responsive Grid */}
      <div
        id="dashboard_widgets_grid"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-7xl mx-auto flex-1 pb-16"
      >
        {/* COLUMN 1: Profile Widget & Weather Widget */}
        <div id="col_1_left" className="flex flex-col gap-6 md:gap-8 col-span-1">
          {/* User Profile Card */}
          <div
            id="widget_user_profile"
            className="flex flex-row items-center gap-6 p-6 rounded-3xl bg-[#5746AF] shadow-xl overflow-hidden min-h-[220px]"
          >
            <div className="w-[100px] h-[100px] shrink-0 rounded-full border-4 border-white/20 overflow-hidden shadow-inner bg-indigo-900 flex items-center justify-center">
              <img
                src={userAvatar}
                alt="User Avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover scale-105 pointer-events-none select-none"
                onError={(e) => {
                  // Fallback to high-quality fallback image if let's say the avatar isn't located there
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200";
                }}
              />
            </div>
            <div className="flex flex-col gap-2 overflow-hidden">
              <h3 id="profile_name" className="text-xl font-bold truncate leading-tight">
                {user.name}
              </h3>
              <p id="profile_email" className="text-xs text-white/80 font-medium truncate">
                {user.email}
              </p>
              <h4 id="profile_username" className="text-2xl font-black tracking-tight text-white/95 mt-1 truncate">
                {user.username}
              </h4>
              {/* Category Pills List */}
              <div id="profile_category_pills" className="flex flex-wrap gap-1.5 mt-2 overflow-y-auto max-h-[80px]">
                {selectedCategories.map((id) => (
                  <span
                    key={id}
                    className="px-2.5 py-1 rounded-full bg-[#111111]/30 border border-white/10 text-[10px] font-black uppercase tracking-wider"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Widget */}
          <WeatherWidget currentTime={currentTime} />
        </div>

        {/* COLUMN 2: Notes Widget */}
        <div id="col_2_middle" className="flex flex-col col-span-1">
          <NotesWidget />
        </div>

        {/* COLUMN 3: News Feed Widget (Full Height Right panel) */}
        <div id="col_3_right" className="flex flex-col col-span-1 h-full">
          <NewsWidget />
        </div>
      </div>

      {/* TIMER BLOCK & Navigation Row */}
      <div
        id="timer_widget_row"
        className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center"
      >
        <div className="col-span-1 md:col-span-2">
          <TimerWidget />
        </div>

        {/* Next/Browse Screen Trigger - Placed bottom-right in the empty col space on desktop */}
        <div id="dashboard_navigation_col" className="flex justify-center md:justify-end py-4">
          <button
            id="browse_movies_button"
            onClick={() => navigate("/movies")}
            className="flex items-center justify-center gap-3.5 py-4 px-10 rounded-full bg-[#72DB73] text-black font-black text-base uppercase tracking-wider hover:bg-[#61ca62] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer shadow-2xl shadow-green-500/10 w-full sm:w-auto"
          >
            <span>Browse Entertainment</span>
            <ArrowRight className="w-5 h-5 stroke-[3px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
