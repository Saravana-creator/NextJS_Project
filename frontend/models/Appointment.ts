import mongoose, { type InferSchemaType, type Model } from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    patientEmail: { type: String, required: true, lowercase: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
    doctorName: { type: String, default: "" },
    date: { type: String, required: true },
    timeSlot: { type: String, default: "" },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export type AppointmentDocument = InferSchemaType<typeof appointmentSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Appointment: Model<AppointmentDocument> =
  (mongoose.models.Appointment as Model<AppointmentDocument> | undefined) ??
  mongoose.model<AppointmentDocument>("Appointment", appointmentSchema);
