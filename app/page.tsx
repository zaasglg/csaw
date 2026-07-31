import { About } from "@/components/sections/About"
import { Contacts } from "@/components/sections/Contacts"
import { Footer } from "@/components/sections/Footer"
import { Hackathon } from "@/components/sections/Hackathon"
import { HackathonRegister } from "@/components/sections/HackathonRegister"
import { HeroSection } from "@/components/sections/HeroSection"
import { Mangystau } from "@/components/sections/Mangystau"
import { ParticipantRegister } from "@/components/sections/ParticipantRegister"
import { Program } from "@/components/sections/Program"
import { Speakers } from "@/components/sections/Speakers"
import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { WaveBackground } from "@/components/visual/WaveBackground"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  const speakers = await prisma.speaker.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })

  return (
    <SmoothScroll>
      <main className="mesh-page relative isolate overflow-x-clip text-primary-900">
        <WaveBackground />
        <div className="site-grain" aria-hidden />
        <div className="relative z-10">
          <HeroSection />
          <About />
          <Hackathon />
          <HackathonRegister />
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
