"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { CartDrawer } from "@/components/cart-drawer";
import { Button } from "@/components/ui/button";
import type { StoreMode } from "@/lib/store-mode";
import { isBulkMode } from "@/lib/store-mode";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our story" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  announcement = "Gifts made personal. Orders confirmed on WhatsApp.",
  storeMode = "retail",
}: {
  announcement?: string;
  storeMode?: StoreMode;
}) {
  const bulkMode = isBulkMode(storeMode);

  return (
    <>
      {bulkMode ? null : <div className="bg-[#26231f] px-4 py-2.5 text-center text-[0.62rem] font-medium uppercase leading-5 tracking-[0.16em] text-white/85 sm:text-[0.67rem] sm:tracking-[0.2em]">{announcement}</div>}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/92 backdrop-blur-xl">
        <div className="container-site flex h-[76px] items-center justify-between gap-4">
          <BrandLogo />
          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/shop" />}
              className="brutal-button hidden h-10 bg-primary px-5 text-primary-foreground sm:inline-flex"
            >
              Explore gifts
            </Button>
            <CartDrawer storeMode={storeMode} />
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    className="size-11 rounded-full lg:hidden"
                  />
                }
              >
                <Menu />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent className="data-[side=right]:w-full border-l border-border bg-background sm:max-w-sm">
                <SheetTitle className="font-heading text-3xl font-medium">
                  Menu
                </SheetTitle>
                <nav className="mt-8 flex flex-col gap-1 px-4">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex min-h-14 items-center border-b border-border font-heading text-3xl font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
