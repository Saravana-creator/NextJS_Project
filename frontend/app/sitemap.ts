import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/doctors",
  "/services",
  "/appointment",
  "/emergency",
  "/gallery",
  "/testimonials",
  "/pricing",
  "/insurance",
  "/blog",
  "/faq",
  "/contact",
  "/careers",
  "/privacy",
  "/terms",
  "/cookies",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dent-ist.example";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
