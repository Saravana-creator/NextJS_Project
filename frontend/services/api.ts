import { doctors } from "@/data/doctors";

export const api = {
  doctors: {
    list: async () => doctors,
    getBySlug: async (slug: string) =>
      doctors.find((doctor) => doctor.slug === slug) ?? null,
  },
};
