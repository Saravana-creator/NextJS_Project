import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white/60">
      {/* Top Main Footer Grid */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-5 py-16 sm:px-8 md:grid-cols-4">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link className="font-display text-2xl font-extrabold tracking-tight text-primary" href="/">
            Dent-Ist
          </Link>
          <p className="text-sm leading-relaxed text-muted">
            Providing premium dental care and patient-centric services using advanced dental technology. Elevate your smile and health today.
          </p>
        </div>

        {/* Services Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Services</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted">
            <Link className="hover:text-primary transition-colors" href="/services">General Dentistry</Link>
            <Link className="hover:text-primary transition-colors" href="/services">Cosmetic Smile Design</Link>
            <Link className="hover:text-primary transition-colors" href="/services">Orthodontics & Braces</Link>
            <Link className="hover:text-primary transition-colors" href="/services">Dental Implants</Link>
          </nav>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Company</h4>
          <nav className="flex flex-col gap-2 text-sm text-muted">
            <Link className="hover:text-primary transition-colors" href="/about">About Our Clinic</Link>
            <Link className="hover:text-primary transition-colors" href="/doctors">Our Dental Specialists</Link>
            <Link className="hover:text-primary transition-colors" href="/pricing">Affordable Pricing</Link>
            <Link className="hover:text-primary transition-colors" href="/contact">Get in Touch</Link>
          </nav>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Contact Us</h4>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>123 Dental Suite, Premium City, NY</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              <span>+1 (555) DENT-IST</span>
            </li>
            <li className="flex items-center gap-2">
              <svg className="h-4 w-4 text-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span>care@dent-ist.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright and Legal Bar */}
      <div className="border-t border-border/30 bg-white/20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Dent-Ist. All rights reserved. Designed for excellence in oral health.</p>
          <nav className="flex flex-wrap gap-5">
            <Link className="hover:text-primary transition-colors" href="/privacy">Privacy Policy</Link>
            <Link className="hover:text-primary transition-colors" href="/terms">Terms of Service</Link>
            <Link className="hover:text-primary transition-colors" href="/cookies">Cookie Settings</Link>
            <Link className="hover:text-primary transition-colors" href="/accessibility">Accessibility Statement</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
