import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "@/lib/auth/session";
import type { UserRole } from "@/types/auth";

type SessionPayload = {
  userId: string;
  email: string;
  role: UserRole;
};

const VALID_ROLES: UserRole[] = ["patient", "admin", "doctor"];

function isStaff(role?: string): role is "admin" | "doctor" {
  return role === "admin" || role === "doctor";
}

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

    if (!VALID_ROLES.includes(role as UserRole)) {
      return null;
    }

    return { userId, email, role: role as UserRole };
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
  const isAppointment = pathname === "/appointment" || pathname.startsWith("/appointment/");

  if (isAuthPage && session) {
    const redirectTo = isStaff(session.role) ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  if ((isDashboard || isAdmin || isAppointment) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdmin && !isStaff(session?.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAdmin && session?.role === "doctor") {
    const isAllowedDoctorRoute =
      pathname === "/admin" ||
      pathname === "/admin/appointments" ||
      pathname === "/admin/pricing" ||
      pathname === "/admin/prescriptions" ||
      pathname === "/admin/billing";
    if (!isAllowedDoctorRoute) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (isDashboard && isStaff(session?.role)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/appointment/:path*", "/login", "/signup"],
};
