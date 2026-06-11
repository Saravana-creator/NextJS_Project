import Link from "next/link";

const footerLinks = [
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/cookies", "Cookies"],
  ["/accessibility", "Accessibility"],
];

export function Footer() {
  return (
    <footer className="border-t border-white/70 bg-clay-light/75">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© 2026 Dent-Ist Dental Hospital Platform.</p>
        <nav className="flex flex-wrap gap-4">
          {footerLinks.map(([href, label]) => (
            <Link key={href} className="hover:text-foreground" href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
