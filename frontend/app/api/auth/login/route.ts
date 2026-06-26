import { connectDB } from "@/lib/db/connect";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getRedirectForRole, setSessionCookie, toSessionUser } from "@/lib/auth/session";
import { jsonError, jsonSuccess } from "@/lib/api-response";
import { loginSchema } from "@/lib/validations/auth";
import { User } from "@/models/User";
import { Hospital } from "@/models/Hospital";
import type { UserRole } from "@/types/auth";

/** Only the admin is hardcoded via .env.local. Doctors are created by admin via UI. */
const ADMIN_ACCOUNT = {
  nameKey: "ADMIN_NAME",
  emailKey: "ADMIN_EMAIL",
  passwordKey: "ADMIN_PASSWORD",
  role: "admin" as UserRole,
};

async function resolveAdminLogin(email: string, password: string) {
  const envEmail = process.env[ADMIN_ACCOUNT.emailKey]?.toLowerCase()?.trim();
  const envPassword = process.env[ADMIN_ACCOUNT.passwordKey]?.trim();
  const envName = (process.env[ADMIN_ACCOUNT.nameKey] ?? "Admin").trim();

  if (!envEmail || !envPassword) return undefined;
  if (email !== envEmail) return undefined; // not admin email
  if (password !== envPassword) return null; // admin email but wrong password

  // Upsert admin account in MongoDB
  let user = await User.findOne({ email: envEmail }).select("+password");
  if (!user) {
    const hashed = await hashPassword(envPassword);
    user = await User.create({ name: envName, email: envEmail, password: hashed, role: "admin" });
  } else {
    let changed = false;
    if (user.role !== "admin") { user.role = "admin"; changed = true; }
    if (user.name !== envName) { user.name = envName; changed = true; }
    if (changed) await user.save();
  }

  return user;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid input";
      return jsonError(message, 400);
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    await connectDB();

    // ── 1. Check admin env credentials ──────────────────────────
    const adminResult = await resolveAdminLogin(normalizedEmail, password);
    if (adminResult === null) {
      return jsonError("Invalid email or password", 401);
    }

    if (adminResult) {
      await setSessionCookie({
        userId: adminResult._id.toString(),
        email: adminResult.email,
        name: adminResult.name,
        role: "admin",
      });
      return jsonSuccess({
        user: toSessionUser(adminResult as Parameters<typeof toSessionUser>[0]),
        redirectTo: "/admin",
      });
    }

    // ── 2. Regular user (patient or doctor) ─────────────────────
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) return jsonError("Invalid email or password", 401);

    const isValid = await verifyPassword(password, user.password as string);
    if (!isValid) return jsonError("Invalid email or password", 401);

    // ── 3. If doctor — validate hospital is still active ─────────
    if (user.role === "doctor") {
      if (!user.hospitalId) {
        return jsonError("Your account is not linked to any hospital. Contact admin.", 403);
      }
      const hospital = await Hospital.findById(user.hospitalId);
      if (!hospital) {
        return jsonError("Your linked hospital no longer exists. Contact admin.", 403);
      }
      if (!hospital.isActive) {
        return jsonError("Your hospital account has been deactivated. Contact admin.", 403);
      }

      await setSessionCookie({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: "doctor",
        hospitalId: user.hospitalId.toString(),
      });

      return jsonSuccess({
        user: toSessionUser(user as Parameters<typeof toSessionUser>[0]),
        redirectTo: getRedirectForRole("doctor"),
      });
    }

    // ── 4. Patient ───────────────────────────────────────────────
    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    });

    return jsonSuccess({
      user: toSessionUser(user as Parameters<typeof toSessionUser>[0]),
      redirectTo: getRedirectForRole(user.role as UserRole),
    });
  } catch (err) {
    console.error("Login error:", err);
    return jsonError("Unable to sign in", 500);
  }
}
