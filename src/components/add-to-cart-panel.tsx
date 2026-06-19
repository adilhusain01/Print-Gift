"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { StoreMode } from "@/lib/store-mode";
import { isBulkMode } from "@/lib/store-mode";
import type { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/stores/cart-store";

export function AddToCartPanel({ product, storeMode = "retail", variant = null }: { product: Product; storeMode?: StoreMode; variant?: ProductVariant | null }) {
  const [quantity, setQuantity] = useState(1);
  const add = useCart((state) => state.add);
  const bulkMode = isBulkMode(storeMode);
  return <div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex h-12 w-full rounded-full border border-border bg-white sm:w-fit"><button type="button" className="grid min-w-12 flex-1 touch-manipulation place-items-center sm:flex-none" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus className="size-3.5" /></button><span className="grid min-w-12 place-items-center border-x border-border text-sm font-semibold tabular-nums">{quantity}</span><button type="button" className="grid min-w-12 flex-1 touch-manipulation place-items-center sm:flex-none" onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus className="size-3.5" /></button></div><Button className="brutal-button h-12 w-full rounded-full bg-accent text-accent-foreground hover:bg-[#4d5540] sm:w-auto sm:flex-1" onClick={() => { add(product, quantity, variant); toast.success(`${product.name}${variant ? ` in ${variant.name}` : ""} added to your ${bulkMode ? "inquiry" : "gift"} bag`); }}><ShoppingBag /> {bulkMode ? "Add to inquiry bag" : "Add to gift bag"}</Button></div>;
}
