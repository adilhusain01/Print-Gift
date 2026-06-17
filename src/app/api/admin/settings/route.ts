import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

const schema = z.object({ whatsappNumber: z.string().regex(/^\d{10,15}$/), shippingFee: z.coerce.number().min(0), freeShippingThreshold: z.coerce.number().min(0), announcement: z.string().min(3).max(160), storeMode: z.enum(["retail", "bulk"]) });

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the settings values." }, { status: 400 });
  const db = await getDb();
  await db.collection("settings").updateOne({ key: "store" }, { $set: parsed.data }, { upsert: true });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
