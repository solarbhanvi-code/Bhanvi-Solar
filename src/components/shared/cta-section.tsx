import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  title: string;
  description?: string;
  whatsappUrl: string;
  className?: string;
}

export function CtaSection({ title, description, whatsappUrl, className }: CtaSectionProps) {
  return (
    <section className={cn("relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-16 sm:px-12 sm:py-20", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-solar-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-energy-500/20 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
        {description && <p className="text-base text-white/70">{description}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="solar" size="lg">
            <Link href="/contact">
              Get Free Quote
              <ArrowRight />
            </Link>
          </Button>
          <WhatsAppButton url={whatsappUrl} label="Talk on WhatsApp" className="h-14 px-8 text-base" />
        </div>
      </div>
    </section>
  );
}
