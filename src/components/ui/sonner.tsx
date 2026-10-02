"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast rounded-xl border border-border bg-white text-ink-950 shadow-lg font-sans",
          description: "text-muted-foreground",
          actionButton: "bg-ink-950 text-white",
          cancelButton: "bg-mist-100 text-ink-950",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
