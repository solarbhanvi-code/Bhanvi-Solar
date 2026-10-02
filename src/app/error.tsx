"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center gap-4 py-32 text-center">
      <AlertTriangle className="size-12 text-solar-500" />
      <h1 className="font-display text-3xl font-bold text-ink-950">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We couldn&apos;t load this page. Please try again, or contact us if the problem continues.
      </p>
      <Button variant="solar" className="mt-2" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
