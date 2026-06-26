import mongoose, { type InferSchemaType, type Model } from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    patientEmail: { type: String, required: true, lowercase: true, trim: true },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    invoiceNumber: { type: String, required: true, unique: true, trim: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["paid", "unpaid", "pending"],
      default: "unpaid",
    },
    dueDate: { type: String, required: true },
    paidAt: { type: String, default: "" },
    paymentMethod: { type: String, default: "" },
  },
  { timestamps: true },
);

export type BillingDocument = InferSchemaType<typeof billingSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Billing: Model<BillingDocument> =
  (mongoose.models.Billing as Model<BillingDocument> | undefined) ??
  mongoose.model<BillingDocument>("Billing", billingSchema);
