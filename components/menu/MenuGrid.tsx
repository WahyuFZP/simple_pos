"use client";

import { useState } from "react";
import { MenuCard } from "./MenuCard";
import { MenuFilter } from "./MenuFilter";
import type { MenuItem } from "@/types";

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  const [category, setCategory] = useState("semua");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    const matchCategory = category === "semua" || item.category === category;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="h-full flex flex-col p-6">
      <MenuFilter selected={category} onSelect={setCategory} onSearch={setSearch} />
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((item) => <MenuCard key={item.id} item={item} onAdd={onAddToCart} />)}
        </div>
        {filtered.length === 0 && <div className="flex items-center justify-center h-48 text-[#6B645C]">Tidak ada menu ditemukan.</div>}
      </div>
    </div>
  );
}
