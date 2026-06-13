"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const gallery = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = gallery[activeIndex] || gallery[0];

  function changeImage(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + gallery.length) % gallery.length);
  }

  return (
    <div>
      <div className="group relative aspect-[4/4.7] overflow-hidden rounded-xl bg-[#ddd8cd]">
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${name} - image ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover"
        />
        {gallery.length > 1 ? (
          <>
            <Button type="button" size="icon" variant="secondary" className="absolute left-3 top-1/2 size-11 -translate-y-1/2 rounded-full bg-white/90 opacity-100 shadow-sm backdrop-blur sm:left-4 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100" onClick={() => changeImage(-1)} aria-label="Previous product image"><ChevronLeft /></Button>
            <Button type="button" size="icon" variant="secondary" className="absolute right-3 top-1/2 size-11 -translate-y-1/2 rounded-full bg-white/90 opacity-100 shadow-sm backdrop-blur sm:right-4 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100" onClick={() => changeImage(1)} aria-label="Next product image"><ChevronRight /></Button>
            <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">{activeIndex + 1} / {gallery.length}</span>
          </>
        ) : null}
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 min-[420px]:grid-cols-5 sm:grid-cols-6">
          {gallery.map((image, index) => (
            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square w-full overflow-hidden rounded-md border-2 transition-colors ${activeIndex === index ? "border-foreground" : "border-transparent hover:border-border"}`}
              aria-label={`View product image ${index + 1}`}
              aria-pressed={activeIndex === index}
            >
              <Image src={image} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
