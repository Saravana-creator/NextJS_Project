"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type Message = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  useEffect(() => { void fetchMessages(); }, []);

  async function fetchMessages() {
    setLoading(true);
    try {
      const res = await fetch("/api/contact");
      if (res.ok) {
        const result = await res.json();
        if (result.success) setMessages(result.data.messages);
      }
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    try {
      await fetch(`/api/contact/${id}`, { method: "PATCH" });
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
      setSelected((prev) => (prev?._id === id ? { ...prev, isRead: true } : prev));
    } catch { /* silent */ }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (selected?._id === id) setSelected(null);
  }

  function openMessage(msg: Message) {
    setSelected(msg);
    if (!msg.isRead) void markRead(msg._id);
  }

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read") return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <DashboardShell mode="admin">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Inbox</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">
          Messages
          {unreadCount > 0 && (
            <span className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </h1>
        <p className="mt-2 text-sm text-muted">Contact form submissions from patients and visitors.</p>

        <div className="mt-6 flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${filter === f ? "bg-primary text-white" : "border border-border/40 bg-white/60 text-muted hover:border-primary hover:text-primary"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Message list */}
          <div className="overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted">
                <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                Loading messages…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="font-bold text-foreground">No messages</p>
                <p className="mt-1 text-sm text-muted">Your inbox is empty.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {filtered.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left px-5 py-4 transition hover:bg-teal-light/30 ${selected?._id === msg._id ? "bg-teal-light/40" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm ${msg.isRead ? "font-semibold text-foreground" : "font-extrabold text-foreground"}`}>
                        {msg.name}
                        {!msg.isRead && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                      </p>
                      <span className="text-xs text-muted shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted truncate">{msg.subject || "No subject"}</p>
                    <p className="mt-1 text-xs text-muted truncate">{msg.message}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message detail */}
          <div className="rounded-2xl border border-border/40 bg-white/70 shadow-sm p-6">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-foreground">{selected.subject || "No subject"}</h3>
                    <p className="mt-1 text-sm text-muted">
                      From <strong>{selected.name}</strong> &lt;{selected.email}&gt;
                      {selected.phone && <> · {selected.phone}</>}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(selected.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </div>
                  <button
                    onClick={() => void handleDelete(selected._id)}
                    className="shrink-0 rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-5 rounded-xl bg-teal-light/30 p-5">
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{selected.message}</p>
                </div>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? ""}`}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
                >
                  Reply via Email
                </a>
              </>
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
                <svg className="h-10 w-10 text-border/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <p className="mt-3 text-sm text-muted">Select a message to read it</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
