import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/data";

const schema = z.object({ status: z.enum(["new", "confirmed", "making", "ready", "completed", "cancelled"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { orderNumber } = await params;
  await updateOrderStatus(orderNumber, parsed.data.status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");
  return NextResponse.json({ ok: true });
}
