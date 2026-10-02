"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, X } from "lucide-react";
import { mainNav } from "@/config/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar({ companyName }: { companyName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex size-9 items-center justify-center rounded-full bg-ink-950 text-solar-400">
            <Sun className="size-5" />
          </span>
          <span className="font-display text-lg font-bold text-ink-950">{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-mist-100",
                  active ? "text-ink-950" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="solar">
            <Link href="/contact">Get a Free Quote</Link>
          </Button>
        </div>

        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full border border-border lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-950 hover:bg-mist-100"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="solar" className="mt-2 w-full">
              <Link href="/contact" onClick={() => setOpen(false)}>
                Get a Free Quote
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
