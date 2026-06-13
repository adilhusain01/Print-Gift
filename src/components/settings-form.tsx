"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StoreSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return toast.error(result.error || "Could not save settings");
    toast.success("Store settings updated");
  }
  return <form onSubmit={submit} className="surface mt-8 grid max-w-3xl gap-5 p-6 sm:grid-cols-2 sm:p-8"><div className="grid gap-2 sm:col-span-2"><Label htmlFor="whatsappNumber" className="text-xs font-semibold">Merchant WhatsApp number</Label><Input id="whatsappNumber" name="whatsappNumber" type="tel" inputMode="numeric" autoComplete="tel" defaultValue={settings.whatsappNumber} required className="field h-12" /><p className="text-xs text-muted-foreground">Include country code without +, for example 919876543210.</p></div><div className="grid gap-2"><Label htmlFor="shippingFee" className="text-xs font-semibold">Flat shipping fee (INR)</Label><Input id="shippingFee" name="shippingFee" type="number" inputMode="numeric" min="0" defaultValue={settings.shippingFee} required className="field h-12" /></div><div className="grid gap-2"><Label htmlFor="freeShippingThreshold" className="text-xs font-semibold">Free shipping threshold</Label><Input id="freeShippingThreshold" name="freeShippingThreshold" type="number" inputMode="numeric" min="0" defaultValue={settings.freeShippingThreshold} required className="field h-12" /></div><div className="grid gap-2 sm:col-span-2"><Label htmlFor="announcement" className="text-xs font-semibold">Announcement bar</Label><Input id="announcement" name="announcement" autoComplete="off" defaultValue={settings.announcement} required className="field h-12" /></div><Button type="submit" disabled={loading} className="min-h-11 w-full justify-self-start rounded-full bg-primary px-6 text-primary-foreground sm:col-span-2 sm:w-auto">{loading ? <><Loader2 className="animate-spin" /> Saving…</> : <><Save /> Save settings</>}</Button></form>;
}
