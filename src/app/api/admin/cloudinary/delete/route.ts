import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

const schema = z.object({
  publicId: z.string().min(2),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Missing Cloudinary public ID." }, { status: 400 });

  try {
    await deleteImageFromCloudinary(parsed.data.publicId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cloudinary delete failed", error);
    const message = error instanceof Error ? error.message : "Could not delete image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
