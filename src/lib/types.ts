export type Product = {
  _id?: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  images: string[];
  tags: string[];
  featured: boolean;
  active: boolean;
  customizable: boolean;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CartItem = Pick<
  Product,
  "slug" | "name" | "price" | "images" | "customizable"
> & {
  quantity: number;
};

export type CustomerDetails = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode: string;
  occasion?: string;
  giftMessage?: string;
  notes?: string;
};

export type Order = {
  _id?: string;
  orderNumber: string;
  items: CartItem[];
  customer: CustomerDetails;
  subtotal: number;
  shipping: number;
  total: number;
  status: "new" | "confirmed" | "making" | "ready" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type StoreSettings = {
  whatsappNumber: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcement: string;
  storeMode: "retail" | "bulk";
};
