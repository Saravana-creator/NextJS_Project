import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { ContactMessage } from "@/models/ContactMessage";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (!["admin", "doctor"].includes(currentUser.role)) {
      return jsonError("Forbidden: staff access required", 403);
    }

    const { id } = await context.params;
    await connectDB();

    const updated = await ContactMessage.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
    if (!updated) return jsonError("Message not found", 404);

    return jsonSuccess({ message: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/contact/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update message", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin") {
      return jsonError("Forbidden: admin access required", 403);
    }

    const { id } = await context.params;
    await connectDB();

    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) return jsonError("Message not found", 404);

    return jsonSuccess({ message: "Message deleted" });
  } catch (error: unknown) {
    console.error("DELETE /api/contact/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to delete message", 500);
  }
}
