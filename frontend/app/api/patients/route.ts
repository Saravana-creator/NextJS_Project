import { connectDB } from "@/lib/db/connect";
import { User } from "@/models/User";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const isStaff = ["admin", "doctor"].includes(currentUser.role);
    if (!isStaff) {
      return jsonError("Forbidden: staff access required", 403);
    }

    await connectDB();

    const patients = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });

    return jsonSuccess({ patients });
  } catch (error: unknown) {
    console.error("GET /api/patients Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to fetch patients", 500);
  }
}
