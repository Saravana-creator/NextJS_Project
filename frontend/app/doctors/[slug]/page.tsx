import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

export default async function DoctorDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await api.doctors.getBySlug(slug);

  if (!doctor) {
    notFound();
  }

  return (
    <PageShell>
      <Section
        eyebrow={doctor.specialty}
        title={doctor.name}
        description={doctor.bio}
      >
        <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="soft-card rounded-lg p-8">
            <div className="clay-inset flex h-24 w-24 items-center justify-center rounded-lg text-3xl font-black text-primary">
              {doctor.name
                .split(" ")
                .slice(1, 3)
                .map((part) => part[0])
                .join("")}
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold">{doctor.role}</h2>
            <p className="mt-2 text-muted">{doctor.credentials}</p>
            <Button className="mt-6" href="/appointment">
              Book with doctor
            </Button>
          </div>
          <div className="soft-card rounded-lg p-8">
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Experience</dt>
                <dd className="mt-1 font-semibold">{doctor.experience}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Availability</dt>
                <dd className="mt-1 font-semibold">{doctor.availability}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted">Languages</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {doctor.languages.map((language) => (
                    <span
                      className="rounded-lg border border-border bg-white px-3 py-1 text-sm font-semibold"
                      key={language}
                    >
                      {language}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
