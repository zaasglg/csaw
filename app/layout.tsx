import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { LocaleProvider } from "@/components/providers/LocaleProvider";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CASPIAN SEA ACTION WEEK | ХАЛЫҚАРАЛЫҚ ІС-ҚИМЫЛ АПТАЛЫҒЫ",
  description:
    "International action week uniting the Caspian region through ecology, volunteering and innovation. 6-12 August 2026 in Aktau.",
  keywords: [
    "Caspian Sea Action Week",
    "CSAW 2026",
    "Aktau",
    "Mangystau",
    "Caspian Hackathon",
  ],
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
