import Link from "next/link";
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-4 py-32 text-center">
      <Sun className="size-12 text-solar-400" />
      <h1 className="font-display text-3xl font-bold text-ink-950">Page not found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
      </p>
      <Button asChild variant="solar" className="mt-2">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
