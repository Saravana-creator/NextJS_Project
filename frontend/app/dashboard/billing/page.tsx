"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Invoice = {
  _id: string;
  patientName: string;
  patientEmail: string;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "unpaid" | "pending";
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 border-emerald-100",
  unpaid: "bg-red-50 text-red-600 border-red-100",
  pending: "bg-amber-50 text-amber-700 border-amber-100",
};

export default function PatientBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchMyInvoices();
  }, []);

  async function fetchMyInvoices() {
    try {
      const res = await fetch("/api/billing");
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setInvoices(result.data.bills);
        }
      }
    } catch (err) {
      console.error("Error fetching patient invoices:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayInvoice(id: string) {
    setPayingId(id);
    try {
      const res = await fetch(`/api/billing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "paid",
          paymentMethod: "Credit Card (Online Portal)",
          paidAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setInvoices((prev) =>
          prev.map((inv) => (inv._id === id ? { ...inv, status: "paid", paymentMethod: "Credit Card (Online Portal)" } : inv))
        );
        alert("Payment successful! Thank you.");
      } else {
        const result = await res.json();
        alert(result.error ?? "Failed to process payment");
      }
    } catch {
      alert("Network error.");
    } finally {
      setPayingId(null);
    }
  }

  return (
    <DashboardShell mode="patient">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Patient Portal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Billing &amp; Payments</h1>
        <p className="mt-2 text-sm text-muted">
          Review outstanding statements, check payment histories, and pay balances directly online.
        </p>

        {loading ? (
          <div className="mt-10 flex h-48 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Fetching invoice ledger…
          </div>
        ) : invoices.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-12 text-center">
            <div className="clay-inset flex h-14 w-14 items-center justify-center rounded-full text-primary mb-4">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-display text-lg font-bold text-foreground">No invoices recorded</h4>
            <p className="mt-1 text-sm text-muted max-w-sm">
              Your account has a clean balance sheet. All invoice summaries will display here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {invoices.map((item) => (
              <div
                key={item._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/40 bg-white/70 p-6 shadow-sm transition hover:shadow-md hover:bg-white"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">{item.invoiceNumber}</span>
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLES[item.status] ?? ""}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-3xl font-extrabold text-foreground">
                    ₹{item.amount.toFixed(2)}
                  </h3>

                  <div className="mt-5 space-y-2 border-t border-border/30 pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted font-medium">Issue Date:</span>
                      <span className="font-bold text-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted font-medium">Due Date:</span>
                      <span className="font-bold text-foreground">
                        {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {item.status === "paid" && (
                      <div className="flex justify-between">
                        <span className="text-muted font-medium">Method:</span>
                        <span className="font-bold text-emerald-600">{item.paymentMethod || "Credit Card"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {item.status !== "paid" ? (
                    <button
                      onClick={() => void handlePayInvoice(item._id)}
                      disabled={payingId === item._id}
                      className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
                    >
                      {payingId === item._id ? "Processing…" : "Pay Invoice"}
                    </button>
                  ) : (
                    <div className="w-full text-center rounded-xl bg-emerald-50 border border-emerald-200 py-2.5 text-sm font-bold text-emerald-700">
                      Invoice Settled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
