import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center"
      aria-label="Print&Gift home"
    >
      <Image
        src="/logo.png"
        alt="Print&Gift"
        width={2514}
        height={479}
        priority
        className={`${compact ? "h-8 w-auto" : "h-9 w-auto sm:h-10"} max-w-[170px] object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
      />
    </Link>
  );
}
