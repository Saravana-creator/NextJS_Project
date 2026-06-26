import mongoose, { type InferSchemaType, type Model } from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    role: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    experience: { type: String, required: true },
    credentials: { type: String, required: true },
    availability: { type: String, required: true },
    languages: [{ type: String }],
    bio: { type: String, required: true },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { timestamps: true },
);

export type DoctorDocument = InferSchemaType<typeof doctorSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Doctor: Model<DoctorDocument> =
  (mongoose.models.Doctor as Model<DoctorDocument> | undefined) ??
  mongoose.model<DoctorDocument>("Doctor", doctorSchema);
