import type { MetadataRoute } from "next"

const siteUrl = "https://csaw2026aktau.kz"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${siteUrl}/images/caspian-sea-hero-poster.jpg`,
        `${siteUrl}/images/hero_banner.jpg`,
      ],
    },
  ]
}
