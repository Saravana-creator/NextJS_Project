import mongoose, { type InferSchemaType, type Model } from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    treatment: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type TestimonialDocument = InferSchemaType<typeof testimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Testimonial: Model<TestimonialDocument> =
  (mongoose.models.Testimonial as Model<TestimonialDocument> | undefined) ??
  mongoose.model<TestimonialDocument>("Testimonial", testimonialSchema);
