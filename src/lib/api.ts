const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "cache"> {
  /** Server-side ISR revalidation window, in seconds. Ignored on the client. */
  revalidate?: number | false;
  tags?: string[];
}

/**
 * Server Components fetch the backend directly (absolute URL, no cookies
 * needed for public GETs). Client Components go through the Next.js rewrite
 * proxy at same-origin `/api/*` so the backend's httpOnly cookies survive —
 * see next.config.ts and README > Architecture.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const isServer = typeof window === "undefined";
  const url = isServer ? `${API_BASE}/api${path}` : `/api${path}`;
  const { revalidate, tags, headers, ...init } = options;

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    ...(isServer
      ? { next: { revalidate: revalidate ?? 60, tags } }
      : { cache: "no-store" as const }),
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { message?: string | string[] };
      message = Array.isArray(body.message) ? body.message.join(", ") : (body.message ?? message);
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
