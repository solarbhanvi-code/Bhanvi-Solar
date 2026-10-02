"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: number | undefined;
  suffix?: string;
  label: string;
  light?: boolean;
}

function useCountUp(target: number | undefined, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target === undefined) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    let raf: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return value;
}

export function StatCard({ value, suffix = "+", label, light = true }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const animated = useCountUp(value, inView);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
      <span
        className={cn(
          "font-display text-4xl font-bold tabular-nums sm:text-5xl",
          light ? "text-white" : "text-ink-950",
        )}
      >
        {value === undefined ? "--" : `${animated}${suffix}`}
      </span>
      <span className={cn("text-sm font-medium", light ? "text-white/60" : "text-muted-foreground")}>
        {label}
      </span>
    </div>
  );
}
