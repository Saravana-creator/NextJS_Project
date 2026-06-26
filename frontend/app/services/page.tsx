import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";
import Link from "next/link";

export const metadata = {
  title: "Services | Dent-Ist",
  description: "Explore our complete range of dental services — from routine checkups to full mouth reconstructions.",
};

type ServiceItem = {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  duration: string;
  icon?: string;
};

type DoctorItem = {
  id: string;
  slug: string;
  name: string;
  specialty: string;
};

async function getServicesAndDoctors(): Promise<{ services: ServiceItem[]; doctors: DoctorItem[] }> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const [svcsRes, docsRes] = await Promise.all([
      fetch(`${baseUrl}/api/services?activeOnly=true`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/doctors?activeOnly=true`, { next: { revalidate: 60 } }),
    ]);

    const svcsJson = svcsRes.ok ? await svcsRes.json() : { success: false };
    const docsJson = docsRes.ok ? await docsRes.json() : { success: false };

    const services = svcsJson.success && svcsJson.data && Array.isArray(svcsJson.data.services)
      ? svcsJson.data.services
      : [];

    const doctors = docsJson.success && docsJson.data && Array.isArray(docsJson.data.doctors)
      ? docsJson.data.doctors.map((d: any) => ({
          id: d._id ?? d.id,
          slug: d.slug,
          name: d.name,
          specialty: d.specialty,
        }))
      : [];

    return { services, doctors };
  } catch (err) {
    console.error("getServicesAndDoctors error:", err);
    return { services: [], doctors: [] };
  }
}

function getDoctorsForServiceCategory(category: string, doctors: DoctorItem[]) {
  return doctors.filter((doc) => {
    const specialty = doc.specialty.toLowerCase();
    const cat = category.toLowerCase();
    
    if (cat === "orthodontic" && specialty.includes("ortho")) return true;
    if (cat === "cosmetic" && (specialty.includes("cosmetic") || specialty.includes("aesthetic"))) return true;
    if (cat === "pediatric" && (specialty.includes("pediatric") || specialty.includes("child") || specialty.includes("pedodont"))) return true;
    if (cat === "surgical" && (specialty.includes("surgery") || specialty.includes("surgical"))) return true;
    if (cat === "preventive" && (specialty.includes("preventive") || specialty.includes("hygiene") || specialty.includes("clean"))) return true;
    if (cat === "general" && (specialty.includes("general") || specialty.includes("dentist") || specialty.includes("family"))) return true;
    
    // Fallback: substring matching
    if (specialty.includes(cat) || cat.includes(specialty)) return true;
    
    return false;
  });
}

function ServiceIcon({ icon }: { icon?: string }) {
  if (icon === "tooth" || !icon) {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.22a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    );
  }
  if (icon === "sparkles") {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    );
  }
  if (icon === "aligners") {
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
      </svg>
    );
  }
  return (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

export default async function ServicesPage() {
  const { services, doctors } = await getServicesAndDoctors();

  return (
    <PageShell>
      <Section
        eyebrow="Clinical Offerings"
        title="Complete Dental Solutions"
        description="From routine checkups to full mouth reconstructions, we deliver patient-centric care using advanced materials and digital design."
      >
        {services.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-4 py-16 text-center">
            <div className="clay-inset flex h-16 w-16 items-center justify-center rounded-2xl text-primary">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
              </svg>
            </div>
            <p className="font-display text-lg font-semibold text-foreground">No services listed yet</p>
            <p className="text-sm text-muted">Services will appear here once added via the admin dashboard.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 mt-10">
            {services.map((svc) => {
              const matchingDoctors = getDoctorsForServiceCategory(svc.category, doctors);
              return (
                <article
                  key={svc._id}
                  className="soft-card flex flex-col justify-between rounded-2xl p-8 border border-white/60 transition duration-300 hover:-translate-y-1 hover:border-primary"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="clay-inset flex h-14 w-14 items-center justify-center rounded-xl text-primary font-bold">
                        <ServiceIcon icon={svc.icon} />
                      </div>
                      <span className="rounded-full bg-teal-light px-3 py-1 text-xs font-bold text-primary">
                        {svc.category}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-bold text-foreground">{svc.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{svc.description}</p>
                    
                    {/* Available Specialists */}
                    <div className="mt-5 border-t border-border/20 pt-4">
                      <span className="block text-xs uppercase tracking-wider text-muted font-extrabold">Available Specialists</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {matchingDoctors.length === 0 ? (
                          <span className="text-xs text-muted italic">Any General Clinician</span>
                        ) : (
                          matchingDoctors.map((doc) => (
                            <Link
                              key={doc.id}
                              href={`/doctors/${doc.slug}`}
                              className="rounded-lg bg-teal-light px-3 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white transition duration-200"
                            >
                              {doc.name}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-5 text-sm">
                    <div className="flex gap-6">
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-muted">Est. Cost</span>
                        <span className="font-bold text-foreground">{svc.price || "—"}</span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-muted">Duration</span>
                        <span className="font-bold text-foreground">{svc.duration || "—"}</span>
                      </div>
                    </div>
                    <Link
                      href="/appointment"
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary-dark"
                    >
                      <span>Book Consultation</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Section>
    </PageShell>
  );
}
