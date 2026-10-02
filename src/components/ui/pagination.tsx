import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Builds the href for a given page number — lets callers keep other query params. */
  buildHref: (page: number) => string;
  className?: string;
}

function pageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({ page, totalPages, buildHref, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className={cn("flex items-center justify-center gap-1", className)} aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page <= 1}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-mist-100",
          page <= 1 && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Previous page</span>
      </Link>

      {pageList(page, totalPages).map((p, idx) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
              p === page ? "bg-ink-950 text-white" : "border border-border hover:bg-mist-100",
            )}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page >= totalPages}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-mist-100",
          page >= totalPages && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Next page</span>
      </Link>
    </nav>
  );
}
