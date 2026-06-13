import { CheckoutForm } from "@/components/checkout-form";
import { StoreShell } from "@/components/store-shell";
import { getSettings } from "@/lib/data";

export default async function CheckoutPage() {
  const settings = await getSettings();
  return <StoreShell><section className="container-site section-space"><span className="eyebrow">Order details</span><h1 className="mb-12 mt-4 font-heading text-5xl tracking-[-0.04em] sm:text-7xl">Complete your order</h1><CheckoutForm settings={settings} /></section></StoreShell>;
}
