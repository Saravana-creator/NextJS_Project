import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/session";
import type { UserRole } from "@/types/auth";

type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

async function getSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const userId = payload.userId;
    const email = payload.email;
    const role = payload.role;

    if (typeof userId !== "string" || typeof email !== "string" || typeof role !== "string") {
      return null;
    }

    if (role !== "patient" && role !== "admin") {
      return null;
    }

    return { userId, email, role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");

  if (isAuthPage && session) {
    const redirectTo = session.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if ((isDashboard || isAdmin) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && session?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup"],
};
