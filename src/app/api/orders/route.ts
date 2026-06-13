import { NextResponse } from "next/server";
import { z } from "zod";
import { getProducts, getSettings } from "@/lib/data";
import { getDb, hasDatabase } from "@/lib/mongodb";
import type { Order } from "@/lib/types";

const schema = z.object({
  items: z.array(z.object({ slug: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().min(8),
    city: z.string().min(2),
    postalCode: z.string().min(4),
    occasion: z.string().optional(),
    giftMessage: z.string().max(500).optional(),
    notes: z.string().max(1000).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Please check the checkout details.", details: parsed.error.flatten() }, { status: 400 });

    const [products, settings] = await Promise.all([getProducts(), getSettings()]);
    const catalog = new Map(products.map((product) => [product.slug, product]));
    const items = parsed.data.items.map((item) => {
      const product = catalog.get(item.slug);
      if (!product) throw new Error(`Product not found: ${item.slug}`);
      return { slug: product.slug, name: product.name, price: product.price, images: product.images, customizable: product.customizable, quantity: item.quantity };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;
    const now = new Date().toISOString();
    const order: Order = {
      orderNumber: `ORD-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`,
      items,
      customer: parsed.data.customer,
      subtotal,
      shipping,
      total: subtotal + shipping,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    if (hasDatabase()) {
      const db = await getDb();
      await db.collection<Order>("orders").insertOne(order);
    }

    const lines = [
      `Hello PrintNGift, I just placed order *${order.orderNumber}*.`,
      "",
      ...order.items.map((item) => `• ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`),
      "",
      `Subtotal: ₹${order.subtotal}`,
      `Shipping: ${order.shipping ? `₹${order.shipping}` : "Free"}`,
      `*Total: ₹${order.total}*`,
      "",
      `Name: ${order.customer.name}`,
      `Phone: ${order.customer.phone}`,
      `Delivery: ${order.customer.address}, ${order.customer.city} - ${order.customer.postalCode}`,
      order.customer.occasion ? `Occasion: ${order.customer.occasion}` : "",
      order.customer.giftMessage ? `Gift message: ${order.customer.giftMessage}` : "",
      order.customer.notes ? `Notes: ${order.customer.notes}` : "",
      "",
      hasDatabase() ? "Please confirm availability and payment details." : "Demo order: please configure MongoDB Atlas before accepting live orders.",
    ].filter(Boolean);
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
    return NextResponse.json({ orderNumber: order.orderNumber, whatsappUrl, persisted: hasDatabase() });
  } catch (error) {
    console.error("Checkout failed", error);
    return NextResponse.json({ error: "Could not create the order. Please try again." }, { status: 500 });
  }
}
