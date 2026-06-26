import mongoose, { type InferSchemaType, type Model } from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type ContactMessageDocument = InferSchemaType<typeof contactMessageSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const ContactMessage: Model<ContactMessageDocument> =
  (mongoose.models.ContactMessage as Model<ContactMessageDocument> | undefined) ??
  mongoose.model<ContactMessageDocument>("ContactMessage", contactMessageSchema);
