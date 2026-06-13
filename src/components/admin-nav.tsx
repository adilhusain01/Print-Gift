"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Boxes, LayoutDashboard, LogOut, PackageOpen, Settings } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const links = [{ href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/admin/products", label: "Products", icon: Boxes }, { href: "/admin/orders", label: "Orders", icon: PackageOpen }, { href: "/admin/settings", label: "Settings", icon: Settings }];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  async function signOut() {
    await authClient.signOut();
    router.push("/admin");
    router.refresh();
  }

  return (
    <aside className="border-b border-border bg-[#26231f] p-4 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <BrandLogo inverse />
        <Button variant="ghost" size="icon" className="size-11 shrink-0 text-white/65 hover:bg-white/8 hover:text-white lg:hidden" onClick={signOut} aria-label="Sign out">
          <LogOut />
        </Button>
      </div>
      <p className="mt-8 hidden text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/35 lg:block">Store management</p>
      <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:px-0 lg:pb-0">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={`flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${pathname === link.href ? "bg-white text-foreground" : "text-white/60 hover:bg-white/8 hover:text-white"}`}>
            <link.icon className="size-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" className="mt-5 hidden min-h-11 w-full justify-start text-white/55 hover:bg-white/8 hover:text-white lg:flex" onClick={signOut}>
        <LogOut /> Sign out
      </Button>
    </aside>
  );
}
