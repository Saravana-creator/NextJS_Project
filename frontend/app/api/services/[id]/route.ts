import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateServiceSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  icon: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  category: z
    .enum(["general", "cosmetic", "orthodontic", "surgical", "pediatric", "preventive"])
    .optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin" && currentUser.role !== "doctor") {
      return jsonError("Forbidden: admin or doctor access required", 403);
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateServiceSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const updated = await Service.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) return jsonError("Service not found", 404);

    return jsonSuccess({ service: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/services/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update service", 500);
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

    const updated = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!updated) return jsonError("Service not found", 404);

    return jsonSuccess({ message: "Service deactivated successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/services/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to deactivate service", 500);
  }
}
