import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Blog } from "@/models/Blog";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { z } from "zod";

const updateBlogSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  excerpt: z.string().min(10).optional(),
  content: z.string().min(20).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin") {
      return jsonError("Forbidden: Admin access required", 403);
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateBlogSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    await connectDB();

    const post = await Blog.findById(id);
    if (!post) return jsonError("Blog post not found", 404);

    const updateFields = {
      ...parsed.data,
      ...(parsed.data.isPublished !== undefined && {
        publishedAt: parsed.data.isPublished ? new Date() : null,
      }),
    };

    const updated = await Blog.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return jsonSuccess({ post: updated });
  } catch (error: unknown) {
    console.error("PATCH /api/blogs/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to update blog post", 500);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (currentUser.role !== "admin") {
      return jsonError("Forbidden: Admin access required", 403);
    }

    const { id } = await context.params;
    await connectDB();

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return jsonError("Blog post not found", 404);

    return jsonSuccess({ message: "Blog post deleted successfully" });
  } catch (error: unknown) {
    console.error("DELETE /api/blogs/[id] Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to delete blog post", 500);
  }
}
