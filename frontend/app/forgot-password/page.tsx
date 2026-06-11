import Link from "next/link";
import { AuthPage } from "@/components/layout/auth-page";

export default function ForgotPasswordPage() {
  return (
    <AuthPage
      title="Reset access"
      description="Enter your email to receive password reset instructions."
    >
      <form className="mt-7 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold">
          Email address
          <input
            className="rounded-lg border border-border px-4 py-3"
            placeholder="you@example.com"
            type="email"
            disabled
          />
        </label>
        <p className="text-sm text-muted">Password reset will be available in a future update.</p>
        <Link
          className="mt-2 min-h-11 rounded-lg border border-border bg-white px-5 py-3 text-center text-sm font-bold"
          href="/login"
        >
          Back to sign in
        </Link>
      </form>
    </AuthPage>
  );
}
