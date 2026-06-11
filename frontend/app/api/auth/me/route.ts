import { getCurrentUser } from "@/lib/auth/get-current-user";
import { jsonError, jsonSuccess } from "@/lib/api-response";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Not authenticated", 401);
  }

  return jsonSuccess({ user });
}
