import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Fast, cheap gate: only checks that an access_token cookie is present
 * before letting a request reach /admin/*. It does not verify the JWT
 * signature or expiry — every admin API call is still authorized for real
 * by the NestJS backend (JwtAuthGuard + RolesGuard), so this is purely a
 * UX shortcut to avoid flashing protected pages before redirecting.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has("access_token") || request.cookies.has("refresh_token");
  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
