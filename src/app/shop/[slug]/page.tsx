import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { StoreShell } from "@/components/store-shell";
import { getCategories, getProduct, getProducts, getSettings } from "@/lib/data";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, products, settings, categories] = await Promise.all([getProduct(slug), getProducts(), getSettings(), getCategories()]);
  if (!product) notFound();
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);
  const categoryNames = new Map(categories.map((category) => [category.slug, category.name]));
  return <StoreShell><ProductPurchase product={product} storeMode={settings.storeMode} /><section className="bg-[#eeebe3] py-20"><div className="container-site"><h2 className="mb-10 font-heading text-5xl tracking-[-0.035em]">You may also like</h2><div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.slug} product={item} storeMode={settings.storeMode} categoryName={categoryNames.get(item.category)} />)}</div></div></section></StoreShell>;
}
