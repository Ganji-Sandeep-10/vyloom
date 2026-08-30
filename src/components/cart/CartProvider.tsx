"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

export interface CartLine {
  id: string; // cart item id
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  loading: boolean;
  addItem: (variantId: string, quantity?: number) => Promise<{ ok: boolean; message?: string }>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setLines(data.lines ?? []);
    } catch {
      // Network issue — keep last known cart state rather than clearing it.
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId, quantity }),
        });
        const data = await res.json();
        if (!res.ok) {
          return { ok: false, message: data.error ?? "Couldn't add to cart." };
        }
        await refresh();
        return { ok: true };
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      setLoading(true);
      try {
        await fetch(`/api/cart/${lineId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        await refresh();
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      setLoading(true);
      try {
        await fetch(`/api/cart/${lineId}`, { method: "DELETE" });
        await refresh();
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  return (
    <CartContext.Provider
      value={{ lines, count, subtotal, loading, addItem, updateQuantity, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
