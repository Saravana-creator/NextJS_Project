import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { SessionPayload, SessionUser, UserRole } from "@/types/auth";

export const SESSION_COOKIE = "dent-ist-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const VALID_ROLES: UserRole[] = ["patient", "admin", "doctor"];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Please define the JWT_SECRET environment variable in .env.local");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const userId = payload.userId;
  const email = payload.email;
  const role = payload.role;

  if (typeof userId !== "string" || typeof email !== "string" || typeof role !== "string") {
    return null;
  }

  if (!VALID_ROLES.includes(role as UserRole)) {
    return null;
  }

  const result: SessionPayload = {
    userId,
    email,
    role: role as UserRole,
  };

  if (typeof payload.name === "string") {
    result.name = payload.name;
  }

  if (typeof payload.hospitalId === "string") {
    result.hospitalId = payload.hospitalId;
  }

  return result;
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function toSessionUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: UserRole;
  hospitalId?: { toString(): string } | string | null;
}): SessionUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    hospitalId: user.hospitalId
      ? typeof user.hospitalId === "string"
        ? user.hospitalId
        : user.hospitalId.toString()
      : undefined,
  };
}

export function getRedirectForRole(role: UserRole) {
  if (role === "admin" || role === "doctor") {
    return "/admin";
  }
  return "/dashboard";
}

export function isStaffRole(role: UserRole) {
  return role === "admin" || role === "doctor";
}
