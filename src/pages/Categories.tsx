import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Category, CategoryId } from "../types";
import CategoryCard from "../components/CategoryCard";
import { AlertCircle } from "lucide-react";

const CATEGORIES: Category[] = [
  { id: "action", name: "Action", color: "#FF5209", borderColor: "#11B800", iconName: "Flame" },
  { id: "drama", name: "Drama", color: "#D7A4FF", borderColor: "#11B800", iconName: "Theater" },
  { id: "romance", name: "Romance", color: "#148A08", borderColor: "#11B800", iconName: "Heart" },
  { id: "thriller", name: "Thriller", color: "#84C2FF", borderColor: "#11B800", iconName: "Eye" },
  { id: "western", name: "Western", color: "#912500", borderColor: "#11B800", iconName: "Sun" },
  { id: "horror", name: "Horror", color: "#7358FF", borderColor: "#11B800", iconName: "Skull" },
  { id: "fantasy", name: "Fantasy", color: "#FF4ADE", borderColor: "#11B800", iconName: "Sparkles" },
  { id: "fiction", name: "Fiction", color: "#E11414", borderColor: "#11B800", iconName: "Rocket" },
  { id: "music", name: "Music", color: "#E7C100", borderColor: "#11B800", iconName: "Music" },
];

export default function Categories() {
  const navigate = useNavigate();
  const setStoreCategories = useStore((state) => state.setCategories);
  const currentCategories = useStore((state) => state.categories);

  const [selected, setSelected] = useState<CategoryId[]>(currentCategories);
  const [showError, setShowError] = useState(false);

  const toggleCategory = (id: CategoryId) => {
    setSelected((prev) => {
      const isAlreadySelected = prev.includes(id);
      let updated: CategoryId[];
      if (isAlreadySelected) {
        updated = prev.filter((catId) => catId !== id);
      } else {
        updated = [...prev, id];
      }

      if (updated.length >= 3) {
        setShowError(false);
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (selected.length < 3) {
      setShowError(true);
    } else {
      setStoreCategories(selected);
      navigate("/dashboard");
    }
  };

  return (
    <div
      id="category_onboarding_container"
      className="flex flex-col lg:flex-row min-h-screen w-full bg-[#000000] text-white p-6 md:p-12 lg:p-16 gap-8 lg:gap-12 select-none"
    >
      {/* Left Column: Title & Selected Category Pills */}
      <div
        id="category_selections_panel"
        className="flex flex-col w-full lg:w-[35%] justify-between gap-8 lg:py-4"
      >
        <div className="flex flex-col gap-6">
          <h2 id="logo_title" className="text-3xl md:text-4xl font-serif text-[#72DB73] font-black tracking-tight">
            Super app
          </h2>
          <h1
            id="onboarding_heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-none tracking-tight text-white"
          >
            Choose your <br />
            entertainment <br />
            category
          </h1>
        </div>

        {/* List of active selection chips */}
        <div className="flex flex-col gap-4 mt-4 lg:mt-0">
          <div id="selection_chips_grid" className="flex flex-wrap gap-2 max-h-[220px] overflow-y-auto">
            {selected.map((catId) => {
              const catObj = CATEGORIES.find((c) => c.id === catId);
              return (
                <div
                  key={catId}
                  id={`chip_${catId}`}
                  style={{ backgroundColor: catObj?.color || "#111111" }}
                  className="px-4 py-2 rounded-full border border-white/10 text-xs font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <span>{catId}</span>
                  <button
                    onClick={() => toggleCategory(catId)}
                    className="hover:text-black font-extrabold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Validation error feedback block */}
          {showError && (
            <div
              id="category_error_banner"
              className="flex items-center gap-2 text-red-500 font-extrabold text-xs tracking-wider uppercase mt-4 animate-bounce"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Minimum 3 categories required</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Cards Grid */}
      <div id="category_cards_panel" className="flex-1 flex flex-col justify-between gap-8">
        <div
          id="category_cards_grid"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] lg:max-h-none pr-1"
        >
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              isSelected={selected.includes(cat.id)}
              onToggle={toggleCategory}
            />
          ))}
        </div>

        {/* Bottom Button Action */}
        <div className="flex justify-end mt-4">
          <button
            id="btn_continue_to_dashboard"
            onClick={handleNext}
            className="px-10 py-4 bg-[#72DB73] hover:bg-[#61ca62] text-black font-black text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-lg shadow-[#72DB73]/10"
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}
