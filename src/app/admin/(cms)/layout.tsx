import { AdminNav } from "@/components/admin-nav";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <div className="min-h-dvh bg-[#f3f1eb]"><AdminNav /><main className="p-5 sm:p-7 lg:ml-64 lg:p-10 xl:p-12">{children}</main></div>;
}
