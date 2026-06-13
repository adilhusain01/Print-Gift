import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { hasDatabase } from "@/lib/mongodb";

export async function getAdminSession() {
  if (!hasDatabase()) return null;
  return auth.api.getSession({ headers: await headers() });
}

export async function requireAdmin() {
  if (!hasDatabase()) redirect("/admin?setup=required");
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  return session;
}
