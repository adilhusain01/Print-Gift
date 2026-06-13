import Image from "next/image";
import { ProductForm } from "@/components/product-form";
import { Badge } from "@/components/ui/badge";
import { getAllProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <><div className="flex flex-wrap items-end justify-between gap-5"><div><span className="eyebrow">Catalog</span><h1 className="mt-4 font-heading text-5xl tracking-[-0.04em]">Products</h1><p className="mt-2 text-muted-foreground">{products.length} products in your catalog.</p></div><ProductForm /></div><div className="surface mt-8 divide-y divide-border overflow-hidden">{products.map((product) => <article key={product.slug} className="grid grid-cols-[72px_1fr] gap-4 p-4 sm:grid-cols-[82px_1fr_auto_auto] sm:items-center sm:p-5"><Image src={product.images[0]} alt="" width={82} height={92} className="h-[82px] w-[72px] rounded-md object-cover sm:h-[92px] sm:w-[82px]" /><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-heading text-xl">{product.name}</h2>{product.featured ? <Badge className="rounded-full border-0 bg-muted px-2.5 text-foreground">Featured</Badge> : null}</div><p className="mt-1 text-xs capitalize text-muted-foreground">{product.category.replace("-", " ")} · {product.stock} in stock</p></div><p className="col-start-2 text-sm font-semibold sm:col-auto">{formatPrice(product.price)}</p><div className="col-start-2 sm:col-auto"><ProductForm product={product} /></div></article>)}</div></>;
}
