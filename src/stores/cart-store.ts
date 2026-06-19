"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { productPrimaryImage, productVariantKey } from "@/lib/catalog";
import type { CartItem, Product, ProductVariant } from "@/lib/types";

type CartState = {
  items: CartItem[];
  add: (product: Product, quantity?: number, variant?: ProductVariant | null) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity = 1, variant = null) =>
        set((state) => {
          const key = productVariantKey(product, variant);
          const existing = state.items.find((item) => item.key === key);
          if (existing) {
            return { items: state.items.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item) };
          }
          return { items: [...state.items, { key, slug: product.slug, name: product.name, price: product.price, images: [productPrimaryImage(product, variant)], customizable: product.customizable, variantId: variant?.id, variantName: variant?.name, variantColorHex: variant?.colorHex, quantity }] };
        }),
      remove: (key) => set((state) => ({ items: state.items.filter((item) => item.key !== key) })),
      setQuantity: (key, quantity) => set((state) => ({ items: state.items.map((item) => item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item) })),
      clear: () => set({ items: [] }),
    }),
    { name: "printngift-cart" },
  ),
);
