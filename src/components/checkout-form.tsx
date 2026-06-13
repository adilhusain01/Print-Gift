"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, MessageCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import type { StoreSettings } from "@/lib/types";
import { useCart } from "@/stores/cart-store";

export function CheckoutForm({ settings }: { settings: StoreSettings }) {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    const form = new FormData(event.currentTarget);
    const customer = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(({ slug, quantity }) => ({ slug, quantity })), customer }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create order");
      setOrderNumber(result.orderNumber);
      clear();
      window.location.assign(result.whatsappUrl);
    } catch (error) {
      const message = error instanceof Error && error.name === "TimeoutError"
        ? "Checkout timed out. Please try again."
        : error instanceof Error ? error.message : "Could not create order";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (orderNumber) return <div className="surface mx-auto max-w-2xl p-8 text-center sm:p-12"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#59614a] text-white"><MessageCircle className="size-6" /></div><h1 className="mt-6 font-heading text-4xl">Your order is ready</h1><p className="mt-3 leading-7 text-muted-foreground">Your reference is <strong className="text-foreground">{orderNumber}</strong>. WhatsApp should now be open so we can confirm availability, personalization, and payment.</p><Button nativeButton={false} render={<Link href="/shop" />} className="brutal-button mt-7 rounded-full bg-primary px-6 text-primary-foreground">Continue browsing</Button></div>;
  if (!items.length) return <div className="surface mx-auto max-w-xl p-10 text-center"><ShoppingBag className="mx-auto size-9 text-muted-foreground" /><h1 className="mt-5 font-heading text-4xl">Your gift bag is empty</h1><Button nativeButton={false} render={<Link href="/shop" />} className="brutal-button mt-7 rounded-full bg-primary px-6 text-primary-foreground">Explore gifts <ArrowRight /></Button></div>;

  const fields = [{ name: "name", label: "Full name", placeholder: "Your name", type: "text" }, { name: "phone", label: "Phone / WhatsApp", placeholder: "10-digit mobile number", type: "tel" }, { name: "email", label: "Email (optional)", placeholder: "you@example.com", type: "email" }, { name: "city", label: "City", placeholder: "City", type: "text" }, { name: "postalCode", label: "Postal code", placeholder: "PIN code", type: "text" }, { name: "occasion", label: "Occasion (optional)", placeholder: "Birthday, anniversary...", type: "text" }];
  return <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start"><div className="surface p-6 sm:p-9"><h2 className="font-heading text-3xl">Delivery details</h2><p className="mt-2 text-sm text-muted-foreground">We use these details only to prepare and coordinate your order.</p><div className="mt-8 grid gap-5 sm:grid-cols-2">{fields.map((field) => <div key={field.name} className="grid gap-2"><Label htmlFor={field.name} className="text-xs font-semibold">{field.label}</Label><Input id={field.name} name={field.name} type={field.type} placeholder={field.placeholder} required={!field.label.includes("optional")} className="field h-12" /></div>)}<div className="grid gap-2 sm:col-span-2"><Label htmlFor="address" className="text-xs font-semibold">Full delivery address</Label><Textarea id="address" name="address" required placeholder="House, street, landmark" className="field min-h-24" /></div><div className="grid gap-2 sm:col-span-2"><Label htmlFor="giftMessage" className="text-xs font-semibold">Gift message (optional)</Label><Textarea id="giftMessage" name="giftMessage" placeholder="What should the note say?" className="field" /></div><div className="grid gap-2 sm:col-span-2"><Label htmlFor="notes" className="text-xs font-semibold">Personalization or order notes (optional)</Label><Textarea id="notes" name="notes" placeholder="Names, colors, timing, or anything else we should know" className="field" /></div></div></div><aside className="surface h-fit p-6 lg:sticky lg:top-28"><h2 className="font-heading text-3xl">Order summary</h2><div className="mt-6 grid gap-5">{items.map((item) => <div key={item.slug} className="grid grid-cols-[64px_1fr_auto] items-center gap-3"><Image src={item.images[0]} alt="" width={64} height={72} className="h-[72px] w-16 rounded-md object-cover" /><div><p className="font-heading text-lg leading-tight">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">Quantity {item.quantity}</p></div><span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span></div>)}</div><div className="mt-7 grid gap-3 border-t border-border pt-5 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping ? formatPrice(shipping) : "Complimentary"}</span></div><div className="mt-2 flex justify-between border-t border-border pt-4 text-base font-semibold"><span>Total</span><span>{formatPrice(subtotal + shipping)}</span></div></div><Button type="submit" disabled={loading} className="brutal-button mt-7 h-12 w-full rounded-full bg-[#59614a] text-white hover:bg-[#4d5540]">{loading ? <><Loader2 className="animate-spin" /> Creating order...</> : <><MessageCircle /> Continue on WhatsApp</>}</Button>{errorMessage ? <p role="alert" className="mt-4 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm font-medium text-destructive">{errorMessage}</p> : null}<p className="mt-4 text-xs leading-5 text-muted-foreground">Your order is saved first. Payment and final details are then confirmed personally on WhatsApp.</p></aside></form>;
}
