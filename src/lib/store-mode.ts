import type { StoreSettings } from "@/lib/types";

export type StoreMode = StoreSettings["storeMode"];

export function defaultStoreMode(): StoreMode {
  const mode = process.env.NEXT_PUBLIC_STORE_MODE || process.env.STORE_MODE;
  return mode === "bulk" ? "bulk" : "retail";
}

export function isBulkMode(mode: StoreMode) {
  return mode === "bulk";
}
