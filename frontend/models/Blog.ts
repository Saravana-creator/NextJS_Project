import mongoose, { type InferSchemaType, type Model } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    authorName: { type: String, default: "Dent-Ist Team" },
    coverImage: { type: String, default: "" },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export type BlogDocument = InferSchemaType<typeof blogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Blog: Model<BlogDocument> =
  (mongoose.models.Blog as Model<BlogDocument> | undefined) ??
  mongoose.model<BlogDocument>("Blog", blogSchema);
