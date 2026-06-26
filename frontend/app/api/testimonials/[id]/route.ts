import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Testimonial } from "@/models/Testimonial";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateTestimonialSchema = z.object({
  isApproved: z.boolean().optional(),
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
    const parsed = updateTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const updated = await Testimonial.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!updated) return jsonError("Testimonial not found", 404);

    return jsonSuccess({ testimonial: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/testimonials/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update testimonial", 500);
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

    const deleted = await Testimonial.findByIdAndDelete(id);
    if (!deleted) return jsonError("Testimonial not found", 404);

    return jsonSuccess({ message: "Testimonial deleted" });
  } catch (error: unknown) {
    console.error("DELETE /api/testimonials/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to delete testimonial", 500);
  }
}
