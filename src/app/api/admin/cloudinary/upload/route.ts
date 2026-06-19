import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files can be uploaded." }, { status: 400 });
    if (file.size > MAX_UPLOAD_SIZE) return NextResponse.json({ error: "Image must be under 8 MB." }, { status: 400 });

    const image = await uploadImageToCloudinary(file);
    return NextResponse.json(image);
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    const message = error instanceof Error ? error.message : "Could not upload image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
