"use client";

import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <span className="text-sm text-muted">...</span>;
  }

  if (!user) {
    return (
      <>
        <Button href="/signup" variant="ghost">
          Sign up
        </Button>
        <Button href="/login" variant="ghost">
          Login
        </Button>
      </>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        className="hidden text-sm font-semibold text-muted hover:text-primary sm:inline"
        href={["admin", "doctor"].includes(user.role) ? "/admin" : "/dashboard"}
      >
        {user.name}
      </Link>
      <Button type="button" variant="ghost" onClick={() => void logout()}>
        Logout
      </Button>
    </div>
  );
}
