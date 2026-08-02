import { About } from "@/components/sections/About"
import { Contacts } from "@/components/sections/Contacts"
import { Footer } from "@/components/sections/Footer"
import { Hackathon } from "@/components/sections/Hackathon"
import { HeroSection } from "@/components/sections/HeroSection"
import { Mangystau } from "@/components/sections/Mangystau"
import { ParticipantRegister } from "@/components/sections/ParticipantRegister"
import { Program } from "@/components/sections/Program"
import { Speakers } from "@/components/sections/Speakers"
import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { WaveBackground } from "@/components/visual/WaveBackground"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Caspian Sea Action Week 2026",
  alternateName: ["CSAW 2026", "CSAW 2026 Aktau"],
  description:
    "International action week uniting the Caspian region through ecology, volunteering, innovation and the Caspian Hackathon.",
  startDate: "2026-08-06",
  endDate: "2026-08-12",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Aktau",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Aktau",
      addressRegion: "Mangystau Region",
      addressCountry: "KZ",
    },
  },
  image: [
    "https://csaw2026aktau.kz/images/caspian-sea-hero-poster.jpg",
    "https://csaw2026aktau.kz/images/hero_banner.jpg",
  ],
  url: "https://csaw2026aktau.kz/",
  organizer: {
    "@type": "Organization",
    name: "Caspian Sea Action Week",
    url: "https://csaw2026aktau.kz/",
    sameAs: [
      "https://www.instagram.com/csaw2026aktau/",
      "https://www.tiktok.com/@csaw2026",
    ],
  },
}

export default async function Home() {
  const speakers = await prisma.speaker.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })

  return (
    <SmoothScroll>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="mesh-page relative isolate overflow-x-clip text-primary-900">
        <WaveBackground />
        <div className="site-grain" aria-hidden />
        <div className="relative z-10">
          <HeroSection />
          <About />
          <Hackathon />
          <Speakers speakers={speakers} />
          <Program />
          <ParticipantRegister />
          <Mangystau />
          <Contacts />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  )
}
