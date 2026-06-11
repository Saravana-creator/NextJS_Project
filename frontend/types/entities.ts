export type Doctor = {
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

export type EmptyCollectionKey =
  | "patients"
  | "services"
  | "appointments"
  | "testimonials"
  | "blogs"
  | "pricingPlans"
  | "insurancePartners"
  | "contactMessages"
  | "medicalRecords"
  | "notifications"
  | "analytics";
