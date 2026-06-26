import { DoctorCard } from "@/components/healthcare/doctor-card";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import type { Doctor } from "@/types/entities";

export const metadata = {
  title: "Doctors | Dent-Ist",
  description: "Meet the Dent-Ist dental specialists and book an appointment today.",
};

async function getDoctors(): Promise<Doctor[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/doctors`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });

    if (!res.ok) return [];

    const json = await res.json();
    if (!json.success || !json.data || !Array.isArray(json.data.doctors)) return [];

    // Map MongoDB documents to the Doctor type used by DoctorCard
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.data.doctors.map((d: any) => ({
      id: d._id ?? d.id ?? "",
      slug: d.slug ?? "",
      name: d.name ?? "",
      role: d.role ?? "",
      specialty: d.specialty ?? "",
      experience: d.experience ?? "",
      credentials: d.credentials ?? "",
      availability: d.availability ?? "",
      languages: Array.isArray(d.languages) ? d.languages : [],
      bio: d.bio ?? "",
    }));
  } catch {
    return [];
  }
}

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <PageShell>
      <Section
        eyebrow="Clinical team"
        title="Dent-Ist specialists"
        description="Our board-certified dental specialists bring decades of expertise across every field of modern dentistry."
      >
        {doctors.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
            <div className="clay-inset flex h-16 w-16 items-center justify-center rounded-2xl text-primary">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-foreground">No doctors on file yet</p>
            <p className="text-sm text-muted">
              Doctors will appear here once added via the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
