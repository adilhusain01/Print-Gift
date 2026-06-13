"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.slug === product.slug);
          if (existing) {
            return { items: state.items.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item) };
          }
          return { items: [...state.items, { slug: product.slug, name: product.name, price: product.price, images: product.images, customizable: product.customizable, quantity }] };
        }),
      remove: (slug) => set((state) => ({ items: state.items.filter((item) => item.slug !== slug) })),
      setQuantity: (slug, quantity) => set((state) => ({ items: state.items.map((item) => item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item) })),
      clear: () => set({ items: [] }),
    }),
    { name: "printngift-cart" },
  ),
);
