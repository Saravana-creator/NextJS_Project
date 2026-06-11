"use client";

import Link from "next/link";
import { dashboardNav, adminNav } from "@/constants/navigation";
import { useAuth } from "@/providers/auth-provider";

export function DashboardShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "patient" | "admin";
}) {
  const nav = mode === "admin" ? adminNav : dashboardNav;
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fff4ea]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/70 bg-clay-light p-5 shadow-[18px_0_34px_rgba(135,54,34,0.08)] lg:block">
        <Link className="font-display text-xl font-extrabold text-primary" href="/">
          Dent-Ist
        </Link>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
          {mode === "admin" ? "Admin" : "Patient"}
        </p>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted hover:bg-clay-light hover:text-primary"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-white/70 pt-4">
          {user ? (
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
          ) : null}
          <button
            className="mt-2 text-sm font-semibold text-primary hover:underline"
            type="button"
            onClick={() => void logout()}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
