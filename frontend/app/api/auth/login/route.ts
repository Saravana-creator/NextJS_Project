import { connectDB } from "@/lib/db/connect";
import { verifyPassword } from "@/lib/auth/password";
import { getRedirectForRole, setSessionCookie, toSessionUser } from "@/lib/auth/session";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { loginSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return jsonError(message, 400);
    }

    const { email, password } = parsed.data;

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return jsonError("Invalid email or password", 401);
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return jsonError("Invalid email or password", 401);
    }

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
    return jsonError("Unable to sign in", 500);
  }
}
