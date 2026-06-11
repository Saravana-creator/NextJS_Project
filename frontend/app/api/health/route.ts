import { connectDB } from "@/lib/db/connect";
import { jsonSuccess, jsonError } from "@/lib/api-response";

export async function GET() {
  try {
    await connectDB();
    return jsonSuccess({ status: "ok", db: "connected" });
  } catch {
    return jsonError("Database connection failed", 503);
  }
}
