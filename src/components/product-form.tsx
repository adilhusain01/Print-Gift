"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Palette, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category, Product } from "@/lib/types";

type ImageItem = {
  url: string;
  publicId?: string;
};

type VariantDraft = {
  id: string;
  name: string;
  colorHex: string;
  stock: string;
  images: ImageItem[];
};

function imageItems(images: string[] = [], publicIds: Record<string, string> = {}) {
  return images.filter(Boolean).map((url) => ({ url, publicId: publicIds[url] }));
}

function publicIdMap(images: ImageItem[]) {
  return images.reduce<Record<string, string>>((map, image) => {
    if (image.publicId) map[image.url] = image.publicId;
    return map;
  }, {});
}

function newVariant(): VariantDraft {
  return {
    id: `variant-${crypto.randomUUID().slice(0, 8)}`,
    name: "",
    colorHex: "#59614a",
    stock: "",
    images: [],
  };
}

function ImageManager({
  label,
  hint,
  images,
  uploading,
  onUpload,
  onRemove,
  onMove,
}: {
  label: string;
  hint: string;
  images: ImageItem[];
  uploading: boolean;
  onUpload: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
      <div className="grid gap-3 sm:flex sm:items-start sm:justify-between">
        <div>
          <Label className="text-xs font-semibold">{label}</Label>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(event) => onUpload(event.target.files)} />
        <Button type="button" variant="outline" className="min-h-11 w-full rounded-full bg-white sm:w-auto" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="animate-spin" /> : <ImagePlus />} Upload images
        </Button>
      </div>
      {images.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="group relative overflow-hidden rounded-lg border border-border bg-muted">
              <div className="relative aspect-square">
                <Image src={image.url} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <Button type="button" size="icon" variant="secondary" className="size-9 rounded-full bg-white/95" disabled={index === 0} onClick={() => onMove(index, -1)} aria-label="Move image left"><ArrowUp className="size-3.5 -rotate-90" /></Button>
                <Button type="button" size="icon" variant="secondary" className="size-9 rounded-full bg-white/95" disabled={index === images.length - 1} onClick={() => onMove(index, 1)} aria-label="Move image right"><ArrowDown className="size-3.5 -rotate-90" /></Button>
                <Button type="button" size="icon" variant="secondary" className="size-9 rounded-full bg-white/95 text-destructive hover:text-destructive" onClick={() => onRemove(index)} aria-label="Remove image"><Trash2 className="size-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border bg-white/60 p-5 text-sm text-muted-foreground">No images uploaded yet.</div>
      )}
    </div>
  );
}

export function ProductForm({ product, categories = [] }: { product?: Product; categories?: Category[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [images, setImages] = useState<ImageItem[]>(imageItems(product?.images, product?.imagePublicIds));
  const [variants, setVariants] = useState<VariantDraft[]>(() => product?.variants?.map((variant) => ({
    id: variant.id,
    name: variant.name,
    colorHex: variant.colorHex,
    stock: typeof variant.stock === "number" ? String(variant.stock) : "",
    images: imageItems(variant.images, variant.imagePublicIds),
  })) || []);

  async function uploadFiles(files: FileList | null, target: "product" | number) {
    if (!files?.length) return;
    const key = target === "product" ? "product" : `variant-${target}`;
    setUploadingKey(key);
    try {
      const uploaded: ImageItem[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/cloudinary/upload", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not upload image");
        uploaded.push({ url: result.url, publicId: result.publicId });
      }
      if (target === "product") {
        setImages((current) => [...current, ...uploaded]);
      } else {
        setVariants((current) => current.map((variant, index) => index === target ? { ...variant, images: [...variant.images, ...uploaded] } : variant));
      }
      toast.success(uploaded.length === 1 ? "Image uploaded" : `${uploaded.length} images uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not upload image");
    } finally {
      setUploadingKey("");
    }
  }

  async function removeImage(target: "product" | number, index: number) {
    const image = target === "product" ? images[index] : variants[target]?.images[index];
    if (!image) return;
    if (image.publicId) {
      const response = await fetch("/api/admin/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: image.publicId }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        return toast.error(result?.error || "Could not delete image from Cloudinary");
      }
    }
    if (target === "product") {
      setImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
    } else {
      setVariants((current) => current.map((variant, variantIndex) => variantIndex === target ? { ...variant, images: variant.images.filter((_, imageIndex) => imageIndex !== index) } : variant));
    }
  }

  function moveImage(target: "product" | number, index: number, direction: -1 | 1) {
    const move = (current: ImageItem[]) => {
      const next = [...current];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return current;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    };
    if (target === "product") setImages(move);
    else setVariants((current) => current.map((variant, variantIndex) => variantIndex === target ? { ...variant, images: move(variant.images) } : variant));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const cleanVariants = variants
      .map((variant) => ({
        id: variant.id,
        name: variant.name.trim(),
        colorHex: variant.colorHex,
        stock: variant.stock === "" ? undefined : Number(variant.stock),
        images: variant.images.map((image) => image.url),
        imagePublicIds: publicIdMap(variant.images),
      }))
      .filter((variant) => variant.name || variant.images.length);
    if (!images.length && !cleanVariants.some((variant) => variant.images.length)) {
      setLoading(false);
      return toast.error("Upload at least one product image.");
    }
    const response = await fetch("/api/admin/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        _id: product?._id,
        images: images.map((image) => image.url),
        imagePublicIds: publicIdMap(images),
        variants: cleanVariants,
      }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return toast.error(result.error || "Could not save product");
    toast.success(product ? "Product updated" : "Product created");
    setOpen(false);
    window.location.reload();
  }

  async function remove() {
    if (!product || !confirm(`Delete ${product.name}?`)) return;
    setLoading(true);
    const response = await fetch(`/api/admin/products?id=${product._id}`, { method: "DELETE" });
    if (!response.ok) toast.error("Could not delete product");
    else {
      toast.success("Product deleted");
      setOpen(false);
      window.location.reload();
    }
    setLoading(false);
  }

  const fields = [{ name: "name", label: "Name" }, { name: "price", label: "Retail price in INR", type: "number" }, { name: "stock", label: "Default stock", type: "number" }, { name: "tags", label: "Tags, comma separated", placeholder: "birthday, bestseller" }];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={product ? "outline" : "default"} className={`min-h-11 rounded-full ${product ? "border-border bg-white" : ""}`} />}>
        {product ? <Pencil /> : <Plus />} {product ? "Edit" : "Add product"}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-1rem)] overflow-y-auto border border-border bg-background p-4 sm:max-h-[90dvh] sm:max-w-4xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="pr-10 font-heading text-3xl">{product ? "Edit product" : "Add product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid min-w-0 gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className="grid min-w-0 gap-2">
                <Label htmlFor={field.name} className="text-xs font-semibold">{field.label}</Label>
                <Input id={field.name} name={field.name} type={field.type} placeholder={field.placeholder} defaultValue={field.name === "tags" ? product?.tags.join(", ") : product?.[field.name as keyof Product] as string | number | undefined} required className="field min-w-0" />
              </div>
            ))}
            <div className="grid min-w-0 gap-2">
              <Label htmlFor="category" className="text-xs font-semibold">Category</Label>
              <select id="category" name="category" defaultValue={product?.category || categories[0]?.slug || ""} required className="field h-11 min-w-0 px-3 text-sm">
                <option value="" disabled>Choose category</option>
                {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
            </div>
          </div>

          <ImageManager label="Product images" hint="These are used as the fallback gallery and catalog image. Drag-free reorder is handled by the arrow buttons." images={images} uploading={uploadingKey === "product"} onUpload={(files) => uploadFiles(files, "product")} onRemove={(index) => removeImage("product", index)} onMove={(index, direction) => moveImage("product", index, direction)} />

          <div className="grid min-w-0 gap-2">
            <Label htmlFor="shortDescription" className="text-xs font-semibold">Short description</Label>
            <Input id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription} required className="field min-w-0" />
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="description" className="text-xs font-semibold">Full description</Label>
            <Textarea id="description" name="description" defaultValue={product?.description} required className="field" />
          </div>

          <div className="grid gap-3 rounded-xl border border-border bg-[#eeebe3] p-4">
            <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-2xl">Color variants</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">Use this when one product has multiple colors. Each color can have its own gallery.</p>
              </div>
              <Button type="button" variant="outline" className="min-h-11 rounded-full bg-white" onClick={() => setVariants((current) => [...current, newVariant()])}><Palette /> Add color</Button>
            </div>
            {variants.length ? (
              <div className="grid gap-4">
                {variants.map((variant, variantIndex) => (
                  <div key={variant.id} className="grid gap-4 rounded-xl border border-border bg-card p-4">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px_120px_auto] sm:items-end">
                      <div className="grid gap-2">
                        <Label className="text-xs font-semibold">Color name</Label>
                        <Input value={variant.name} onChange={(event) => setVariants((current) => current.map((item, index) => index === variantIndex ? { ...item, name: event.target.value } : item))} placeholder="Matte black, Wine red..." className="field h-11" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs font-semibold">Swatch</Label>
                        <Input type="color" value={variant.colorHex} onChange={(event) => setVariants((current) => current.map((item, index) => index === variantIndex ? { ...item, colorHex: event.target.value } : item))} className="field h-11 p-1" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs font-semibold">Stock</Label>
                        <Input type="number" min="0" value={variant.stock} onChange={(event) => setVariants((current) => current.map((item, index) => index === variantIndex ? { ...item, stock: event.target.value } : item))} placeholder="Default" className="field h-11" />
                      </div>
                      <Button type="button" variant="ghost" className="min-h-11 text-destructive" onClick={() => setVariants((current) => current.filter((_, index) => index !== variantIndex))}><Trash2 /> Remove</Button>
                    </div>
                    <ImageManager label={`${variant.name || "Color"} images`} hint="These images replace the product gallery when this color is selected." images={variant.images} uploading={uploadingKey === `variant-${variantIndex}`} onUpload={(files) => uploadFiles(files, variantIndex)} onRemove={(index) => removeImage(variantIndex, index)} onMove={(index, direction) => moveImage(variantIndex, index, direction)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-white/55 p-5 text-sm text-muted-foreground">No color variants yet.</div>
            )}
          </div>

          <div className="grid gap-3 sm:flex sm:gap-5">
            <label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured</label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="customizable" defaultChecked={product?.customizable} /> Customizable</label>
          </div>
          <Button type="submit" disabled={loading || !!uploadingKey} className="min-h-11 rounded-full">{loading ? <><Loader2 className="animate-spin" /> Saving...</> : product ? "Save changes" : "Create product"}</Button>
          {product ? <Button type="button" disabled={loading} variant="ghost" onClick={remove} className="min-h-11 text-destructive"><Trash2 /> Delete product</Button> : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}
