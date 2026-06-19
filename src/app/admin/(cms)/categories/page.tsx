import { CategoryForm } from "@/components/category-form";
import { getAllCategories } from "@/lib/data";

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  return (
    <>
      <div className="grid items-end gap-5 sm:flex sm:justify-between">
        <div>
          <h1 className="mt-4 font-heading text-4xl tracking-[-0.04em] sm:text-5xl">Categories</h1>
          <p className="mt-2 text-muted-foreground">Manage homepage category cards, shop filters, and product assignment.</p>
        </div>
        <div className="justify-self-start">
          <CategoryForm />
        </div>
      </div>
      <div className="surface mt-8 grid gap-px overflow-hidden bg-border sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.slug} className="bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full" style={{ backgroundColor: category.color || "#59614a" }} />
                  <h2 className="font-heading text-2xl leading-tight">{category.name}</h2>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{category.description || "No description added."}</p>
                <p className="mt-3 text-xs text-muted-foreground">{category.slug} · {category.active ? "Active" : "Hidden"} · {category.featured ? "Homepage" : "Shop only"}</p>
              </div>
              <CategoryForm category={category} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
