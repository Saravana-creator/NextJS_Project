import Link from "next/link";
import { AuthStatus } from "@/components/auth/auth-status";
import { publicNav } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-clay-light/85 shadow-[0_12px_34px_rgba(135,54,34,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link className="font-display text-xl font-extrabold text-primary" href="/">
          Dent-Ist
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted md:flex">
          {publicNav.map((item) => (
            <Link key={item.href} className="hover:text-foreground" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <AuthStatus />
          <Button href="/appointment">Book</Button>
        </div>
      </div>
    </header>
  );
}
