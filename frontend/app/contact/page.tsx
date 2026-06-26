"use client";

import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Section } from "@/components/ui/section";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit message");
      }

      setSuccess(result.data.message || "Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <Section
        eyebrow="Get In Touch"
        title="We'd Love to Hear From You"
        description="Whether you have questions about pricing, treatments, or scheduling, our professional reception team is here to assist."
      >
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] mt-6">
          {/* Contact Form */}
          <div>
            {success && (
              <div className="mb-6 rounded-xl border border-success/30 bg-success/10 p-5 text-sm font-semibold text-success flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <p className="font-bold text-foreground text-base">Message Sent</p>
                  <p className="text-muted mt-1">{success}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-error/30 bg-error/10 p-5 text-sm font-semibold text-error flex items-center gap-3">
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="soft-card grid gap-5 rounded-2xl p-8 border border-white/60">
              <h3 className="font-display text-lg font-bold text-foreground">Send Us a Message</h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-muted">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none"
                    placeholder="General Inquiry"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="rounded-lg border border-border/60 bg-white/50 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 min-h-12 w-full rounded-lg bg-primary hover:bg-primary-dark font-bold text-white transition-all text-sm shadow-md disabled:bg-primary/50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Details / Hours */}
          <div className="flex flex-col gap-6">
            <div className="glass rounded-2xl p-6 border border-white/60">
              <h4 className="font-display text-base font-bold text-foreground">Clinic Information</h4>
              <ul className="mt-5 flex flex-col gap-4 text-sm text-muted">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <div>
                    <p className="font-bold text-foreground">Clinic Address</p>
                    <p className="mt-0.5">123 Dental Suite, Floor 4, Premium Heights, Manhattan, NY 10001</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <div>
                    <p className="font-bold text-foreground">Phone Support</p>
                    <p className="mt-0.5">+1 (555) DENT-IST</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <div>
                    <p className="font-bold text-foreground">Email Address</p>
                    <p className="mt-0.5">care@dent-ist.com</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="soft-card rounded-2xl p-6">
              <h4 className="font-display text-base font-bold text-foreground">Opening Hours</h4>
              <dl className="mt-4 grid gap-3 text-sm text-muted">
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <dt>Monday - Friday</dt>
                  <dd className="font-bold text-foreground">08:00 AM - 07:00 PM</dd>
                </div>
                <div className="flex justify-between border-b border-border/30 pb-2">
                  <dt>Saturday</dt>
                  <dd className="font-bold text-foreground">09:00 AM - 04:00 PM</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Sunday</dt>
                  <dd className="font-semibold text-primary">Emergency Only</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
