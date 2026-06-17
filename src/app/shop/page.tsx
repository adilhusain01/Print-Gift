import type { Metadata } from "next";
import { ShopCatalog } from "@/components/shop-catalog";
import { StoreShell } from "@/components/store-shell";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop gifts",
  description: "Browse thoughtful and personalized gifts from PrintNGift.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  return (
    <StoreShell>
      <section className="container-site section-space">
        <h1 className="mt-5 max-w-4xl font-heading text-[clamp(3.5rem,7vw,6.5rem)] leading-[.92] tracking-[-0.04em]">
          Chosen with care, made to feel personal.
        </h1>
        <p className="mb-12 mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          A considered edit of ready-to-gift and personalized pieces. Custom
          details are confirmed with you before we begin.
        </p>
        <ShopCatalog products={products} initialCategory={params.category} />
      </section>
    </StoreShell>
  );
}
