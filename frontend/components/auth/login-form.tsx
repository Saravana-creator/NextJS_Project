"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { ApiResponse, SessionUser } from "@/types/auth";

type LoginResponse = {
  user: SessionUser;
  redirectTo: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = (await response.json()) as ApiResponse<LoginResponse>;

      if (!response.ok || !result.success || !result.data) {
        setError(result.error ?? "Unable to sign in");
        return;
      }

      await refresh();
      const redirectTo = searchParams.get("redirect") ?? result.data.redirectTo;
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
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
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
        />
      </label>
      <div className="flex justify-end">
        <Link className="text-sm font-semibold text-primary hover:underline" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
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
        {loading ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-primary hover:underline" href="/signup">
          Create one
        </Link>
      </p>
    </form>
  );
}
