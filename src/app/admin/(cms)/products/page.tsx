import Image from "next/image";
import { ProductForm } from "@/components/product-form";
import { Badge } from "@/components/ui/badge";
import { productPrimaryImage } from "@/lib/catalog";
import { getAllCategories, getAllProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);
  return (
    <>
      <div className="grid items-end gap-5 sm:flex sm:justify-between">
        <div>
          <h1 className="mt-4 font-heading text-4xl tracking-[-0.04em] sm:text-5xl">
            Products
          </h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} products in your catalog.
          </p>
        </div>
        <div className="justify-self-start">
          <ProductForm categories={categories} />
        </div>
      </div>
      <div className="surface mt-8 divide-y divide-border overflow-hidden">
        {products.map((product) => (
          <article
            key={product.slug}
            className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[82px_minmax(0,1fr)_auto] sm:items-center sm:p-5"
          >
            <Image
              src={productPrimaryImage(product)}
              alt=""
              width={82}
              height={92}
              className="h-[82px] w-[72px] rounded-md object-cover sm:h-[92px] sm:w-[82px]"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="min-w-0 font-heading text-xl leading-tight">
                  {product.name}
                </h2>
                {product.featured ? (
                  <Badge className="rounded-full border-0 bg-muted px-2.5 text-foreground">
                    Featured
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-xs capitalize leading-5 text-muted-foreground">
                {categories.find((category) => category.slug === product.category)?.name || product.category.replace("-", " ")} · {product.stock} in stock{product.variants?.length ? ` · ${product.variants.length} colors` : ""}
              </p>
              <p className="mt-2 text-sm font-semibold">
                {formatPrice(product.price)}
              </p>
            </div>
            <div className="col-start-2 sm:col-auto">
              <ProductForm product={product} categories={categories} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
