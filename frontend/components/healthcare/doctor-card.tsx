import Link from "next/link";
import type { Doctor } from "@/types/entities";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const initials = doctor.name
    .replace(/^Dr\.\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="soft-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl">
      <div className="clay-inset flex h-16 w-16 items-center justify-center rounded-xl text-xl font-extrabold text-primary">
        {initials || "DR"}
      </div>
      <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-foreground">{doctor.name}</h2>
      <p className="mt-1 text-sm font-semibold text-primary">{doctor.role}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{doctor.specialty}</p>
      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-t border-border/40 pt-3">
          <dt className="text-muted">Experience</dt>
          <dd className="font-semibold text-foreground">{doctor.experience}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border/40 pt-3">
          <dt className="text-muted">Available</dt>
          <dd className="font-semibold text-foreground">{doctor.availability}</dd>
        </div>
      </dl>
      <Link
        className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-primary transition hover:text-primary-dark"
        href={`/doctors/${doctor.slug}`}
      >
        <span>View profile</span>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
      </Link>
    </article>
  );
}
