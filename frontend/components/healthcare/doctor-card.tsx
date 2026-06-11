import Link from "next/link";
import type { Doctor } from "@/types/entities";

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="soft-card rounded-lg p-6 transition hover:-translate-y-1 hover:border-primary">
      <div className="clay-inset flex h-16 w-16 items-center justify-center rounded-lg text-xl font-black text-primary">
        {doctor.name
          .split(" ")
          .slice(1, 3)
          .map((part) => part[0])
          .join("")}
      </div>
      <h2 className="mt-5 font-display text-xl font-bold">{doctor.name}</h2>
      <p className="mt-1 text-sm font-semibold text-primary">{doctor.role}</p>
      <p className="mt-3 text-sm leading-6 text-muted">{doctor.specialty}</p>
      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-t border-border pt-3">
          <dt className="text-muted">Experience</dt>
          <dd className="font-semibold">{doctor.experience}</dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-border pt-3">
          <dt className="text-muted">Available</dt>
          <dd className="font-semibold">{doctor.availability}</dd>
        </div>
      </dl>
      <Link
        className="mt-6 inline-flex text-sm font-bold text-primary hover:text-primary-dark"
        href={`/doctors/${doctor.slug}`}
      >
        View profile
      </Link>
    </article>
  );
}
