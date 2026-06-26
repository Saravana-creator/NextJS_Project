import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { getSessionFromCookies, setSessionCookie } from "@/lib/auth/session";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return jsonError("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : null;

  if (!name || name.length < 2) {
    return jsonError("Name must be at least 2 characters.", 400);
  }

  await connectDB();

  const user = await User.findByIdAndUpdate(
    session.userId,
    { name },
    { new: true },
  ).select("-password");

  if (!user) return jsonError("User not found.", 404);

  // Re-issue the cookie so the client AuthProvider picks up the new name
  await setSessionCookie({
    userId: session.userId,
    email: session.email,
    role: session.role,
  });

  return jsonSuccess({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  });
}
