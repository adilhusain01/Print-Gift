import type { Product, ProductVariant } from "@/lib/types";

export function productImages(product: Product, variant?: ProductVariant | null) {
  const fallbackVariantImages = product.variants?.find((item) => item.images?.length)?.images || [];
  const images = variant?.images?.length ? variant.images : product.images.length ? product.images : fallbackVariantImages;
  return images.filter(Boolean);
}

export function productPrimaryImage(product: Product, variant?: ProductVariant | null) {
  return productImages(product, variant)[0] || "/og.png";
}

export function productStock(product: Product, variant?: ProductVariant | null) {
  return typeof variant?.stock === "number" ? variant.stock : product.stock;
}

export function productVariantKey(product: Product, variant?: ProductVariant | null) {
  return variant ? `${product.slug}:${variant.id}` : product.slug;
}

export function findProductVariant(product: Product, variantId?: string) {
  return product.variants?.find((variant) => variant.id === variantId) || null;
}
