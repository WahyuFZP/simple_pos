"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  onSearch: (query: string) => void;
}

const categories = [
  { key: "semua", label: "Semua" },
  { key: "makanan", label: "Makanan" },
  { key: "minuman", label: "Minuman" },
  { key: "snack", label: "Snack" },
];

export function MenuFilter({ selected, onSelect, onSearch }: MenuFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-1.5 bg-[#F0EDE8] rounded-lg p-1">
        {categories.map((cat) => (
          <button key={cat.key} onClick={() => onSelect(cat.key)} className={cn("px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer", selected === cat.key ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#6B645C] hover:text-[#1A1A1A]")}>
            {cat.label}
          </button>
        ))}
      </div>
      <div className="relative flex-1 max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B645C]" />
        <input type="text" placeholder="Cari menu..." onChange={(e) => onSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-[#E2DCD3] rounded-lg bg-white text-sm text-[#1A1A1A] placeholder-[#6B645C] focus:outline-none focus:ring-2 focus:ring-[#C73B2B] focus:border-transparent transition" />
      </div>
    </div>
  );
}
