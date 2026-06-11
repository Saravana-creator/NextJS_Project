import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Sora } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dent-Ist Dental Hospital Platform",
    template: "%s | Dent-Ist",
  },
  description:
    "Premium dental hospital website, patient portal, and admin command center prepared for backend integration.",
  openGraph: {
    title: "Dent-Ist Dental Hospital Platform",
    description:
      "Enterprise-grade dental care platform for patients, doctors, and hospital teams.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dent-Ist Dental Hospital Platform",
    description:
      "Premium dental hospital website, patient portal, and admin command center.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${jakarta.variable}`}
    >
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
