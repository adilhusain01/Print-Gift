"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLogin({ databaseReady }: { databaseReady: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);
    const result = await authClient.signIn.email({ email: String(data.get("email")), password: String(data.get("password")) });
    setLoading(false);
    if (result.error) return toast.error(result.error.message || "Could not sign in");
    router.push("/admin/dashboard");
    router.refresh();
  }
  return <form onSubmit={submit} className="surface w-full max-w-md p-7 sm:p-10"><div className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground"><LockKeyhole className="size-5" /></div><h1 className="mt-6 font-heading text-4xl text-balance">Merchant sign in</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">{databaseReady ? "Access products, orders, and store settings." : "Add MongoDB Atlas environment variables before using the CMS."}</p><div className="mt-8 grid gap-5"><div className="grid gap-2"><Label htmlFor="email" className="text-xs font-semibold">Email</Label><Input id="email" name="email" type="email" autoComplete="username" spellCheck={false} required className="field h-12" /></div><div className="grid gap-2"><Label htmlFor="password" className="text-xs font-semibold">Password</Label><Input id="password" name="password" type="password" autoComplete="current-password" required className="field h-12" /></div><Button type="submit" disabled={loading || !databaseReady} className="brutal-button h-12 rounded-full">{loading ? <><Loader2 className="animate-spin" /> Signing in…</> : "Sign in"}</Button></div></form>;
}
