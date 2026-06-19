import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import slugify from "slugify";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { saveCategory } from "@/lib/data";

const schema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().optional().default(""),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default("#59614a"),
  featured: z.string().optional(),
  active: z.string().optional(),
});

function revalidateCatalog() {
  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check all category fields." }, { status: 400 });
  const data = parsed.data;
  await saveCategory({
    name: data.name,
    slug: slugify(data.name, { lower: true, strict: true }),
    description: data.description,
    color: data.color,
    featured: data.featured === "on",
    active: data.active !== "off",
  });
  revalidateCatalog();
  return NextResponse.json({ ok: true });
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || !parsed.data._id) return NextResponse.json({ error: "Please check all category fields." }, { status: 400 });
  const data = parsed.data;
  await saveCategory({
    _id: data._id,
    name: data.name,
    slug: slugify(data.name, { lower: true, strict: true }),
    description: data.description,
    color: data.color,
    featured: data.featured === "on",
    active: data.active !== "off",
  });
  revalidateCatalog();
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  const { getDb } = await import("@/lib/mongodb");
  const db = await getDb();
  await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
  revalidateCatalog();
  return NextResponse.json({ ok: true });
}
