import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MessageCircle,
  PackageCheck,
  PenLine,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { StoreShell } from "@/components/store-shell";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/demo-data";
import { getProducts, getSettings } from "@/lib/data";
import { isBulkMode } from "@/lib/store-mode";

export default async function Home() {
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);
  const bulkMode = isBulkMode(settings.storeMode);
  const featured = products.filter((product) => product.featured).slice(0, 4);

  return (
    <StoreShell>
      <section className="relative overflow-hidden">
        <div className="container-site grid min-h-[calc(100svh-108px)] items-center gap-12 py-12 lg:grid-cols-[0.88fr_1.12fr] lg:py-16">
          <div className="relative z-10 max-w-xl">
            <h1 className="mt-7 font-heading text-[clamp(3.6rem,7vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.045em]">
              A gift that feels{" "}
              <em className="font-normal text-[#7a3e3e]">considered.</em>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-muted-foreground sm:text-lg">
              Curated and personalized gifts for birthdays, milestones, and the
              quiet moments worth remembering.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                render={<Link href="/shop" />}
                size="lg"
                className="brutal-button h-12 bg-primary px-7 text-primary-foreground"
              >
                Explore the collection <ArrowRight />
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/shop?category=personalized" />}
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-border bg-transparent px-7"
              >
                Personalized gifts
              </Button>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-1 gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:grid-cols-3">
              {[
                "Gift-ready presentation",
                "Personal confirmation",
                "Thoughtful details",
              ].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="size-3.5 text-accent" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative ml-auto aspect-[4/4.7] w-[88%] overflow-hidden rounded-t-[10rem] rounded-b-2xl bg-[#ddd7ca]">
              <Image
                src="https://images.unsplash.com/photo-1590531189261-e023a9f89cb0?auto=format&fit=crop&w=1600&q=90"
                alt="A thoughtfully wrapped gift"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover saturate-[.68] contrast-[.96]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#eeebe3]">
        <div className="container-site grid divide-y divide-border py-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            [
              "Curated with intention",
              "Useful, beautiful pieces chosen for how they make someone feel.",
            ],
            [
              "Personal from the start",
              "Names, notes, colors, and details are confirmed directly with you.",
            ],
            [
              "Ready for the moment",
              "Every request is prepared with care before it leaves us.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              className="py-5 sm:px-8 sm:first:pl-0 sm:last:pr-0"
            >
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.18em]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space container-site">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="mt-4 max-w-xl font-heading text-5xl leading-none tracking-[-0.035em] sm:text-6xl">
              Shop by sentiment
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-semibold"
          >
            View all gifts{" "}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              href={`/shop?category=${category.slug}`}
              key={category.slug}
              className="group min-h-64 bg-card p-7 transition-colors hover:bg-[#eeebe3]"
            >
              <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground">
                0{index + 1}
              </span>
              <div className="mt-24 flex items-end justify-between gap-4">
                <h3 className="font-heading text-3xl leading-none">
                  {category.name}
                </h3>
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-space bg-[#eeebe3]">
        <div className="container-site">
          <div className="mb-12 max-w-2xl">
            <h2 className="mt-4 font-heading text-5xl leading-none tracking-[-0.035em] sm:text-6xl">
              Gifts people return to
            </h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Our most-requested pieces, chosen for easy giving and lasting
              appeal.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} storeMode={settings.storeMode} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-space container-site">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <h2 className="mt-5 font-heading text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl">
              Personal service, without the complication.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              The convenience of shopping online, with a real person confirming
              the details that matter.
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {[
              {
                icon: PenLine,
                n: "01",
                title: "Choose your gift",
                text: "Browse the collection by recipient, occasion, or the feeling you want to send.",
              },
              {
                icon: MessageCircle,
                n: "02",
                title: "Share the details",
                text: bulkMode ? "Your inquiry bag opens WhatsApp with products, quantities, and notes for a tailored quote." : "Checkout records your order and opens WhatsApp for personalization and final confirmation.",
              },
              {
                icon: PackageCheck,
                n: "03",
                title: "We prepare it with care",
                text: "We finish, present, and coordinate delivery while keeping you informed.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="grid gap-5 py-8 sm:grid-cols-[70px_1fr] sm:py-10"
              >
                <div className="flex items-center gap-3 sm:block">
                  <span className="text-xs tracking-[0.2em] text-muted-foreground">
                    {step.n}
                  </span>
                  <step.icon className="ml-auto size-5 text-accent sm:ml-0 sm:mt-5" />
                </div>
                <div>
                  <h3 className="font-heading text-3xl">{step.title}</h3>
                  <p className="mt-2 max-w-lg leading-7 text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#59614a] py-20 text-white sm:py-28">
        <div className="container-site max-w-4xl text-center">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/55">
            The thought is the gift
          </span>
          <p className="mt-6 font-heading text-[clamp(3rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em]">
            Something they will know was chosen for them.
          </p>
          <Button
            nativeButton={false}
            render={<Link href="/shop" />}
            size="lg"
            className="mt-9 h-12 rounded-full bg-white px-7 text-[#26231f] hover:bg-white/90"
          >
            Find their gift <ArrowRight />
          </Button>
        </div>
      </section>
    </StoreShell>
  );
}
