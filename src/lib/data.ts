import { ObjectId } from "mongodb";
import { cache } from "react";
import { demoOrders, demoProducts, demoSettings } from "@/lib/demo-data";
import { getDb, hasDatabase } from "@/lib/mongodb";
import type { Order, Product, StoreSettings } from "@/lib/types";

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!hasDatabase()) return demoProducts;
  try {
    const db = await getDb();
    const products = await db.collection<Product>("products").find({ active: true }).sort({ featured: -1, createdAt: -1 }).toArray();
    return products.length ? serialize(products) : demoProducts;
  } catch (error) {
    console.error("Falling back to demo products", error);
    return demoProducts;
  }
});

export const getAllProducts = cache(async (): Promise<Product[]> => {
  if (!hasDatabase()) return demoProducts;
  const db = await getDb();
  return serialize(await db.collection<Product>("products").find().sort({ createdAt: -1 }).toArray());
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  if (!hasDatabase()) return demoProducts.find((product) => product.slug === slug) || null;
  try {
    const db = await getDb();
    const product = await db.collection<Product>("products").findOne({ slug, active: true });
    return product ? serialize(product) : demoProducts.find((item) => item.slug === slug) || null;
  } catch (error) {
    console.error("Falling back to demo product", error);
    return demoProducts.find((product) => product.slug === slug) || null;
  }
});

export const getSettings = cache(async (): Promise<StoreSettings> => {
  if (!hasDatabase()) return demoSettings;
  try {
    const db = await getDb();
    const settings = await db.collection<StoreSettings>("settings").findOne({ key: "store" } as never);
    return settings ? serialize({ ...demoSettings, ...settings }) : demoSettings;
  } catch (error) {
    console.error("Falling back to demo settings", error);
    return demoSettings;
  }
});

export const getOrders = cache(async (): Promise<Order[]> => {
  if (!hasDatabase()) return demoOrders;
  const db = await getDb();
  return serialize(await db.collection<Order>("orders").find().sort({ createdAt: -1 }).limit(100).toArray());
});

export async function saveProduct(product: Product) {
  const db = await getDb();
  const now = new Date().toISOString();
  const payload = { ...product, updatedAt: now, createdAt: product.createdAt || now };
  if (product._id) {
    const { _id, ...data } = payload;
    await db.collection<Product>("products").updateOne({ _id: new ObjectId(_id) } as never, { $set: data });
  } else {
    await db.collection<Product>("products").insertOne(payload);
  }
}

export async function updateOrderStatus(orderNumber: string, status: Order["status"]) {
  const db = await getDb();
  await db.collection<Order>("orders").updateOne({ orderNumber }, { $set: { status, updatedAt: new Date().toISOString() } });
}
