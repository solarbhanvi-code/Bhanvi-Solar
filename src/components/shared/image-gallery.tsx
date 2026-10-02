"use client";

import { useState } from "react";
import Image from "next/image";
import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

export function ImageGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-mist-100">
        <Sun className="size-16 text-mist-300" />
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-mist-100">
        <Image
          src={current.url}
          alt={current.alt || name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        {current.caption && (
          <span className="absolute bottom-3 left-3 rounded-full bg-ink-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {current.caption}
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={img.url + idx}
              type="button"
              onClick={() => setActive(idx)}
              aria-label={`Show image ${idx + 1} of ${images.length}`}
              aria-current={idx === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                idx === active ? "border-solar-500" : "border-transparent hover:border-border",
              )}
            >
              <Image src={img.url} alt={img.alt || name} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
