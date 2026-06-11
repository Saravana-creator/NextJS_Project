"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { ApiResponse, SessionUser } from "@/types/auth";

type RegisterResponse = {
  user: SessionUser;
  redirectTo: string;
};

function getPasswordStrength(password: string) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function SignupForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthWidth = `${Math.max((strength / 4) * 100, 8)}%`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const result = (await response.json()) as ApiResponse<RegisterResponse>;

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? "Unable to create account");
        return;
      }

      await refresh();
      router.push(result.data.redirectTo);
      router.refresh();
    } catch {
      setError("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold">
        Full name
        <input
          className="rounded-lg border border-border px-4 py-3"
          placeholder="Your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          autoComplete="name"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Email address
        <input
          className="rounded-lg border border-border px-4 py-3"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Password
        <input
          className="rounded-lg border border-border px-4 py-3"
          placeholder="At least 8 characters"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="new-password"
        />
      </label>
      <div className="clay-inset h-2 overflow-hidden rounded-full" aria-label="Password strength">
        <div className="h-full bg-primary transition-all" style={{ width: strengthWidth }} />
      </div>
      <label className="grid gap-2 text-sm font-semibold">
        Confirm password
        <input
          className="rounded-lg border border-border px-4 py-3"
          placeholder="Re-enter password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          autoComplete="new-password"
        />
      </label>
      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="mt-2 min-h-11 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
