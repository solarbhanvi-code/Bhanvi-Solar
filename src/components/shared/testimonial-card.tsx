import { Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
      {testimonial.rating && (
        <div className="flex gap-0.5" aria-label={`${testimonial.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "size-4",
                i < testimonial.rating! ? "fill-solar-500 text-solar-500" : "fill-mist-200 text-mist-200",
              )}
            />
          ))}
        </div>
      )}
      <blockquote className="flex-1 text-sm leading-relaxed text-ink-800">
        &ldquo;{testimonial.message}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3 pt-2">
        <Avatar>
          {testimonial.image && <AvatarImage src={testimonial.image} alt={testimonial.name} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-semibold text-ink-950">{testimonial.name}</div>
          {testimonial.location && (
            <div className="text-xs text-muted-foreground">{testimonial.location}</div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
