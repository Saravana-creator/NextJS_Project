import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { ContactMessage } from "@/models/ContactMessage";
import { jsonSuccess, jsonError } from "@/lib/api-response";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return jsonError("Not authenticated", 401);
    if (!["admin", "doctor"].includes(currentUser.role)) {
      return jsonError("Forbidden: staff access required", 403);
    }

    await connectDB();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

    return jsonSuccess({ messages });
  } catch (error: unknown) {
    console.error("GET /api/contact Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to fetch messages", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return jsonError("Name, email, and message are required", 400);
    }

    await connectDB();

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone: phone ?? "",
      subject: subject ?? "General Inquiry",
      message,
    });

    return jsonSuccess(
      { message: "Your message has been received. We'll get back to you soon.", id: newMessage._id.toString() },
      201,
    );
  } catch (error: unknown) {
    console.error("POST /api/contact Error:", error);
    return jsonError(error instanceof Error ? error.message : "Failed to send message", 500);
  }
}
