import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Billing } from "@/models/Billing";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateInvoiceSchema = z.object({
  status: z.enum(["paid", "unpaid", "pending"]).optional(),
  amount: z.number().min(1).optional(),
  dueDate: z.string().optional(),
  paymentMethod: z.string().optional(),
  paidAt: z.string().optional(),
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
    const parsed = updateInvoiceSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const invoice = await Billing.findById(id);
    if (!invoice) {
      return jsonError("Invoice not found", 404);
    }

    // Role check: Staff can update anything. Patients can pay their own invoice.
    const isStaff = ["admin", "doctor"].includes(currentUser.role);
    const isOwnInvoice = invoice.patientEmail === currentUser.email.toLowerCase();

    if (!isStaff && !isOwnInvoice) {
      return jsonError("Forbidden: You cannot modify this invoice", 403);
    }

    // If patient is updating, restrict them to status="paid", paymentMethod, paidAt
    let updateFields = parsed.data;
    if (!isStaff) {
      updateFields = {
        status: "paid",
        paymentMethod: parsed.data.paymentMethod || "Credit Card",
        paidAt: parsed.data.paidAt || new Date().toISOString(),
      };
    }

    const updated = await Billing.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return jsonSuccess({ invoice: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/billing/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update invoice", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("Not authenticated", 401);
    }

    const isAdmin = currentUser.role === "admin";
    if (!isAdmin) {
      return jsonError("Forbidden: Admin access required to delete invoices", 403);
    }

    const { id } = await context.params;
    await connectDB();

    const invoice = await Billing.findById(id);
    if (!invoice) {
      return jsonError("Invoice not found", 404);
    }

    await Billing.findByIdAndDelete(id);

    return jsonSuccess({ message: "Invoice deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/billing/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to delete invoice", 500);
  }
}
