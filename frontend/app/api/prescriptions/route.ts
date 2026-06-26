import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Prescription } from "@/models/Prescription";
import { Appointment } from "@/models/Appointment";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const createPrescriptionSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientEmail: z.string().email("Invalid patient email address"),
  medicines: z
    .array(
      z.object({
        medication: z.string().min(1, "Medication is required"),
        dosage: z.string().min(1, "Dosage is required"),
        frequency: z.string().min(1, "Frequency is required"),
        duration: z.string().min(1, "Duration is required"),
      })
    )
    .min(1, "At least one medicine is required"),
  notes: z.string().optional().default(""),
  appointmentId: z.string().optional(),
});

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    await connectDB();

    let filter = {};
    if (currentUser.role === "admin") {
      filter = {};
    } else if (currentUser.role === "doctor") {
      filter = { doctorName: currentUser.name };
    } else {
      filter = { patientEmail: currentUser.email.toLowerCase() };
    }

    const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });

    return jsonSuccess({ prescriptions });
  } catch (error: unknown) {
    console.error("GET /api/prescriptions Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to fetch prescriptions", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    if (currentUser.role !== "doctor") {
      return jsonError("Forbidden: Only doctors can write prescriptions", 403);
    }

    const body = await request.json();
    const validatedData = createPrescriptionSchema.parse(body);

    await connectDB();

    // Create prescription
    const newPrescription = await Prescription.create({
      patientName: validatedData.patientName,
      patientEmail: validatedData.patientEmail,
      medicines: validatedData.medicines,
      notes: validatedData.notes,
      doctorName: currentUser.name,
      hospitalId: currentUser.hospitalId || null,
      status: "active",
    });

    // Auto-complete associated appointment if selected
    if (validatedData.appointmentId) {
      await Appointment.findByIdAndUpdate(validatedData.appointmentId, {
        status: "completed",
      });
    }

    return jsonSuccess(
      {
        message: "Prescription created successfully",
        prescription: newPrescription,
      },
      201
    );
  } catch (error: unknown) {
    console.error("POST /api/prescriptions Error:", error);
    if (error instanceof z.ZodError) {
      return jsonError(error.issues[0]?.message || "Validation error", 400);
    }
    return jsonError(error instanceof Error ? error.message : "Failed to create prescription", 500);
  }
}
