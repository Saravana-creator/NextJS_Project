import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment } from "@/models/Appointment";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
  notes: z.string().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const isStaff = ["admin", "doctor"].includes(currentUser.role);
    if (!isStaff) {
      return jsonError("Forbidden: staff access required", 403);
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return jsonError(message, 400);
    }

    await connectDB();

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return jsonError("Appointment not found", 404);
    }

    if (currentUser.role === "doctor" && appointment.doctorName !== currentUser.name) {
      return jsonError("Forbidden: You can only update appointments assigned to you", 403);
    }

    const updated = await Appointment.findByIdAndUpdate(
      id,
      {
        status: parsed.data.status,
        ...(parsed.data.notes !== undefined && { notes: parsed.data.notes }),
      },
      { new: true },
    );

    if (!updated) {
      return jsonError("Appointment not found", 404);
    }

    return jsonSuccess({ appointment: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/appointments/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update appointment", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const isAdmin = currentUser.role === "admin";
    if (!isAdmin) {
      return jsonError("Forbidden: admin access required", 403);
    }

    const { id } = await context.params;

    await connectDB();

    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) {
      return jsonError("Appointment not found", 404);
    }

    return jsonSuccess({ message: "Appointment deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/appointments/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to delete appointment", 500);
  }
}
