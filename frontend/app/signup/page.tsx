import { SignupForm } from "@/components/auth/signup-form";
import { AuthPage } from "@/components/layout/auth-page";

export default function SignupPage() {
  return (
    <AuthPage
      title="Create account"
      description="Start a patient account to access your Dent-Ist portal."
    >
      <SignupForm />
    </AuthPage>
  );
}
