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
import { isBulkMode } from "@/lib/store-mode";
import type { StoreSettings } from "@/lib/types";
import { useCart } from "@/stores/cart-store";

export function CheckoutForm({ settings }: { settings: StoreSettings }) {
  const { items, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const bulkMode = isBulkMode(settings.storeMode);
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
        body: JSON.stringify({ items: items.map(({ slug, quantity, variantId }) => ({ slug, quantity, variantId })), customer }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (bulkMode ? "Could not send inquiry" : "Could not create order"));
      setReference(result.inquiryReference || result.orderNumber);
      clear();
      window.location.assign(result.whatsappUrl);
    } catch (error) {
      const message = error instanceof Error && error.name === "TimeoutError"
        ? "Checkout timed out. Please try again."
        : error instanceof Error ? error.message : bulkMode ? "Could not send inquiry" : "Could not create order";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (reference) return <div className="surface mx-auto max-w-2xl p-8 text-center sm:p-12"><div className="mx-auto grid size-14 place-items-center rounded-full bg-[#59614a] text-white"><MessageCircle className="size-6" /></div><h1 className="mt-6 font-heading text-4xl">{bulkMode ? "Your inquiry is ready" : "Your order is ready"}</h1><p className="mt-3 leading-7 text-muted-foreground">Your reference is <strong className="text-foreground">{reference}</strong>. WhatsApp should now be open so we can confirm {bulkMode ? "bulk pricing, availability, customization, and timeline" : "availability, personalization, and payment"}.</p><Button nativeButton={false} render={<Link href="/shop" />} className="brutal-button mt-7 rounded-full bg-accent px-6 text-accent-foreground hover:bg-[#4d5540]">Continue browsing</Button></div>;
  if (!items.length) return <div className="surface mx-auto max-w-xl p-10 text-center"><ShoppingBag className="mx-auto size-9 text-muted-foreground" /><h1 className="mt-5 font-heading text-4xl">{bulkMode ? "Your inquiry bag is empty" : "Your gift bag is empty"}</h1><Button nativeButton={false} render={<Link href="/shop" />} className="brutal-button mt-7 rounded-full bg-accent px-6 text-accent-foreground hover:bg-[#4d5540]">Explore gifts <ArrowRight /></Button></div>;

  const fields = [{ name: "name", label: "Full name", placeholder: "Your name", type: "text", required: true }, { name: "phone", label: "Phone / WhatsApp", placeholder: "10-digit mobile number", type: "tel", required: true }, { name: "email", label: "Email (optional)", placeholder: "you@example.com", type: "email", required: false }, { name: "city", label: "City", placeholder: "City", type: "text", required: true }, { name: "postalCode", label: bulkMode ? "Postal code (optional)" : "Postal code", placeholder: "PIN code", type: "text", required: !bulkMode }, { name: "occasion", label: "Occasion (optional)", placeholder: "Birthday, anniversary…", type: "text", required: false }];
  return <form onSubmit={submit} className="grid gap-6 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] lg:items-start"><div className="surface min-w-0 p-5 sm:p-9"><h2 className="font-heading text-3xl">{bulkMode ? "Inquiry details" : "Delivery details"}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{bulkMode ? "Share enough context for us to quote bulk pricing and timeline on WhatsApp." : "We use these details only to prepare and coordinate your order."}</p><div className="mt-7 grid gap-5 sm:mt-8 sm:grid-cols-2">{fields.map((field) => <div key={field.name} className="grid min-w-0 gap-2"><Label htmlFor={field.name} className="text-xs font-semibold">{field.label}</Label><Input id={field.name} name={field.name} type={field.type} placeholder={field.placeholder} required={field.required} className="field h-12 min-w-0" /></div>)}<div className="grid min-w-0 gap-2 sm:col-span-2"><Label htmlFor="address" className="text-xs font-semibold">{bulkMode ? "Delivery address or area (optional)" : "Full delivery address"}</Label><Textarea id="address" name="address" required={!bulkMode} placeholder={bulkMode ? "City, delivery area, or addresses if known" : "House, street, landmark"} className="field min-h-24" /></div><div className="grid min-w-0 gap-2 sm:col-span-2"><Label htmlFor="giftMessage" className="text-xs font-semibold">Gift message (optional)</Label><Textarea id="giftMessage" name="giftMessage" placeholder="What should the note say?" className="field" /></div><div className="grid min-w-0 gap-2 sm:col-span-2"><Label htmlFor="notes" className="text-xs font-semibold">{bulkMode ? "Quantity, budget, deadline, or customization notes" : "Personalization or order notes (optional)"}</Label><Textarea id="notes" name="notes" placeholder={bulkMode ? "Share target quantity, event date, budget range, names, colors, or anything else" : "Names, colors, timing, or anything else we should know"} className="field" /></div></div></div><aside className="surface h-fit min-w-0 p-5 sm:p-6 lg:sticky lg:top-28"><h2 className="font-heading text-3xl">{bulkMode ? "Inquiry summary" : "Order summary"}</h2><div className="mt-6 grid gap-5">{items.map((item) => <div key={item.key || item.slug} className="grid min-w-0 grid-cols-[56px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[64px_minmax(0,1fr)_auto]"><Image src={item.images[0]} alt="" width={64} height={72} className="h-16 w-14 rounded-md object-cover sm:h-[72px] sm:w-16" /><div className="min-w-0"><p className="font-heading text-lg leading-tight">{item.name}</p>{item.variantName ? <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><span className="size-3 rounded-full border border-black/10" style={{ backgroundColor: item.variantColorHex || "#59614a" }} />{item.variantName}</p> : null}<p className="mt-1 text-xs text-muted-foreground">Quantity {item.quantity}</p></div>{bulkMode ? <span className="col-start-2 text-sm font-semibold text-muted-foreground sm:col-auto">Quote</span> : <span className="col-start-2 text-sm font-semibold sm:col-auto">{formatPrice(item.price * item.quantity)}</span>}</div>)}</div>{bulkMode ? <p className="mt-7 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">No prices are shown in bulk mode. We will quote based on quantity, product selection, customization, and timeline.</p> : <div className="mt-7 grid gap-3 border-t border-border pt-5 text-sm"><div className="flex justify-between gap-4 text-muted-foreground"><span>Subtotal</span><span className="shrink-0">{formatPrice(subtotal)}</span></div><div className="flex justify-between gap-4 text-muted-foreground"><span>Shipping</span><span className="shrink-0">{shipping ? formatPrice(shipping) : "Complimentary"}</span></div><div className="mt-2 flex justify-between gap-4 border-t border-border pt-4 text-base font-semibold"><span>Total</span><span className="shrink-0">{formatPrice(subtotal + shipping)}</span></div></div>}<Button type="submit" disabled={loading} className="brutal-button mt-7 h-12 w-full rounded-full bg-[#59614a] text-white hover:bg-[#4d5540]">{loading ? <><Loader2 className="animate-spin" /> {bulkMode ? "Preparing inquiry…" : "Creating order…"}</> : <><MessageCircle /> {bulkMode ? "Send inquiry on WhatsApp" : "Continue on WhatsApp"}</>}</Button>{errorMessage ? <p role="alert" className="mt-4 rounded-lg border border-destructive/20 bg-destructive/8 p-3 text-sm font-medium text-destructive">{errorMessage}</p> : null}<p className="mt-4 text-xs leading-5 text-muted-foreground">{bulkMode ? "Your inquiry is not saved as an order. WhatsApp opens with the full request for pricing and confirmation." : "Your order is saved first. Payment and final details are then confirmed personally on WhatsApp."}</p></aside></form>;
}
