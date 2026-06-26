import { doctors } from "@/data/doctors";

export const api = {
  doctors: {
    list: async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ??
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        const res = await fetch(`${baseUrl}/api/doctors?activeOnly=true`, {
          next: { revalidate: 60 },
        });
        if (!res.ok) return [];
        const json = await res.json();
        return json.success && json.data && Array.isArray(json.data.doctors) ? json.data.doctors : [];
      } catch (err) {
        console.error("api.doctors.list failed:", err);
        return [];
      }
    },
    getBySlug: async (slug: string) => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ??
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        const res = await fetch(`${baseUrl}/api/doctors?activeOnly=false`, {
          next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.success || !json.data || !Array.isArray(json.data.doctors)) return null;
        return json.data.doctors.find((d: any) => d.slug === slug) ?? null;
      } catch (err) {
        console.error("api.doctors.getBySlug failed:", err);
        return null;
      }
    },
  },
};
