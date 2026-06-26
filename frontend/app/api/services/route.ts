import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const createServiceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  icon: z.string().optional().default("tooth"),
  price: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  category: z
    .enum(["general", "cosmetic", "orthodontic", "surgical", "pediatric", "preventive"])
    .optional()
    .default("general"),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const filter = activeOnly ? { isActive: true } : {};
    const services = await Service.find(filter).sort({ title: 1 });

    return jsonSuccess({ services });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to fetch services", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin") {
      return jsonError("Forbidden: admin access required", 403);
    }

    const body = await request.json();
    const parsed = createServiceSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const existing = await Service.findOne({ slug: parsed.data.slug });
    if (existing) return jsonError("A service with this slug already exists", 409);

    const service = await Service.create(parsed.data);
    return jsonSuccess({ service }, 201);
  } catch (error: unknown) {
    console.error("POST /api/services Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to create service", 500);
  }
}
