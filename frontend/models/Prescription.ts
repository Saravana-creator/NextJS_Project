import mongoose, { type InferSchemaType, type Model } from "mongoose";

// Force delete stale schema to prevent caching issues in hot-reloads
if (mongoose.models.Prescription) {
  delete mongoose.models.Prescription;
}

const prescriptionSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    patientEmail: { type: String, required: true, lowercase: true, trim: true },
    doctorName: { type: String, required: true, trim: true },
    medicines: [
      {
        medication: { type: String, required: true, trim: true },
        dosage: { type: String, required: true, trim: true },
        frequency: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
      },
    ],
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      default: null,
    },
  },
  { timestamps: true },
);

export type PrescriptionDocument = InferSchemaType<typeof prescriptionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Prescription: Model<PrescriptionDocument> =
  (mongoose.models.Prescription as Model<PrescriptionDocument> | undefined) ??
  mongoose.model<PrescriptionDocument>("Prescription", prescriptionSchema);
