import { connectDB } from "@/lib/db/connect";
import { hashPassword } from "@/lib/auth/password";
import { getRedirectForRole, setSessionCookie, toSessionUser } from "@/lib/auth/session";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { registerSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return jsonError(message, 400);
    }

    const { name, email, password, phone } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return jsonError("An account with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(password);

    // All public registrations are patients.
    // Doctors are created by admin via the admin panel (/admin/doctors).
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "patient",
      phone,
    });

    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return jsonSuccess({
      user: toSessionUser(user),
      redirectTo: getRedirectForRole(user.role),
    });
  } catch {
    return jsonError("Unable to create account", 500);
  }
}
