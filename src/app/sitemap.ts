import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.printngift.store";
  const products = await getProducts();
  return ["", "/shop", "/about", "/faq", "/contact", "/policies"].map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const })).concat(products.map((product) => ({ url: `${base}/shop/${product.slug}`, changeFrequency: "weekly" as const })));
}
