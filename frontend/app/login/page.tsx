import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthPage } from "@/components/layout/auth-page";

export default function LoginPage() {
  return (
    <AuthPage
      title="Welcome back"
      description="Sign in to continue to your Dent-Ist workspace."
    >
      <Suspense fallback={<p className="mt-7 text-sm text-muted">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </AuthPage>
  );
}
