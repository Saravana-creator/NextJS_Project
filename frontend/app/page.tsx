import Link from "next/link";
import { DoctorCard } from "@/components/healthcare/doctor-card";
import { PageShell } from "@/components/layout/page-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";

type HomeDoctor = {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  credentials: string;
  availability: string;
  languages: string[];
  bio: string;
};

type HomeService = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  price: string;
  duration: string;
  category: string;
};

type HomeTestimonial = {
  id: string;
  patientName: string;
  rating: number;
  review: string;
  treatment: string;
};

async function getHomeData(): Promise<{
  doctors: HomeDoctor[];
  services: HomeService[];
  testimonials: HomeTestimonial[];
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const [docsRes, svcsRes, testsRes] = await Promise.all([
      fetch(`${baseUrl}/api/doctors?activeOnly=true`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/services?activeOnly=true`, { next: { revalidate: 60 } }),
      fetch(`${baseUrl}/api/testimonials?approvedOnly=true`, { next: { revalidate: 60 } }),
    ]);

    const docsJson = docsRes.ok ? await docsRes.json() : { success: false };
    const svcsJson = svcsRes.ok ? await svcsRes.json() : { success: false };
    const testsJson = testsRes.ok ? await testsRes.json() : { success: false };

    const activeDoctors = docsJson.success && docsJson.data && Array.isArray(docsJson.data.doctors)
      ? docsJson.data.doctors.map((d: any) => ({
          id: d._id ?? d.id,
          slug: d.slug,
          name: d.name,
          role: d.role,
          specialty: d.specialty,
          experience: d.experience,
          credentials: d.credentials,
          availability: d.availability,
          languages: d.languages,
          bio: d.bio,
        }))
      : [];

    const activeServices = svcsJson.success && svcsJson.data && Array.isArray(svcsJson.data.services)
      ? svcsJson.data.services.map((s: any) => ({
          id: s._id ?? s.id,
          title: s.title,
          slug: s.slug,
          description: s.description,
          icon: s.icon,
          price: s.price,
          duration: s.duration,
          category: s.category,
        }))
      : [];

    const approvedTestimonials = testsJson.success && testsJson.data && Array.isArray(testsJson.data.testimonials)
      ? testsJson.data.testimonials.map((t: any) => ({
          id: t._id ?? t.id,
          patientName: t.patientName,
          rating: t.rating,
          review: t.review,
          treatment: t.treatment,
        }))
      : [];

    return {
      doctors: activeDoctors,
      services: activeServices,
      testimonials: approvedTestimonials,
    };
  } catch (err) {
    console.error("Failed to load home page data:", err);
    return { doctors: [], services: [], testimonials: [] };
  }
}

export default async function Home() {
  const { doctors, services, testimonials } = await getHomeData();

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left column */}
        <div className="reveal flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-teal-light/65 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary max-w-fit">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            Premium Dental Care & Technology
          </div>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.1] text-foreground sm:text-6xl">
            A Healthier, Brighter <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Smile</span> Starts Here
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Welcome to Dent-Ist, where clinical precision meets luxurious comfort. Our dental specialists use advanced guided technology to deliver pain-free, custom dental treatments for the whole family.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/appointment">Book Appointment</Button>
            <Button href="/services" variant="secondary">
              Explore Services
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="glass slide-up flex flex-col justify-center rounded-2xl p-8 border border-white/60">
          <div className="grid gap-6 sm:grid-cols-2">
            <StatCard label="Specialist Doctors" value={String(doctors.length)} note="Certified Experts" />
            <StatCard label="Dental Services" value={String(services.length)} note="End-to-End Care" />
            <StatCard label="Satisfaction Rate" value="99.4%" note="Patient Feedback" />
            <StatCard label="Clinic Tech" value="Guided" note="3D Scanning & Design" />
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-teal-light/40 border-y border-border/20 py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Our Expertise
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              World-Class Dental Procedures
            </h2>
            <p className="mt-4 text-muted">
              We specialize in a wide range of dental disciplines, using modern techniques and materials for long-lasting oral health.
            </p>
          </div>

          {services.length === 0 ? (
            <div className="mt-12 flex flex-col items-center gap-4 py-8 text-center">
              <p className="text-sm text-muted">No dental services listed yet. Services added by the admin will appear here.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="soft-card flex flex-col justify-between rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary"
                >
                  <div>
                    <div className="clay-inset flex h-12 w-12 items-center justify-center rounded-lg text-primary mb-5">
                      {service.icon === "tooth" ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.22a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                      ) : service.icon === "sparkles" ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                      ) : service.icon === "aligners" ? (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z"/></svg>
                      ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                      )}
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4 text-xs font-semibold text-muted">
                    <span>Starting at {service.price || "—"}</span>
                    <Link href="/services" className="text-primary hover:text-primary-dark">Read More &rarr;</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Specialist Doctors Section */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Meet Specialists
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Team of Certified Dental Surgeons
            </h2>
            <p className="mt-4 text-muted">
              Our clinicians hold advanced degrees and are committed to continuous training in cutting-edge dentistry.
            </p>
          </div>

          {doctors.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-sm text-muted">No specialists listed yet. Doctors added by the admin will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Strip Section */}
      <section className="bg-teal-light/20 py-20 border-t border-border/20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Patient Stories
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Our Patients Love Us
            </h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <p className="text-sm text-muted">No reviews submitted yet. Submitting reviews will make them appear here once approved.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.id} className="glass rounded-xl p-6 border border-white/60">
                  <div className="flex items-center gap-1 text-gold mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed text-foreground">&quot;{t.review}&quot;</p>
                  <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
                    <span className="text-sm font-bold text-foreground">{t.patientName}</span>
                    <span className="rounded bg-teal-light px-2 py-0.5 text-xs font-semibold text-primary">{t.treatment}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20 text-white text-center">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Ready to Experience Premium Care?
          </h2>
          <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg leading-relaxed">
            Schedule your appointment online in under 2 minutes. We accept major insurances and offer flexible payment plans.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button href="/appointment" className="bg-white text-primary hover:bg-teal-light shadow-none">
              Book Appointment Now
            </Button>
            <Button href="/contact" variant="secondary" className="border-white/40 bg-transparent text-white hover:border-white hover:text-white hover:bg-white/10 shadow-none">
              Contact Clinic
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
