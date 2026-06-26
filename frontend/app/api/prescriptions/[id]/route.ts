import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Prescription } from "@/models/Prescription";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updatePrescriptionSchema = z.object({
  medicines: z
    .array(
      z.object({
        medication: z.string().min(1),
        dosage: z.string().min(1),
        frequency: z.string().min(1),
        duration: z.string().min(1),
      })
    )
    .optional(),
  notes: z.string().optional(),
  status: z.enum(["active", "completed", "cancelled"]).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updatePrescriptionSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return jsonError("Prescription not found", 404);
    }

    // Authorization: Admin or the Doctor who wrote it
    const isOwner = currentUser.role === "doctor" && prescription.doctorName === currentUser.name;
    const isAdmin = currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return jsonError("Forbidden: You cannot modify this prescription", 403);
    }

    const updated = await Prescription.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true }
    );

    return jsonSuccess({ prescription: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/prescriptions/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update prescription", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const { id } = await context.params;
    await connectDB();

    const prescription = await Prescription.findById(id);
    if (!prescription) {
      return jsonError("Prescription not found", 404);
    }

    // Authorization: Admin or the Doctor who wrote it
    const isOwner = currentUser.role === "doctor" && prescription.doctorName === currentUser.name;
    const isAdmin = currentUser.role === "admin";
    if (!isOwner && !isAdmin) {
      return jsonError("Forbidden: You cannot delete this prescription", 403);
    }

    await Prescription.findByIdAndDelete(id);

    return jsonSuccess({ message: "Prescription deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/prescriptions/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to delete prescription", 500);
  }
}
