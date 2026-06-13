import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin-login";
import { BrandLogo } from "@/components/brand-logo";
import { getAdminSession } from "@/lib/admin";
import { hasDatabase } from "@/lib/mongodb";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin/dashboard");
  return <main className="grid min-h-dvh place-items-center bg-[#eeebe3] p-5"><div className="grid w-full place-items-center gap-8"><BrandLogo /><AdminLogin databaseReady={hasDatabase()} /></div></main>;
}
