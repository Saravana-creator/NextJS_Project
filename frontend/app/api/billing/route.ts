import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Billing } from "@/models/Billing";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const createInvoiceSchema = z.object({
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientEmail: z.string().email("Invalid email address"),
  amount: z.number().min(1, "Amount must be greater than zero"),
  dueDate: z.string().min(1, "Due date is required"),
  appointmentId: z.string().optional().nullable(),
  status: z.enum(["paid", "unpaid", "pending"]).optional().default("unpaid"),
});

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    await connectDB();

    let filter = {};
    if (currentUser.role === "admin" || currentUser.role === "doctor") {
      filter = {}; // Staff can view all invoices
    } else {
      filter = { patientEmail: currentUser.email.toLowerCase() }; // Patient sees only their own
    }

    const bills = await Billing.find(filter).sort({ createdAt: -1 });

    return jsonSuccess({ bills });
  } catch (error: unknown) {
    console.error("GET /api/billing Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to fetch invoices", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const isStaff = ["admin", "doctor"].includes(currentUser.role);
    if (!isStaff) {
      return jsonError("Forbidden: Only admin or doctor can generate invoices", 403);
    }

    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

    await connectDB();

    const invoiceNumber = `INV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const newInvoice = await Billing.create({
      patientName: validatedData.patientName,
      patientEmail: validatedData.patientEmail,
      amount: validatedData.amount,
      dueDate: validatedData.dueDate,
      appointmentId: validatedData.appointmentId || null,
      status: validatedData.status,
      invoiceNumber,
    });

    return jsonSuccess(
      {
        message: "Invoice created successfully",
        invoice: newInvoice,
      },
      201
    );
  } catch (error: unknown) {
    console.error("POST /api/billing Error:", error);
    if (error instanceof z.ZodError) {
      return jsonError(error.issues[0]?.message || "Validation error", 400);
    }
    return jsonError(error instanceof Error ? error.message : "Failed to create invoice", 500);
  }
}
