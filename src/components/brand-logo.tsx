import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  const logo = inverse
    ? { src: "/logo-light.png", width: 2389, height: 478 }
    : { src: "/logo-dark.png", width: 2514, height: 479 };

  return (
    <Link
      href="/"
      className="group inline-flex items-center"
      aria-label="Print&Gift home"
    >
      <Image
        src={logo.src}
        alt="Print&Gift"
        width={logo.width}
        height={logo.height}
        priority
        className={`${compact ? "h-8 w-auto" : "h-9 w-auto sm:h-10"} max-w-[170px] object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
      />
    </Link>
  );
}
