"use client";

import { useCart } from "@/hooks/useCart";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { CartPanel } from "@/components/layout/CartPanel";
import type { MenuItem } from "@/types";

export function PosClient({ items }: { items: MenuItem[] }) {
  const { items: cartItems, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-hidden">
        <MenuGrid items={items} onAddToCart={addItem} />
      </div>
      <div className="w-[380px] flex-shrink-0 border-l border-[#E2DCD3] bg-white hidden lg:flex">
        <CartPanel items={cartItems} total={total} itemCount={itemCount} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} onClearCart={clearCart} />
      </div>
    </div>
  );
}
