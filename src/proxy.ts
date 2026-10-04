import { type NextRequest, NextResponse } from "next/server";
import { SessionCookie } from "@/lib/cookies";
import { Routes, SIGNED_IN_ROUTES } from "@/lib/routes";

// Quick redirect for signed-out users. The real check is requireSession()
// in the (app) layout.

const needsSession = (pathname: string) =>
  SIGNED_IN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export function proxy(request: NextRequest) {
  if (
    needsSession(request.nextUrl.pathname) &&
    !request.cookies.has(SessionCookie.refresh)
  ) {
    return NextResponse.redirect(new URL(Routes.login, request.url));
  }
  return NextResponse.next();
}

// Matcher values must be literals, so the protected paths live in
// lib/routes and are checked above.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
