"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order } from "@/lib/types";

const statuses: Order["status"][] = ["new", "confirmed", "making", "ready", "completed", "cancelled"];

export function OrderStatus({ orderNumber, status }: { orderNumber: string; status: Order["status"] }) {
  const [value, setValue] = useState(status);
  async function update(next: Order["status"]) {
    setValue(next);
    const response = await fetch(`/api/admin/orders/${orderNumber}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    if (!response.ok) toast.error("Could not update status"); else toast.success("Order status updated");
  }
  return <Select value={value} onValueChange={(next) => update(next as Order["status"])}><SelectTrigger className="min-h-11 w-full rounded-full border-border bg-white capitalize sm:w-36"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((item) => <SelectItem key={item} value={item} className="capitalize">{item}</SelectItem>)}</SelectContent></Select>;
}
