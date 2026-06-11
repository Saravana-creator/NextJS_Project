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

    const { name, email, password } = parsed.data;

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return jsonError("An account with this email already exists", 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "patient",
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
