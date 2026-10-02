import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const AVAILABILITY_LABEL: Record<Product["availability"], string> = {
  IN_STOCK: "In Stock",
  OUT_OF_STOCK: "Out of Stock",
  PRE_ORDER: "Pre-Order",
};

export function ProductCard({ product }: { product: Product }) {
  const category = typeof product.category === "string" ? undefined : product.category;
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-mist-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Zap className="size-10 text-mist-300" />
          </div>
        )}
        {product.featured && (
          <Badge variant="solar" className="absolute left-3 top-3 bg-solar-500 text-ink-950">
            Featured
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wide text-energy-600">
            {category.name}
          </span>
        )}
        <h3 className="font-display text-base font-semibold text-ink-950 line-clamp-2">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-semibold text-ink-950">
            {product.price ? formatCurrency(product.price) : "Request Quote"}
          </span>
          <Badge variant={product.availability === "IN_STOCK" ? "energy" : "muted"}>
            {AVAILABILITY_LABEL[product.availability]}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
