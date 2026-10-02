type AnalyticsEvent =
  | "quote_form_started"
  | "quote_submitted"
  | "whatsapp_clicked"
  | "product_viewed"
  | "calculator_used"
  | "calculator_quote_clicked";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a Google Analytics event when gtag is present (see README > Analytics
 * for wiring up NEXT_PUBLIC_GA_ID). No-ops otherwise — never throws, never
 * blocks the UI it's called from.
 */
export function trackEvent(event: AnalyticsEvent, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
