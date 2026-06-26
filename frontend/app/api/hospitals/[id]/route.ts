import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Hospital } from "@/models/Hospital";
import { User } from "@/models/User";
import { Doctor } from "@/models/Doctor";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateHospitalSchema = z.object({
  name: z.string().min(2).optional(),
  emailDomain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/, "Enter a valid domain (e.g. citycare.com)")
    .optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const { id } = await params;
    await connectDB();
    const hospital = await Hospital.findById(id);
    if (!hospital) return jsonError("Hospital not found", 404);
    return jsonSuccess({ hospital });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to fetch hospital", 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateHospitalSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();
    const hospital = await Hospital.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!hospital) return jsonError("Hospital not found", 404);

    return jsonSuccess({ hospital });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to update hospital", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const { id } = await params;
    await connectDB();

    const hospital = await Hospital.findById(id);
    if (!hospital) return jsonError("Hospital not found", 404);

    // Deactivate all linked doctor user accounts
    await User.updateMany({ hospitalId: id }, { $set: { role: "patient", hospitalId: null } });
    // Deactivate all linked doctor profiles
    await Doctor.updateMany({ hospitalId: id }, { $set: { isActive: false } });
    // Delete hospital
    await Hospital.findByIdAndDelete(id);

    return jsonSuccess({ message: "Hospital deleted. All linked doctors have been deactivated." });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to delete hospital", 500);
  }
}
