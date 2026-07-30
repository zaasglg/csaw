import type { Metadata } from "next";
import "./globals.css";

import { LocaleProvider } from "@/components/providers/LocaleProvider";

export const metadata: Metadata = {
  title: "Caspian Sea Action Week 2026 | Aktau, Kazakhstan",
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
    <html
      lang="kk"
      className="dark h-full antialiased"
    >
      <body className="min-h-full flex flex-col selection:bg-accent selection:text-primary-900">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
