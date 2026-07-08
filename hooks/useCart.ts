"use client";

import { useState, useCallback } from "react";
import type { MenuItem, CartItem } from "@/types";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) return prev.map((i) => i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItem, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => { setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId)); }, []);
  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) { setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId)); return; }
    setItems((prev) => prev.map((i) => i.menuItem.id === menuItemId ? { ...i, quantity } : i));
  }, []);
  const clearCart = useCallback(() => { setItems([]); }, []);

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, total, itemCount, addItem, removeItem, updateQuantity, clearCart, isEmpty: items.length === 0 };
}
