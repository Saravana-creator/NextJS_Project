import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Appointment } from "@/models/Appointment";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const bookAppointmentSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientEmail: z.string().email("Invalid email address"),
  patientPhone: z
    .string()
    .trim()
    .regex(
      /^(?:\+91|0)?[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian phone number (optionally with +91 or 0 prefix)"
    ),
  doctorName: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().optional(),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = bookAppointmentSchema.parse(body);

    await connectDB();

    const newAppointment = await Appointment.create({
      ...validatedData,
      status: "pending",
    });

    return jsonSuccess({
      message: "Appointment booked successfully. We will confirm shortly.",
      appointmentId: newAppointment._id.toString(),
    }, 201);
  } catch (error: unknown) {
    console.error("POST /api/appointments Error:", error);
    if (error instanceof z.ZodError) {
      return jsonError(error.issues[0]?.message || "Validation error", 400);
    }
    return jsonError(error instanceof Error ? error.message : "Failed to book appointment", 500);
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    await connectDB();

    let filter = {};
    if (currentUser.role === "admin") {
      filter = {}; // admin sees everything
    } else if (currentUser.role === "doctor") {
      filter = { doctorName: currentUser.name }; // doctor sees only assigned appointments
    } else {
      filter = { patientEmail: currentUser.email }; // patient sees only their own
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });

    return jsonSuccess({ appointments });
  } catch (error: unknown) {
    console.error("GET /api/appointments Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to fetch appointments", 500);
  }
  }

