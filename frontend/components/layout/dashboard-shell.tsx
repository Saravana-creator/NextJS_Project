"use client";

import Link from "next/link";
import { dashboardNav, adminNav, doctorNav } from "@/constants/navigation";
import { useAuth } from "@/providers/auth-provider";

export function DashboardShell({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "patient" | "admin";
}) {
  const { user, logout } = useAuth();
  const nav = mode === "admin"
    ? (user?.role === "doctor" ? doctorNav : adminNav)
    : dashboardNav;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border/40 bg-white/75 p-5 shadow-[8px_0_30px_rgba(11,126,161,0.03)] backdrop-blur-md lg:block">
        <Link className="font-display text-xl font-extrabold text-primary hover:opacity-90" href="/">
          Dent-Ist
        </Link>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
          {mode === "admin" ? (user?.role === "doctor" ? "Doctor Portal" : "Admin Panel") : "Patient Portal"}
        </p>
        <nav className="mt-8 grid gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-all hover:bg-teal-light hover:text-primary"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-border/40 pt-4">
          {user ? (
            <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
          ) : null}
          <button
            className="mt-2 text-sm font-semibold text-primary transition hover:text-primary-dark"
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
