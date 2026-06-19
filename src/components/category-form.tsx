"use client";

import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/lib/types";

export function CategoryForm({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const persisted = Boolean(category?._id);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/admin/categories", {
      method: persisted ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, _id: category?._id, active: data.active ? "on" : "off" }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) return toast.error(result.error || "Could not save category");
    toast.success(persisted ? "Category updated" : "Category created");
    setOpen(false);
    window.location.reload();
  }

  async function remove() {
    if (!category || !confirm(`Delete ${category.name}? Products using it will keep the old slug until changed.`)) return;
    setLoading(true);
    const response = await fetch(`/api/admin/categories?id=${category._id}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) return toast.error("Could not delete category");
    toast.success("Category deleted");
    setOpen(false);
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant={category ? "outline" : "default"} className={`min-h-11 rounded-full ${category ? "border-border bg-white" : ""}`} />}>
        {category ? <Pencil /> : <Plus />} {category ? "Edit" : "Add category"}
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-1rem)] overflow-y-auto border border-border bg-background p-4 sm:max-w-xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="pr-10 font-heading text-3xl">{category ? "Edit category" : "Add category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-semibold">Name</Label>
            <Input id="name" name="name" defaultValue={category?.name} required className="field h-12" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-xs font-semibold">Description</Label>
            <Textarea id="description" name="description" defaultValue={category?.description} className="field" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="color" className="text-xs font-semibold">Accent color</Label>
            <Input id="color" name="color" type="color" defaultValue={category?.color || "#59614a"} className="field h-12 p-1" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="featured" defaultChecked={category?.featured ?? true} /> Show on homepage</label>
            <label className="flex min-h-11 items-center gap-2 text-sm font-medium"><input type="checkbox" name="active" defaultChecked={category?.active ?? true} /> Active</label>
          </div>
          <Button type="submit" disabled={loading} className="min-h-11 rounded-full">{loading ? <><Loader2 className="animate-spin" /> Saving...</> : category ? "Save changes" : "Create category"}</Button>
          {persisted ? <Button type="button" disabled={loading} variant="ghost" onClick={remove} className="min-h-11 text-destructive"><Trash2 /> Delete category</Button> : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}
