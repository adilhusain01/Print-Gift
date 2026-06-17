"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StoreMode } from "@/lib/store-mode";
import type { Product } from "@/lib/types";

const filters = ["all", "personalized", "for-her", "for-him", "celebrations"];

export function ShopCatalog({ products, initialCategory = "all", storeMode = "retail" }: { products: Product[]; initialCategory?: string; storeMode?: StoreMode }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const filtered = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const haystack = `${product.name} ${product.shortDescription} ${product.tags.join(" ")}`.toLowerCase();
    return matchesCategory && haystack.includes(query.toLowerCase());
  }), [products, query, category]);

  return (
    <>
      <div className="mb-10 grid gap-5 border-y border-border py-5 lg:grid-cols-[minmax(260px,1fr)_auto] lg:items-center">
        <label className="flex items-center gap-3"><Search className="size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search gifts, moods, occasions…" autoComplete="off" className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 shadow-none focus-visible:border-foreground focus-visible:ring-0" /></label>
        <div className="flex flex-wrap gap-2">{filters.map((filter) => <Button key={filter} onClick={() => setCategory(filter)} variant="ghost" className={`min-h-11 rounded-full px-4 text-xs capitalize ${category === filter ? "bg-accent text-accent-foreground hover:bg-[#4d5540] hover:text-accent-foreground" : "border border-border/70 text-muted-foreground hover:bg-muted"}`}>{filter.replace("-", " ")}</Button>)}</div>
      </div>
      <p className="mb-7 text-sm text-muted-foreground">{filtered.length} pieces</p>
      {filtered.length ? <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((product) => <ProductCard key={product.slug} product={product} storeMode={storeMode} />)}</div> : <div className="surface p-12 text-center"><h2 className="font-heading text-3xl">Nothing matched that search</h2><p className="mt-2 text-muted-foreground">Try another phrase or browse the full collection.</p></div>}
    </>
  );
}
