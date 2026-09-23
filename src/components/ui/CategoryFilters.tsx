"use client";

import { Category } from "@/types";
import { FILTER_CATEGORIES, CATEGORY_CONFIG } from "@/lib/categories";
import { MoreHorizontal } from "lucide-react";

interface CategoryFiltersProps {
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilters({
  active,
  onChange,
}: CategoryFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTER_CATEGORIES.map((cat) => {
        const cfg = CATEGORY_CONFIG[cat];
        const Icon = cfg.icon;
        const isActive = active === cat;

        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
              whitespace-nowrap transition-all duration-200 flex-shrink-0
              ${
                isActive
                  ? "text-white shadow-glow-sm"
                  : "bg-surface border border-border text-muted hover:text-white hover:border-accent/50"
              }
            `}
            style={isActive ? { background: "#5b3df5" } : {}}
          >
            <Icon size={15} />
            {cfg.label}
          </button>
        );
      })}

      {/* Botón "Más" */}
      <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-surface border border-border text-muted hover:text-white hover:border-accent/50 whitespace-nowrap transition-all flex-shrink-0">
        <MoreHorizontal size={15} />
        Más
      </button>
    </div>
  );
}
