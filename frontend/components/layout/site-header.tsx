"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthStatus } from "@/components/auth/auth-status";
import { publicNav } from "@/constants/navigation";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-white/75 shadow-[0_8px_30px_rgb(11,126,161,0.04)] backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Logo */}
        <Link className="font-display text-xl font-extrabold tracking-tight text-primary hover:opacity-90" href="/">
          Dent-Ist
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-semibold text-muted md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.href}
              className="transition-colors hover:text-primary"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section (Desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          <AuthStatus />
          <Button href="/appointment">Book Appointment</Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-white/50 text-muted transition hover:bg-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer/Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 border-b border-border/40 bg-white/95 px-6 py-6 shadow-xl backdrop-blur-lg md:hidden animate-slide-up">
          <nav className="flex flex-col gap-4">
            {publicNav.map((item) => (
              <Link
                key={item.href}
                className="text-base font-semibold text-foreground transition-colors hover:text-primary"
                href={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-border/40" />
            <div className="flex flex-col gap-3">
              <AuthStatus />
              <Button href="/appointment" onClick={() => setIsOpen(false)}>
                Book Appointment
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
