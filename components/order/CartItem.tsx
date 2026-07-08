import { Minus, Plus, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const subtotal = item.menuItem.price * item.quantity;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#E2DCD3] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.menuItem.name}</p>
        <p className="text-xs text-[#6B645C] font-utility">Rp{formatNumber(item.menuItem.price)} / item</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)} className="flex items-center justify-center w-7 h-7 rounded-md border border-[#E2DCD3] text-[#6B645C] hover:bg-[#F0EDE8] transition cursor-pointer"><Minus className="h-3 w-3" /></button>
        <span className="w-8 text-center text-sm font-utility font-medium">{item.quantity}</span>
        <button onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)} className="flex items-center justify-center w-7 h-7 rounded-md border border-[#E2DCD3] text-[#6B645C] hover:bg-[#F0EDE8] transition cursor-pointer"><Plus className="h-3 w-3" /></button>
      </div>
      <div className="text-right min-w-[80px]"><p className="text-sm font-utility font-semibold text-[#1A1A1A]">Rp{formatNumber(subtotal)}</p></div>
      <button onClick={() => onRemove(item.menuItem.id)} className="text-[#6B645C] hover:text-red-500 p-1 rounded transition cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
    </div>
  );
}
