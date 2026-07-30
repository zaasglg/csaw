import { About } from "@/components/sections/About"
import { Footer } from "@/components/sections/Footer"
import { Hackathon } from "@/components/sections/Hackathon"
import { HackathonRegister } from "@/components/sections/HackathonRegister"
import { HeroSection } from "@/components/sections/HeroSection"
import { ImmersiveBreak } from "@/components/sections/ImmersiveBreak"
import { Mangystau } from "@/components/sections/Mangystau"
import { ParticipantRegister } from "@/components/sections/ParticipantRegister"
import { Program } from "@/components/sections/Program"
import { Speakers } from "@/components/sections/Speakers"
import { SmoothScroll } from "@/components/providers/SmoothScroll"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function Home() {
  const speakers = await prisma.speaker.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })

  return (
    <SmoothScroll>
      <main className="relative overflow-x-clip bg-white text-primary-900">
        <div className="site-grain" aria-hidden />
        <HeroSection />
        <About />
        <Hackathon />
        <HackathonRegister />
        <Speakers speakers={speakers} />
        <Program />
        <ParticipantRegister />
        <ImmersiveBreak />
        <Mangystau />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
