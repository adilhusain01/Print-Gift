import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { StoreShell } from "@/components/store-shell";
import { getProduct, getProducts, getSettings } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { isBulkMode } from "@/lib/store-mode";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products, settings] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!product) notFound();
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);
  const bulkMode = isBulkMode(settings.storeMode);
  return <StoreShell><section className="container-site section-space grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20"><ProductGallery images={product.images} name={product.name} /><div className="lg:sticky lg:top-32 lg:self-start lg:py-5"><h1 className="font-heading text-[clamp(3.2rem,6vw,5.7rem)] leading-[.92] tracking-[-0.04em]">{product.name}</h1>{bulkMode ? null : <p className="mt-6 text-lg font-semibold">{formatPrice(product.price)} {product.compareAtPrice ? <span className="ml-2 text-sm font-normal text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span> : null}</p>}<p className="mt-6 text-base leading-8 text-muted-foreground">{product.description}</p>{bulkMode ? <div className="mt-7 rounded-lg border border-border bg-[#eeebe3] p-5"><p className="flex gap-2 text-sm font-semibold"><MessageCircle className="size-4 text-accent" /> Bulk pricing is confirmed personally</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Add products and quantities to your inquiry bag. We will quote based on quantity, personalization, and delivery timeline.</p></div> : product.customizable ? <div className="mt-7 rounded-lg border border-border bg-[#eeebe3] p-5"><p className="flex gap-2 text-sm font-semibold"><MessageCircle className="size-4 text-accent" /> Personalization is confirmed personally</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Add your initial notes at checkout. We will confirm the details and share a preview on WhatsApp.</p></div> : null}<AddToCartPanel product={product} storeMode={settings.storeMode} /><div className="mt-8 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">{["Gift-ready presentation included", bulkMode ? "Pricing confirmed on WhatsApp" : "Order confirmation on WhatsApp", product.stock > 0 ? `${product.stock} currently available` : "Made to order"].map((item) => <p key={item} className="flex items-center gap-2"><Check className="size-4 text-accent" />{item}</p>)}</div></div></section><section className="bg-[#eeebe3] py-20"><div className="container-site"><h2 className="mb-10 font-heading text-5xl tracking-[-0.035em]">You may also like</h2><div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.slug} product={item} storeMode={settings.storeMode} />)}</div></div></section></StoreShell>;
}
