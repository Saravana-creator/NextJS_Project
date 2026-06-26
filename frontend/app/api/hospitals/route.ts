import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Hospital } from "@/models/Hospital";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const createHospitalSchema = z.object({
  name: z.string().min(2, "Hospital name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  emailDomain: z
    .string()
    .min(3, "Email domain is required")
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, "Enter a valid domain (e.g. citycare.com)"),
  address: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return jsonError("Admin access required", 403);
    }

    await connectDB();
    const hospitals = await Hospital.find({}).sort({ name: 1 });
    return jsonSuccess({ hospitals });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to fetch hospitals", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const body = await request.json();
    const parsed = createHospitalSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const existing = await Hospital.findOne({
      $or: [{ slug: parsed.data.slug }, { emailDomain: parsed.data.emailDomain }],
    });
    if (existing) {
      return jsonError("A hospital with this slug or email domain already exists", 409);
    }

    const hospital = await Hospital.create(parsed.data);
    return jsonSuccess({ hospital }, 201);
  } catch (error: unknown) {
    console.error("POST /api/hospitals Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to create hospital", 500);
  }
}
