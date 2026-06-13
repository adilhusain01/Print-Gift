"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/types";

export function ProductForm({ product }: { product?: Product }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(product?.images.length ? product.images : [""]);

  function updateImage(index: number, value: string) {
    setImages((current) => current.map((image, imageIndex) => imageIndex === index ? value : image));
  }

  function removeImage(index: number) {
    setImages((current) => current.length === 1 ? [""] : current.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const imageUrls = images.map((image) => image.trim()).filter(Boolean);
    if (!imageUrls.length) {
      setLoading(false);
      return toast.error("Add at least one product image.");
    }
    const response = await fetch("/api/admin/products", { method: product ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, images: imageUrls, _id: product?._id }) });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return toast.error(result.error || "Could not save product");
    toast.success(product ? "Product updated" : "Product created");
    setOpen(false);
    window.location.reload();
  }
  const fields = [{ name: "name", label: "Name" }, { name: "price", label: "Price in INR", type: "number" }, { name: "category", label: "Category slug", placeholder: "personalized" }, { name: "stock", label: "Stock", type: "number" }, { name: "tags", label: "Tags, comma separated", placeholder: "birthday, bestseller" }];
  async function remove() {
    if (!product || !confirm(`Delete ${product.name}?`)) return;
    setLoading(true);
    const response = await fetch(`/api/admin/products?id=${product._id}`, { method: "DELETE" });
    if (!response.ok) toast.error("Could not delete product"); else { toast.success("Product deleted"); setOpen(false); window.location.reload(); }
    setLoading(false);
  }
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button variant={product ? "outline" : "default"} className={`min-h-11 rounded-full ${product ? "border-border bg-white" : "bg-primary text-primary-foreground"}`} />}>{product ? <Pencil /> : <Plus />} {product ? "Edit" : "Add product"}</DialogTrigger><DialogContent className="max-h-[calc(100dvh-1rem)] overflow-y-auto border border-border bg-background p-4 sm:max-h-[90dvh] sm:max-w-2xl sm:p-6"><DialogHeader><DialogTitle className="pr-10 font-heading text-3xl">{product ? "Edit product" : "Add product"}</DialogTitle></DialogHeader><form onSubmit={submit} className="grid min-w-0 gap-4 sm:grid-cols-2">{fields.map((field) => <div key={field.name} className="grid min-w-0 gap-2"><Label htmlFor={field.name} className="text-xs font-semibold">{field.label}</Label><Input id={field.name} name={field.name} type={field.type} placeholder={field.placeholder} defaultValue={field.name === "tags" ? product?.tags.join(", ") : product?.[field.name as keyof Product] as string | number | undefined} required className="field min-w-0" /></div>)}<div className="grid min-w-0 gap-3 sm:col-span-2"><div className="grid gap-3 sm:flex sm:items-end sm:justify-between"><div><Label className="text-xs font-semibold">Product images</Label><p className="mt-1 text-xs leading-5 text-muted-foreground">The first image is the primary catalog image. Add as many hosted image links as needed.</p></div><Button type="button" variant="outline" className="min-h-11 w-full rounded-full sm:w-auto sm:shrink-0" onClick={() => setImages((current) => [...current, ""])}><ImagePlus /> Add image</Button></div><div className="grid gap-3">{images.map((image, index) => <div key={index} className="grid min-w-0 gap-2 rounded-lg border border-border bg-card p-3 sm:grid-cols-[minmax(0,1fr)_auto]"><div className="grid min-w-0 gap-1.5"><Label htmlFor={`image-${index}`} className="text-[0.68rem] font-medium text-muted-foreground">{index === 0 ? "Primary image URL" : `Image ${index + 1} URL`}</Label><Input id={`image-${index}`} type="url" inputMode="url" value={image} onChange={(event) => updateImage(index, event.target.value)} placeholder="https://…" required className="field min-w-0" /></div><div className="flex justify-end gap-1 sm:items-end"><Button type="button" size="icon" variant="ghost" className="size-11" disabled={index === 0} onClick={() => moveImage(index, -1)} aria-label={`Move image ${index + 1} up`}><ArrowUp /></Button><Button type="button" size="icon" variant="ghost" className="size-11" disabled={index === images.length - 1} onClick={() => moveImage(index, 1)} aria-label={`Move image ${index + 1} down`}><ArrowDown /></Button><Button type="button" size="icon" variant="ghost" className="size-11 text-destructive" onClick={() => removeImage(index)} aria-label={`Remove image ${index + 1}`}><Trash2 /></Button></div></div>)}</div></div><div className="grid min-w-0 gap-2 sm:col-span-2"><Label htmlFor="shortDescription" className="text-xs font-semibold">Short description</Label><Input id="shortDescription" name="shortDescription" defaultValue={product?.shortDescription} required className="field min-w-0" /></div><div className="grid min-w-0 gap-2 sm:col-span-2"><Label htmlFor="description" className="text-xs font-semibold">Full description</Label><Textarea id="description" name="description" defaultValue={product?.description} required className="field" /></div><div className="grid gap-3 sm:col-span-2 sm:flex sm:gap-5"><label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="featured" defaultChecked={product?.featured} /> Featured</label><label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="customizable" defaultChecked={product?.customizable} /> Customizable</label></div><Button type="submit" disabled={loading} className="min-h-11 rounded-full bg-primary text-primary-foreground sm:col-span-2">{loading ? <><Loader2 className="animate-spin" /> Saving…</> : product ? "Save changes" : "Create product"}</Button>{product ? <Button type="button" disabled={loading} variant="ghost" onClick={remove} className="min-h-11 text-destructive sm:col-span-2"><Trash2 /> Delete product</Button> : null}</form></DialogContent></Dialog>;
}
