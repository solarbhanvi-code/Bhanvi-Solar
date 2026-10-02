import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface WhatsAppButtonProps {
  url: string;
  label?: string;
  className?: string;
  variant?: "default" | "solar" | "outline" | "icon";
}

export function WhatsAppButton({
  url,
  label = "Chat on WhatsApp",
  className,
  variant = "default",
}: WhatsAppButtonProps) {
  if (variant === "icon") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          "flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105",
          className,
        )}
      >
        <MessageCircle className="size-6" fill="currentColor" strokeWidth={0} />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        buttonVariants({ variant: variant === "outline" ? "outline" : "default" }),
        variant !== "outline" && "bg-[#25D366] text-white hover:bg-[#1ebe57]",
        className,
      )}
    >
      <MessageCircle className="size-4" fill="currentColor" strokeWidth={0} />
      {label}
    </a>
  );
}
