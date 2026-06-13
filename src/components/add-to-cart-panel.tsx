"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";
import { useCart } from "@/stores/cart-store";

export function AddToCartPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const add = useCart((state) => state.add);
  return <div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex h-12 w-fit rounded-full border border-border bg-white"><button className="grid w-11 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="size-3.5" /></button><span className="grid w-11 place-items-center border-x border-border text-sm font-semibold">{quantity}</span><button className="grid w-11 place-items-center" onClick={() => setQuantity(quantity + 1)}><Plus className="size-3.5" /></button></div><Button className="brutal-button h-12 flex-1 rounded-full bg-primary text-primary-foreground" onClick={() => { add(product, quantity); toast.success(`${product.name} added to your gift bag`); }}><ShoppingBag /> Add to gift bag</Button></div>;
}
