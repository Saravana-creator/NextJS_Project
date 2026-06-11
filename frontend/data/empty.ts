import type { EmptyCollectionKey } from "@/types/entities";

export const emptyCollections: Record<EmptyCollectionKey, []> = {
  patients: [],
  services: [],
  appointments: [],
  testimonials: [],
  blogs: [],
  pricingPlans: [],
  insurancePartners: [],
  contactMessages: [],
  medicalRecords: [],
  notifications: [],
  analytics: [],
};
