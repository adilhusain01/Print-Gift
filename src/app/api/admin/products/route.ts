import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import slugify from "slugify";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { saveProduct } from "@/lib/data";

const schema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
  price: z.coerce.number().positive(),
  category: z.string().min(2),
  stock: z.coerce.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  tags: z.string().optional().default(""),
  shortDescription: z.string().min(5),
  description: z.string().min(10),
  featured: z.string().optional(),
  customizable: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check all product fields." }, { status: 400 });
  const data = parsed.data;
  await saveProduct({
    slug: slugify(data.name, { lower: true, strict: true }),
    name: data.name,
    price: data.price,
    category: slugify(data.category, { lower: true, strict: true }),
    stock: data.stock,
    images: data.images,
    tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    shortDescription: data.shortDescription,
    description: data.description,
    featured: data.featured === "on",
    customizable: data.customizable === "on",
    active: true,
  });
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || !parsed.data._id) return NextResponse.json({ error: "Please check all product fields." }, { status: 400 });
  const data = parsed.data;
  await saveProduct({ _id: data._id, slug: slugify(data.name, { lower: true, strict: true }), name: data.name, price: data.price, category: slugify(data.category, { lower: true, strict: true }), stock: data.stock, images: data.images, tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean), shortDescription: data.shortDescription, description: data.description, featured: data.featured === "on", customizable: data.customizable === "on", active: true });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  const { getDb } = await import("@/lib/mongodb");
  const db = await getDb();
  await db.collection("products").deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
