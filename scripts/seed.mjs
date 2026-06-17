import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");
const client = new MongoClient(uri);
const db = client.db(process.env.MONGODB_DB || "printngift");

const products = [
  { slug: "memory-lane-photo-frame", name: "Memory Lane Photo Frame", shortDescription: "A layered keepsake frame made around your favorite moment.", description: "Send us your photo and message. We compose, print, and finish every frame by hand before sharing a preview with you on WhatsApp.", price: 1299, compareAtPrice: 1599, category: "personalized", images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=1200&q=85"], tags: ["bestseller", "anniversary"], featured: true, active: true, customizable: true, stock: 18 },
  { slug: "sunshine-gift-box", name: "Sunshine Gift Box", shortDescription: "A bright box of little joys for instant good moods.", description: "A ready-to-gift edit with a candle, treats, a keepsake card, and cheerful details.", price: 1799, category: "for-her", images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=85"], tags: ["birthday", "ready-to-gift"], featured: true, active: true, customizable: true, stock: 12 },
  { slug: "desk-reset-kit", name: "Desk Reset Kit", shortDescription: "Useful, handsome desk pieces packed as a thoughtful reset.", description: "A practical gift for new roles, new offices, or anyone who deserves a tidier workday.", price: 1499, category: "for-him", images: ["https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1200&q=85"], tags: ["work", "minimal"], featured: true, active: true, customizable: false, stock: 9 },
  { slug: "celebration-mini-hamper", name: "Celebration Mini Hamper", shortDescription: "Small in size, properly celebratory in spirit.", description: "An easy crowd-pleaser with sweet treats, confetti details, and your handwritten note.", price: 999, category: "celebrations", images: ["https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1200&q=85"], tags: ["quick-gift", "birthday"], featured: false, active: true, customizable: true, stock: 25 },
];

const now = new Date().toISOString();
await db.collection("products").deleteMany({});
await db.collection("products").insertMany(products.map((product) => ({ ...product, createdAt: now, updatedAt: now })));
await db.collection("settings").updateOne({ key: "store" }, { $set: { whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999", shippingFee: 99, freeShippingThreshold: 1999, announcement: "Free shipping on orders above ₹1,999", storeMode: process.env.NEXT_PUBLIC_STORE_MODE === "bulk" || process.env.STORE_MODE === "bulk" ? "bulk" : "retail" } }, { upsert: true });
await client.close();
console.log(`Seeded ${products.length} products and store settings.`);
