import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Testimonial } from "@/models/Testimonial";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const approvedOnly = searchParams.get("approvedOnly") !== "false";

    const filter = approvedOnly ? { isApproved: true } : {};
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

    return jsonSuccess({ testimonials });
  } catch (error: unknown) {
    return jsonError(error instanceof Error ? error.message : "Failed to fetch testimonials", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientName, rating, review, treatment } = body;

    if (!patientName || !rating || !review || !treatment) {
      return jsonError("All fields are required", 400);
    }
    if (rating < 1 || rating > 5) {
      return jsonError("Rating must be between 1 and 5", 400);
    }

    await connectDB();

    const currentUser = await getCurrentUser();
    const testimonial = await Testimonial.create({
      patientName: currentUser?.name ?? patientName,
      rating: Number(rating),
      review,
      treatment,
      isApproved: false,
    });

    return jsonSuccess({ testimonial, message: "Thank you! Your review has been submitted for approval." }, 201);
  } catch (error: unknown) {
    console.error("POST /api/testimonials Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to submit testimonial", 500);
  }
}
