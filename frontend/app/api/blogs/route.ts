import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Blog } from "@/models/Blog";
import { blogs as mockBlogs } from "@/data/blogs";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const createBlogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional().default(""),
  isPublished: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const count = await Blog.countDocuments();
    if (count === 0) {
      // Seed blogs dynamically
      await Blog.insertMany(
        mockBlogs.map((b) => ({
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          content: b.content,
          authorName: b.authorName,
          tags: b.tags,
          isPublished: true,
          publishedAt: new Date(b.publishedAt),
        }))
      );
    }

    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("publishedOnly") !== "false";

    const filter = publishedOnly ? { isPublished: true } : {};
    const posts = await Blog.find(filter).sort({ createdAt: -1 });

    return jsonSuccess({ posts });
  } catch (error: unknown) {
    console.error("GET /api/blogs Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to fetch blogs", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin") {
      return jsonError("Forbidden: Admin access required", 403);
    }

    const body = await request.json();
    const validatedData = createBlogSchema.parse(body);

    await connectDB();

    const existing = await Blog.findOne({ slug: validatedData.slug });
    if (existing) {
      return jsonError("A blog with this URL slug already exists", 409);
    }

    const newPost = await Blog.create({
      ...validatedData,
      authorName: currentUser.name,
      publishedAt: validatedData.isPublished ? new Date() : null,
    });

    return jsonSuccess({ post: newPost }, 201);
  } catch (error: unknown) {
    console.error("POST /api/blogs Error:", error);
    if (error instanceof z.ZodError) {
      return jsonError(error.issues[0]?.message || "Validation error", 400);
    }
    return jsonError(error instanceof Error ? error.message : "Failed to create blog", 500);
  }
}
