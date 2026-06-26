import mongoose, { type InferSchemaType, type Model } from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    icon: { type: String, default: "tooth" },
    price: { type: String, default: "" },
    duration: { type: String, default: "" },
    category: {
      type: String,
      enum: ["general", "cosmetic", "orthodontic", "surgical", "pediatric", "preventive"],
      default: "general",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type ServiceDocument = InferSchemaType<typeof serviceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Service: Model<ServiceDocument> =
  (mongoose.models.Service as Model<ServiceDocument> | undefined) ??
  mongoose.model<ServiceDocument>("Service", serviceSchema);
