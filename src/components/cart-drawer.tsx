"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/stores/cart-store";

export function CartDrawer() {
  const { items, remove, setQuantity } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" className="relative size-10 rounded-full" />}>
          <ShoppingBag className="size-5" />
          {count > 0 ? <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">{count}</span> : null}
          <span className="sr-only">Open cart</span>
      </SheetTrigger>
      <SheetContent className="w-full border-l border-border bg-background sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-3xl font-medium">Your gift bag</SheetTitle>
          <SheetDescription>Review your picks before checkout.</SheetDescription>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="my-8 rounded-xl border border-border bg-card p-8 text-center">
              <ShoppingBag className="mx-auto mb-3 size-8" />
              <p className="font-medium">Your gift bag is empty.</p>
              <Button nativeButton={false} render={<Link href="/shop" />} className="brutal-button mt-5 rounded-full bg-primary px-6 text-primary-foreground">Explore gifts</Button>
            </div>
          ) : items.map((item) => (
            <div key={item.slug} className="grid grid-cols-[84px_1fr] gap-4 border-b border-border py-4">
              <Image src={item.images[0]} alt="" width={84} height={96} className="h-24 w-[84px] rounded-md object-cover" />
              <div>
                <div className="flex justify-between gap-2">
                  <Link href={`/shop/${item.slug}`} className="font-heading text-xl leading-tight hover:text-accent">{item.name}</Link>
                  <button className="text-muted-foreground transition-colors hover:text-destructive" onClick={() => remove(item.slug)} aria-label={`Remove ${item.name}`}><Trash2 className="size-4" /></button>
                </div>
                <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
                <div className="mt-3 inline-flex rounded-full border border-border bg-white">
                  <button className="grid size-8 place-items-center" onClick={() => setQuantity(item.slug, item.quantity - 1)} aria-label="Decrease quantity"><Minus className="size-3" /></button>
                  <span className="grid size-8 place-items-center border-x border-border text-xs font-semibold">{item.quantity}</span>
                  <button className="grid size-8 place-items-center" onClick={() => setQuantity(item.slug, item.quantity + 1)} aria-label="Increase quantity"><Plus className="size-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 ? (
          <div className="border-t border-border p-4">
            <div className="mb-4 flex justify-between text-sm font-semibold"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <Button nativeButton={false} render={<Link href="/checkout" />} className="brutal-button h-12 w-full rounded-full bg-primary text-primary-foreground">Continue to checkout</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
