"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type GalleryItem = {
  id: string;
  title: string;
  category: "Facilities" | "Treatments" | "Staff" | "Equipment";
  imageUrl: string;
  description: string;
};

const SEEDED_ITEMS: GalleryItem[] = [
  {
    id: "gal-001",
    title: "Modern Consultation Room",
    category: "Facilities",
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600",
    description: "Equipped with state-of-the-art ergonomic chairs and dental imaging diagnostics.",
  },
  {
    id: "gal-002",
    title: "Sterile Operating Suite",
    category: "Facilities",
    imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600",
    description: "Ensures highest standards of hygiene and infection control during oral surgery.",
  },
  {
    id: "gal-003",
    title: "Advanced 3D Dental Imaging",
    category: "Equipment",
    imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=600",
    description: "High-precision digital radiography for accurate dental implant planning.",
  },
  {
    id: "gal-004",
    title: "Clinical Hygiene Team",
    category: "Staff",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600",
    description: "Our dedicated dental hygienists and specialist clinic doctors.",
  },
];

const CATEGORIES = ["All", "Facilities", "Treatments", "Staff", "Equipment"] as const;

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(SEEDED_ITEMS);
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("All");
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryItem["category"]>("Facilities");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const filteredItems = items.filter(
    (item) => filter === "All" || item.category === filter
  );

  function handleAddItem() {
    if (!title || !imageUrl) return;
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title,
      category,
      imageUrl,
      description: description || "Clinic facilities photo",
    };
    setItems((prev) => [newItem, ...prev]);
    setShowModal(false);
    // Reset Form
    setTitle("");
    setImageUrl("");
    setDescription("");
  }

  function handleDelete(id: string) {
    if (confirm("Remove this image from gallery?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Media Hub</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Clinic Gallery</h1>
        <p className="mt-2 text-sm text-muted">
          Manage visual portfolios of clinic operatory chambers, advanced treatment tools, and clinical staff events.
        </p>

        {/* Filters and Add button */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${
                  filter === c
                    ? "bg-primary text-white"
                    : "border border-border/40 bg-white/60 text-muted hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
          >
            + Upload Photo
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                  {item.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-foreground text-lg">{item.title}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed h-12 overflow-hidden">{item.description}</p>
                <div className="mt-4 border-t border-border/30 pt-3 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                  >
                    Delete Photo
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center rounded-2xl border border-border/40 bg-white/50 p-10 text-center">
              <p className="font-bold text-foreground">No photos found</p>
              <p className="mt-1 text-sm text-muted">Try choosing a different category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <h2 className="font-display text-xl font-extrabold text-foreground">Add Gallery Photo</h2>
            
            <div className="mt-5 grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Photo Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. Surgery Room A"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="Facilities">Facilities</option>
                  <option value="Treatments">Treatments</option>
                  <option value="Staff">Staff</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Image URL</label>
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary"
                  placeholder="e.g. https://images.unsplash.com/..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary resize-none"
                  placeholder="Short caption describing the image..."
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
                onClick={handleAddItem}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition"
              >
                Upload Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
