"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth-provider";

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  coverImage?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
};

type BlogForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tagsString: string;
  isPublished: boolean;
};

const EMPTY_FORM: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  tagsString: "",
  isPublished: false,
};

export default function AdminBlogsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs?publishedOnly=false");
      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setPosts(result.data.posts);
        }
      }
    } catch (err) {
      console.error("Error fetching admin blogs:", err);
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  }

  function openEdit(post: BlogPost) {
    setEditTarget(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tagsString: post.tags?.join(", ") ?? "",
      isPublished: post.isPublished,
    });
    setError(null);
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title || !form.slug || !form.excerpt || !form.content) {
      setError("Please fill out all required fields.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const tags = form.tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const url = editTarget ? `/api/blogs/${editTarget._id}` : "/api/blogs";
      const method = editTarget ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          tags,
          isPublished: form.isPublished,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        setError(result.error ?? "Failed to save blog post");
        return;
      }

      setShowModal(false);
      await fetchPosts();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch {
      alert("Network error.");
    }
  }

  return (
    <DashboardShell mode="admin">
      <section className="reveal">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Content Hub</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground">Blog Management</h1>
        <p className="mt-2 text-sm text-muted">
          Draft and publish clinical articles, dental care tutorials, and news updates.
        </p>

        <div className="mt-8 flex justify-end">
          <button
            onClick={openAdd}
            className="min-h-11 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-primary-dark transition"
          >
            + Write Article
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex h-40 items-center justify-center rounded-2xl border border-border/40 bg-white/50 text-sm text-muted">
            <svg className="h-5 w-5 animate-spin text-primary mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading article entries…
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/40 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-teal-light/50 font-bold text-foreground">
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Tags</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {posts.map((post) => (
                    <tr key={post._id} className="hover:bg-white/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{post.title}</p>
                        <p className="text-xs text-muted mt-0.5 max-w-sm truncate">{post.excerpt}</p>
                      </td>
                      <td className="px-6 py-4 text-muted font-medium">{post.authorName}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {post.tags?.map((t) => (
                            <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200/50">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${post.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {post.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(post)}
                            className="rounded border border-border/60 px-3 py-1.5 text-xs font-semibold hover:border-primary hover:text-primary transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(post._id)}
                            className="rounded border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted">
                        No articles written yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 my-8">
            <h2 className="font-display text-xl font-extrabold text-foreground">
              {editTarget ? "Edit Article" : "Write New Article"}
            </h2>
            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200">
                {error}
              </p>
            )}

            <div className="mt-5 grid gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Article Headline"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">URL Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="article-headline-slug"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Tags (comma-separated)</label>
                <input
                  value={form.tagsString}
                  onChange={(e) => setForm((f) => ({ ...f, tagsString: e.target.value }))}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Hygiene, Dental Care, Cosmetic"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Excerpt</label>
                <input
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  placeholder="Short outline summarizing the article..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">Body Content</label>
                <textarea
                  rows={5}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="rounded-lg border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                  placeholder="Full markdown/text content..."
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isPublished" className="text-sm font-semibold text-foreground cursor-pointer">
                  Publish article immediately
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border/60 px-5 py-2.5 text-sm font-semibold text-muted hover:border-primary hover:text-primary transition"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleSave()}
                disabled={saving}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-60"
              >
                {saving ? "Saving…" : editTarget ? "Save Changes" : "Create Article"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
