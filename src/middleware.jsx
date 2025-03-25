import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;
  const isAuthPath = path.startsWith("/auth");
  const isProtectedPath = path.startsWith("/dashboard") || path.startsWith("/profile") || path.startsWith("/settings");

  if (isProtectedPath && !session) {
    console.log("Redirecting to login - No session found");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isAuthPath && session) {
    console.log("Redirecting to dashboard - Session found");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

// Middleware applies to these paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/auth/:path*"],
};
