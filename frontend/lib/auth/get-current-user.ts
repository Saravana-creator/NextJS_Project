import { connectDB } from "@/lib/db/connect";
import { getSessionFromCookies, toSessionUser } from "@/lib/auth/session";
import { User } from "@/models/User";
import type { SessionUser } from "@/types/auth";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSessionFromCookies();
  if (!session) {
    return null;
  }

  await connectDB();

  const user = await User.findById(session.userId).select("name email role");
  if (!user) {
    return null;
  }

  return toSessionUser(user);
}
