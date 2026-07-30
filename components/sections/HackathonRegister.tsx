"use client"

import {
  ArrowRight,
  ChevronDown,
  Plus,
  Send,
  X,
} from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { type SubmitEvent, useState } from "react"

import { FormSuccess } from "@/components/interactive/FormSuccess"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MAX_HACKATHON_TEAM_MEMBERS } from "@/lib/constants"

const ease = [0.16, 1, 0.3, 1] as const
const MAX_MEMBERS = MAX_HACKATHON_TEAM_MEMBERS

interface TeamInfo {
  teamName: string
  country: string
  region: string
  captainName: string
}

interface TeamMember {
  fullName: string
  countryNationality: string
  organization: string
  specialty: string
}

const createEmptyMember = (): TeamMember => ({
  fullName: "",
  countryNationality: "",
  organization: "",
  specialty: "",
})

const inputClassName =
  "h-12 w-full rounded-sm border border-primary-200 bg-primary-50 px-4 text-primary-900 placeholder:text-primary-400 focus-visible:border-[#E0A82E] focus-visible:ring-2 focus-visible:ring-[#E0A82E]/20"

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1 text-[14px] font-semibold text-primary-700">
      {children}
      <span aria-hidden className="text-accent-700">
        *
      </span>
    </span>
  )
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-dashed border-primary-300 bg-primary-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary-600">
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400/60" />
        <span className="relative inline-flex size-1.5 rounded-full bg-primary-500/80" />
      </span>
      {label}
    </span>
  )
}

export function HackathonRegister() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("hackathonRegister")
  const caspianCountries = useTranslations("common").raw("countries") as string[]
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    teamName: "",
    country: "",
    region: "",
    captainName: "",
  })
  const [members, setMembers] = useState<TeamMember[]>([createEmptyMember()])
  const [activeMember, setActiveMember] = useState(0)

  function updateTeamInfo<K extends keyof TeamInfo>(key: K, value: TeamInfo[K]) {
    setTeamInfo((prev) => ({ ...prev, [key]: value }))
  }

  function updateMember<K extends keyof TeamMember>(
    index: number,
    key: K,
    value: TeamMember[K],
  ) {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [key]: value } : member,
      ),
    )
  }

  function addMember() {
    if (members.length >= MAX_MEMBERS) return
    setMembers((prev) => [...prev, createEmptyMember()])
    setActiveMember(members.length)
  }

  function removeMember(index: number) {
    if (index === 0 || members.length <= 1) return
    setMembers((prev) => prev.filter((_, i) => i !== index))
    setActiveMember((prev) => (prev >= index ? Math.max(0, prev - 1) : prev))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("sending")

    try {
      const response = await fetch("/api/hackathon-teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...teamInfo, members }),
      })

      if (!response.ok) throw new Error("request_failed")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      id="hackathon-register"
      aria-labelledby="hackathon-register-title"
      className="mesh-surface-white relative overflow-hidden border-y border-[#E0A82E]/25 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease }}
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-[#E0A82E]" aria-hidden />
            <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-accent-700 sm:text-xs">
              {t("overline")}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <h2
              id="hackathon-register-title"
              className="max-w-[20ch] text-[clamp(2.3rem,4.4vw,4rem)] leading-[0.98] font-black tracking-[-0.04em] text-primary-900"
            >
              {t("heading")}
            </h2>
            <StatusBadge label={t("statusBadge")} />
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mt-10 overflow-hidden rounded-sm border border-[#E0A82E]/40 bg-white shadow-[0_30px_100px_rgba(11,29,51,0.16)]"
        >
          <AnimatePresence mode="wait" initial={false}>
          {status === "success" ? (
            <FormSuccess
              key="success"
              title={t("successTitle")}
              description={t("successDescription")}
              buttonLabel={t("newApplication")}
              onReset={() => {
                setTeamInfo({
                  teamName: "",
                  country: "",
                  region: "",
                  captainName: "",
                })
                setMembers([createEmptyMember()])
                setActiveMember(0)
                setStatus("idle")
              }}
              iconBoxClassName="mx-auto mb-5 grid size-14 place-items-center border border-[#E0A82E]/60 bg-[#E0A82E] text-primary-900"
              buttonClassName="mt-8 h-11 rounded-sm border border-[#E0A82E] bg-[#E0A82E] px-6 text-[15px] font-bold text-primary-900 hover:bg-[#EFC158]"
            />
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}>
              <div className="border-b border-[#E0A82E]/25 bg-primary-50 px-6 py-4 sm:px-10">
                <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-accent-700">
                  {t("cardKicker")}
                </p>
              </div>

              <div className="px-6 py-8 sm:px-10">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary-500">
                  {t("block1Title")}
                </h3>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2.5 sm:col-span-2">
                    <FieldLabel>{t("teamName")}</FieldLabel>
                    <Input
                      required
                      name="teamName"
                      placeholder={t("teamName")}
                      value={teamInfo.teamName}
                      onChange={(event) =>
                        updateTeamInfo("teamName", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2.5">
                    <FieldLabel>{t("teamCountry")}</FieldLabel>
                    <div className="relative">
                      <select
                        required
                        name="country"
                        value={teamInfo.country}
                        onChange={(event) =>
                          updateTeamInfo("country", event.target.value)
                        }
                        className={`${inputClassName} appearance-none pr-10`}
                      >
                        <option value="" disabled>
                          {t("teamCountryPlaceholder")}
                        </option>
                        {caspianCountries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        aria-hidden
                        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-primary-400"
                      />
                    </div>
                  </label>

                  <label className="grid gap-2.5">
                    <FieldLabel>{t("region")}</FieldLabel>
                    <Input
                      required
                      name="region"
                      placeholder={t("regionPlaceholder")}
                      value={teamInfo.region}
                      onChange={(event) =>
                        updateTeamInfo("region", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2.5 sm:col-span-2">
                    <FieldLabel>{t("captainName")}</FieldLabel>
                    <Input
                      required
                      name="captainName"
                      autoComplete="name"
                      placeholder={t("captainNamePlaceholder")}
                      value={teamInfo.captainName}
                      onChange={(event) =>
                        updateTeamInfo("captainName", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </label>
                </div>

                <div className="mt-10 border border-[#E0A82E]/20 bg-primary-50 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-primary-500">
                      {t("block2Title")}
                    </h3>
                    <button
                      type="button"
                      onClick={addMember}
                      disabled={members.length >= MAX_MEMBERS}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-[#E0A82E]/40 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-accent-700 transition-colors hover:border-[#E0A82E] hover:text-accent-800 disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Plus className="size-3.5" />
                      {t("addMember")}
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {members.map((_, index) => {
                      const selected = activeMember === index

                      return (
                        <div key={index} className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveMember(index)}
                            className={`rounded-sm border px-3 py-2 text-[12px] font-bold uppercase tracking-[0.04em] transition-colors ${
                              selected
                                ? "border-[#E0A82E] bg-[#E0A82E] text-primary-900"
                                : "border-primary-200 bg-white text-primary-600 hover:border-[#E0A82E]/50 hover:text-primary-900"
                            }`}
                          >
                            {index === 0
                              ? t("memberCaptainTab")
                              : t("memberTab", { n: index + 1 })}
                          </button>
                          {index > 0 ? (
                            <button
                              type="button"
                              onClick={() => removeMember(index)}
                              aria-label={t("removeMember", { n: index + 1 })}
                              className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full border border-primary-300 bg-white text-primary-500 transition-colors hover:border-destructive hover:text-destructive"
                            >
                              <X className="size-2.5" />
                            </button>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeMember}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease }}
                      className="mt-6 grid gap-5 sm:grid-cols-2"
                    >
                      <label className="grid gap-2.5 sm:col-span-2">
                        <FieldLabel>{t("memberFullName")}</FieldLabel>
                        <Input
                          required
                          autoComplete="name"
                          placeholder={t("memberFullNamePlaceholder")}
                          value={members[activeMember]?.fullName ?? ""}
                          onChange={(event) =>
                            updateMember(activeMember, "fullName", event.target.value)
                          }
                          className={inputClassName}
                        />
                      </label>

                      <label className="grid gap-2.5">
                        <FieldLabel>{t("memberCountryNationality")}</FieldLabel>
                        <Input
                          required
                          placeholder={t("memberCountryNationalityPlaceholder")}
                          value={members[activeMember]?.countryNationality ?? ""}
                          onChange={(event) =>
                            updateMember(
                              activeMember,
                              "countryNationality",
                              event.target.value,
                            )
                          }
                          className={inputClassName}
                        />
                      </label>

                      <label className="grid gap-2.5">
                        <FieldLabel>{t("memberOrganization")}</FieldLabel>
                        <Input
                          required
                          placeholder={t("memberOrganizationPlaceholder")}
                          value={members[activeMember]?.organization ?? ""}
                          onChange={(event) =>
                            updateMember(
                              activeMember,
                              "organization",
                              event.target.value,
                            )
                          }
                          className={inputClassName}
                        />
                      </label>

                      <label className="grid gap-2.5 sm:col-span-2">
                        <FieldLabel>{t("memberSpecialty")}</FieldLabel>
                        <Input
                          required
                          placeholder={t("memberSpecialtyPlaceholder")}
                          value={members[activeMember]?.specialty ?? ""}
                          onChange={(event) =>
                            updateMember(activeMember, "specialty", event.target.value)
                          }
                          className={inputClassName}
                        />
                      </label>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col items-stretch justify-between gap-3 border-t border-[#E0A82E]/20 bg-primary-50 px-6 py-6 sm:flex-row sm:items-center sm:px-10">
                {status === "error" ? (
                  <p className="text-[14px] font-semibold text-destructive">
                    {t("errorMessage")}
                  </p>
                ) : (
                  <span />
                )}
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-11 rounded-sm border border-[#E0A82E] bg-[#E0A82E] px-7 text-[15px] font-bold text-primary-900 hover:bg-[#EFC158] active:scale-[0.98]"
                >
                  {status === "sending" ? t("sending") : t("submit")}
                  {status === "idle" && <ArrowRight className="size-4" />}
                  {status === "sending" && <Send className="size-4" />}
                </Button>
              </div>
            </motion.form>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
