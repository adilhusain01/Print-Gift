"use client";

import { useMemo, useState } from "react";
import { Check, MessageCircle } from "lucide-react";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { ProductGallery } from "@/components/product-gallery";
import { formatPrice } from "@/lib/format";
import { isBulkMode, type StoreMode } from "@/lib/store-mode";
import { productImages, productStock } from "@/lib/catalog";
import type { Product, ProductVariant } from "@/lib/types";

export function ProductPurchase({ product, storeMode }: { product: Product; storeMode: StoreMode }) {
  const variants = useMemo(() => product.variants?.filter((variant) => variant.name && variant.colorHex) || [], [product.variants]);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || "");
  const selectedVariant = useMemo<ProductVariant | null>(() => variants.find((variant) => variant.id === selectedVariantId) || null, [selectedVariantId, variants]);
  const bulkMode = isBulkMode(storeMode);
  const galleryImages = productImages(product, selectedVariant);
  const stock = productStock(product, selectedVariant);

  return (
    <section className="container-site section-space grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
      <ProductGallery key={selectedVariant?.id || "base"} images={galleryImages} name={selectedVariant ? `${product.name} in ${selectedVariant.name}` : product.name} />
      <div className="lg:sticky lg:top-32 lg:self-start lg:py-5">
        <h1 className="font-heading text-[clamp(3.2rem,6vw,5.7rem)] leading-[.92] tracking-[-0.04em]">{product.name}</h1>
        {bulkMode ? null : <p className="mt-6 text-lg font-semibold">{formatPrice(product.price)} {product.compareAtPrice ? <span className="ml-2 text-sm font-normal text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span> : null}</p>}
        <p className="mt-6 text-base leading-8 text-muted-foreground">{product.description}</p>

        {variants.length ? (
          <div className="mt-7 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Choose color</p>
              {selectedVariant ? <p className="text-sm text-muted-foreground">{selectedVariant.name}</p> : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {variants.map((variant) => {
                const selected = variant.id === selectedVariantId;
                return (
                  <button
                    type="button"
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`flex min-h-11 items-center gap-2 rounded-full border px-3 text-sm transition-colors ${selected ? "border-foreground bg-white text-foreground" : "border-border bg-white/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"}`}
                    aria-pressed={selected}
                  >
                    <span className="size-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: variant.colorHex }} />
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {bulkMode ? <div className="mt-7 rounded-lg border border-border bg-[#eeebe3] p-5"><p className="flex gap-2 text-sm font-semibold"><MessageCircle className="size-4 text-accent" /> Bulk pricing is confirmed personally</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Add products and quantities to your inquiry bag. We will quote based on quantity, personalization, and delivery timeline.</p></div> : product.customizable ? <div className="mt-7 rounded-lg border border-border bg-[#eeebe3] p-5"><p className="flex gap-2 text-sm font-semibold"><MessageCircle className="size-4 text-accent" /> Personalization is confirmed personally</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Add your initial notes at checkout. We will confirm the details and share a preview on WhatsApp.</p></div> : null}
        <AddToCartPanel product={product} storeMode={storeMode} variant={selectedVariant} />
        <div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">{["Gift-ready presentation included", bulkMode ? "Pricing confirmed on WhatsApp" : "Order confirmation on WhatsApp", stock > 0 ? `${stock} currently available` : "Made to order"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="size-4 text-accent" />{item}</p>)}</div>
      </div>
    </section>
  );
}
