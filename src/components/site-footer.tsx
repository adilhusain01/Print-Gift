import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#26231f] py-16 text-white">
      <div className="container-site grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
        <div><BrandLogo inverse /><p className="mt-6 max-w-sm text-sm leading-7 text-white/55">Considered gifts for meaningful moments, prepared with care and personally confirmed over WhatsApp.</p></div>
        <div><h3 className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">Explore</h3><div className="grid gap-3 text-sm text-white/75"><Link href="/shop">Shop all</Link><Link href="/about">Our story</Link><Link href="/faq">Frequently asked</Link></div></div>
        <div><h3 className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/40">Information</h3><div className="grid gap-3 text-sm text-white/75"><Link href="/policies">Shipping & returns</Link><Link href="/contact">Contact</Link><Link href="/admin">Merchant login</Link></div></div>
      </div>
      <div className="container-site mt-14 border-t border-white/10 pt-6 text-xs text-white/35">© {new Date().getFullYear()} PrintnGift · printngift.store</div>
    </footer>
  );
}
