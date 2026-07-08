"use client";

import { Plus } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { MenuItem } from "@/types";

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <button onClick={() => onAdd(item)} className="group bg-white border border-[#E2DCD3] rounded-xl p-4 text-left hover:border-[#C73B2B] hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.98]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-[#1A1A1A] text-sm truncate">{item.name}</h3>
          <p className="font-utility font-bold text-lg text-[#1A1A1A] mt-1">{formatRupiah(item.price)}</p>
          <div className="mt-2">
            <Badge variant={item.category as "makanan" | "minuman" | "snack"}>{item.category}</Badge>
          </div>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#F9F7F4] group-hover:bg-[#C73B2B] group-hover:text-white transition-colors shrink-0">
          <Plus className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}
