import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Doctor } from "@/models/Doctor";
import { User } from "@/models/User";
import { Hospital } from "@/models/Hospital";
import { hashPassword } from "@/lib/auth/password";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const createDoctorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  hospitalId: z.string().min(1, "Hospital is required"),
  role: z.string().min(2, "Role/title is required"),
  specialty: z.string().min(2, "Specialty is required"),
  experience: z.string().min(1, "Experience is required"),
  credentials: z.string().min(2, "Credentials are required"),
  availability: z.string().min(2, "Availability is required"),
  languages: z.array(z.string()).optional().default([]),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  image: z.string().optional().default(""),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const filter = activeOnly ? { isActive: true } : {};
    const doctors = await Doctor.find(filter).populate("hospitalId", "name emailDomain").sort({ name: 1 });

    return jsonSuccess({ doctors });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to fetch doctors", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      return jsonError("Admin access required", 403);
    }

    const body = await request.json();
    const parsed = createDoctorSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    const { email, password, hospitalId, slug, name, ...doctorData } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    await connectDB();

    // Validate hospital exists and is active
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) return jsonError("Hospital not found", 404);
    if (!hospital.isActive) return jsonError("Cannot add doctor to an inactive hospital", 400);

    // Validate email domain matches the hospital's emailDomain
    const emailDomain = normalizedEmail.split("@")[1];
    if (emailDomain !== hospital.emailDomain) {
      return jsonError(
        `Doctor email must use the hospital's domain: @${hospital.emailDomain}`,
        400,
      );
    }

    // Check for existing user or doctor with same email/slug
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return jsonError("A user account with this email already exists", 409);

    const existingDoctor = await Doctor.findOne({ slug });
    if (existingDoctor) return jsonError("A doctor with this slug already exists", 409);

    const hashedPassword = await hashPassword(password);

    // Create auth User account for the doctor
    const userAccount = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "doctor",
      hospitalId,
    });

    // Create Doctor profile
    const doctor = await Doctor.create({
      name,
      slug,
      email: normalizedEmail,
      hospitalId,
      ...doctorData,
    });

    return jsonSuccess({ doctor, userId: userAccount._id.toString() }, 201);
  } catch (error: unknown) {
    console.error("POST /api/doctors Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to create doctor", 500);
  }
}
