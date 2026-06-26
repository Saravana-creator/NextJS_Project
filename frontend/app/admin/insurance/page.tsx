"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Partner = {
  id: string;
  name: string;
  planType: string;
  coverage: string;
  contactEmail: string;
  phone: string;
  isActive: boolean;
};

const SEEDED_PARTNERS: Partner[] = [
  {
    id: "part-001",
    name: "Delta Dental",
    planType: "PPO & Premier",
    coverage: "100% Preventative, 80% Basic, 50% Major procedures",
    contactEmail: "providers@deltadental.com",
    phone: "(800) 521-2651",
    isActive: true,
  },
  {
    id: "part-002",
    name: "Cigna Dental",
    planType: "DPPO",
    coverage: "100% Routine Cleaning, 70% Basic Restorative",
    contactEmail: "benefits@cigna.com",
    phone: "(800) 997-1654",
    isActive: true,
  },
  {
    id: "part-003",
    name: "BlueCross BlueShield",
    planType: "Dental Blue",
    coverage: "100% Preventative care, 50% Orthodontic aligners",
    contactEmail: "claims@bcbsdental.com",
    phone: "(888) 223-1140",
    isActive: true,
  },
  {
    id: "part-004",
    name: "MetLife Dental",
    planType: "PDP Plus",
    coverage: "90% Preventive care, 60% Major treatments",
    contactEmail: "support@metlifedental.com",
    phone: "(877) 638-2055",
    isActive: false,
  },
];

export default function AdminInsurancePage() {
  const [partners, setPartners] = useState<Partner[]>(SEEDED_PARTNERS);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [planType, setPlanType] = useState("");
  const [coverage, setCoverage] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phone, setPhone] = useState("");

  function toggleActive(id: string) {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  }

  function handleAddPartner() {
    if (!name || !planType || !coverage) return;
    const newPartner: Partner = {
      id: `part-${Date.now()}`,
      name,
      planType,
      coverage,
      contactEmail: contactEmail || "info@insurance.com",
      phone: phone || "N/A",
      isActive: true,
    };
    setPartners((prev) => [...prev, newPartner]);
    setShowModal(false);
    // Reset Form
    setName("");
    setPlanType("");
    setCoverage("");
    setContactEmail("");
    setPhone("");
  }

  function handleDelete(id: string) {
    if (confirm("Remove this insurance partner?")) {
      setPartners((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Clinic Partners</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Insurance Providers</h1>
        <p className="mt-2 text-sm text-muted">
          Manage accepted insurance network plans, verify coverage metrics, and maintain billing channels.
        </p>

        <div className="mt-8 flex justify-end">
          <button
            onClick={() => setShowModal(true)}
            className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
          >
            + Add Provider
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                  <th className="px-6 py-4">Insurance Network</th>
                  <th className="px-6 py-4">Plan Type</th>
                  <th className="px-6 py-4">Coverage Description</th>
                  <th className="px-6 py-4">Support Contact</th>
                  <th className="px-6 py-4">Network Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-white/50 transition">
                    <td className="px-6 py-4 font-bold text-foreground">{p.name}</td>
                    <td className="px-6 py-4 text-muted font-semibold">{p.planType}</td>
                    <td className="px-6 py-4 text-muted max-w-xs">{p.coverage}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-foreground font-medium">{p.contactEmail}</p>
                      <p className="text-[10px] text-muted">{p.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                        {p.isActive ? "Accepted" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleActive(p.id)}
                          className={`rounded px-2.5 py-1 text-xs font-semibold text-white transition ${p.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                        >
                          {p.isActive ? "Suspend" : "Accept"}
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded border border-red-200 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add Provider Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-extrabold text-foreground">Add Insurance Partner</h2>
            
            <div className="mt-5 grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Network Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. Aetna Dental"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Plan Type</label>
                <input
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. PPO / HMO"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Coverage Overview</label>
                <input
                  value={coverage}
                  onChange={(e) => setCoverage(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. 100% Routine, 50% Restorative"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Support Email</label>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. benefits@aetna.com"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Support Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. (800) 123-4567"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPartner}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition"
              >
                Add Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
