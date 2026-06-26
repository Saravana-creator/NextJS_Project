import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Doctor } from "@/models/Doctor";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateDoctorSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.string().min(2).optional(),
  specialty: z.string().min(2).optional(),
  experience: z.string().min(1).optional(),
  credentials: z.string().min(2).optional(),
  availability: z.string().min(2).optional(),
  languages: z.array(z.string()).optional(),
  bio: z.string().min(10).optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin") {
      return jsonError("Forbidden: admin access required", 403);
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateDoctorSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const updated = await Doctor.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) return jsonError("Doctor not found", 404);

    return jsonSuccess({ doctor: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/doctors/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update doctor", 500);
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

    // Soft delete: mark inactive rather than hard delete
    const updated = await Doctor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!updated) return jsonError("Doctor not found", 404);

    return jsonSuccess({ message: "Doctor deactivated successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/doctors/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to deactivate doctor", 500);
  }
}
