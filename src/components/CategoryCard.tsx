import React from "react";
import { Category, CategoryId } from "../types";
import {
  Flame,
  Theater,
  Heart,
  Eye,
  Sun,
  Skull,
  Sparkles,
  Rocket,
  Music,
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onToggle: (id: CategoryId) => void;
}

export default function CategoryCard({
  category,
  isSelected,
  onToggle,
}: CategoryCardProps) {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return <Flame className="w-12 h-12 stroke-[1.25]" />;
      case "Theater":
        return <Theater className="w-12 h-12 stroke-[1.25]" />;
      case "Heart":
        return <Heart className="w-12 h-12 stroke-[1.25] fill-white/10" />;
      case "Eye":
        return <Eye className="w-12 h-12 stroke-[1.25]" />;
      case "Sun":
        return <Sun className="w-12 h-12 stroke-[1.25]" />;
      case "Skull":
        return <Skull className="w-12 h-12 stroke-[1.25]" />;
      case "Sparkles":
        return <Sparkles className="w-12 h-12 stroke-[1.25]" />;
      case "Rocket":
        return <Rocket className="w-12 h-12 stroke-[1.25]" />;
      case "Music":
        return <Music className="w-12 h-12 stroke-[1.25]" />;
      default:
        return null;
    }
  };

  return (
    <div
      id={`category_card_${category.id}`}
      onClick={() => onToggle(category.id)}
      style={{ backgroundColor: category.color }}
      className={`relative rounded-3xl p-5 md:p-6 flex flex-col justify-between aspect-square cursor-pointer overflow-hidden select-none hover:scale-[1.03] transition-all duration-300 shadow-lg ${
        isSelected
          ? "border-4 border-[#11B800] ring-4 ring-[#11B800]/20"
          : "border border-white/5"
      }`}
    >
      {/* Title */}
      <h4 className="text-xl md:text-2xl font-black text-white tracking-tight capitalize select-none leading-none">
        {category.name}
      </h4>

      {/* Icon Wrapper */}
      <div className="flex justify-end select-none">
        <div className="text-white transform group-hover:scale-105 transition-transform">
          {renderIcon(category.iconName)}
        </div>
      </div>
    </div>
  );
}
