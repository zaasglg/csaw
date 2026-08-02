import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { LocaleProvider } from "@/components/providers/LocaleProvider";

const siteUrl = "https://csaw2026aktau.kz";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Caspian Sea Action Week 2026 in Aktau | CSAW 2026",
    template: "%s | CSAW 2026",
  },
  description:
    "Caspian Sea Action Week 2026 (CSAW 2026) in Aktau, Kazakhstan, 6–12 August. An international week of ecology, volunteering, innovation and the Caspian Hackathon.",
  applicationName: "Caspian Sea Action Week 2026",
  authors: [{ name: "Caspian Sea Action Week" }],
  creator: "Caspian Sea Action Week",
  publisher: "Caspian Sea Action Week",
  keywords: [
    "Caspian Sea Action Week",
    "Caspian Sea Action Week 2026",
    "CSAW 2026",
    "CSAW 2026 Aktau",
    "CSAW Aktau",
    "Aktau",
    "Aktau 2026",
    "Актау",
    "Caspian Sea",
    "Mangystau",
    "Caspian Hackathon",
    "Каспийское море",
    "экология Каспийского моря",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Caspian Sea Action Week",
    title: "Caspian Sea Action Week 2026 in Aktau | CSAW 2026",
    description:
      "International ecology, volunteering and innovation week in Aktau, Kazakhstan, 6–12 August 2026.",
    locale: "en_US",
    alternateLocale: ["ru_RU", "kk_KZ"],
    images: [
      {
        url: "/images/caspian-sea-hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "Caspian Sea Action Week 2026 in Aktau",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caspian Sea Action Week 2026 in Aktau | CSAW 2026",
    description:
      "International ecology, volunteering and innovation week in Aktau, 6–12 August 2026.",
    images: ["/images/caspian-sea-hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col selection:bg-accent selection:text-primary-900">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
