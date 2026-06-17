"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import type { StoreMode } from "@/lib/store-mode";
import { isBulkMode } from "@/lib/store-mode";
import type { Product } from "@/lib/types";
import { useCart } from "@/stores/cart-store";

export function ProductCard({ product, storeMode = "retail" }: { product: Product; storeMode?: StoreMode }) {
  const add = useCart((state) => state.add);
  const bulkMode = isBulkMode(storeMode);

  return (
    <article className="group min-w-0">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/4.8] overflow-hidden rounded-lg bg-[#ddd8cd]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />
        {product.customizable ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] backdrop-blur">Personalizable</span>
        ) : null}
        <Button
          size="icon"
          className="absolute bottom-3 right-3 size-11 rounded-full bg-white text-foreground opacity-100 shadow-sm transition-[color,background-color,transform,opacity] hover:bg-primary hover:text-primary-foreground motion-reduce:transition-none sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          onClick={(event) => {
            event.preventDefault();
            add(product);
            toast.success(`${product.name} added to your ${bulkMode ? "inquiry" : "gift"} bag`);
          }}
        >
          <Plus />
          <span className="sr-only">Add {product.name}</span>
        </Button>
      </Link>
      <div className="pt-4">
        <p className="text-[0.64rem] font-semibold uppercase tracking-[0.17em] text-muted-foreground">{product.category.replace("-", " ")}</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <Link href={`/shop/${product.slug}`} className="font-heading text-2xl leading-tight transition-colors hover:text-accent">{product.name}</Link>
          {bulkMode ? <div className="shrink-0 pt-1 text-sm font-semibold text-muted-foreground">Quote</div> : <div className="shrink-0 pt-1 text-sm font-semibold">{formatPrice(product.price)}</div>}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
      </div>
    </article>
  );
}
