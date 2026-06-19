import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_USER_COOKIE,
  getUserHomePath,
  isAdminUser,
  isDonorUser,
  isValidAdminSession,
  parseAdminUser,
} from "@/lib/admin-auth";

export function proxy(request) {
  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(session)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = parseAdminUser(request.cookies.get(ADMIN_USER_COOKIE)?.value);
  const pathname = request.nextUrl.pathname;

  if (
    (pathname.startsWith("/doner") || pathname.startsWith("/api/doner")) &&
    !isDonorUser(user)
  ) {
    return NextResponse.redirect(new URL(getUserHomePath(user), request.url));
  }

  if (pathname.startsWith("/admin") && !isAdminUser(user)) {
    return NextResponse.redirect(new URL(getUserHomePath(user), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doner/:path*", "/api/doner/:path*"],
};
