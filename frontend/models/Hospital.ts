import mongoose, { type InferSchemaType, type Model } from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailDomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // e.g. "citycare.com" — doctors must have email ending @citycare.com
    },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type HospitalDocument = InferSchemaType<typeof hospitalSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Hospital: Model<HospitalDocument> =
  (mongoose.models.Hospital as Model<HospitalDocument> | undefined) ??
  mongoose.model<HospitalDocument>("Hospital", hospitalSchema);
