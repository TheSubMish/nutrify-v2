import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Check if the user is authenticated
  console.log("Session:", session);
  console.log("Session data:", session?.user);
  

  const isAuthPath = req.nextUrl.pathname.startsWith('/auth');
  const isProtectedPath = ['/dashboard', '/profile', '/settings'].some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Middleware applies to these paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/auth/:path*"],
};
