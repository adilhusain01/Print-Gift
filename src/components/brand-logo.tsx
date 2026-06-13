import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3"
      aria-label="PrintnGift home"
    >
      <Image
        src="/logo.png"
        alt=""
        width={42}
        height={41}
        priority
        className="size-10 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      {compact ? null : (
        <span
          className={`font-heading text-[1.35rem] font-semibold tracking-[0.03em] ${inverse ? "text-white" : "text-foreground"}`}
        >
          Print&Gift
        </span>
      )}
    </Link>
  );
}
