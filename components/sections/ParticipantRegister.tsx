"use client"

import { ChevronDown, Mail, Phone, Send } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react"
import { useTranslations } from "next-intl"
import { type SubmitEvent, useState } from "react"

import { FormSuccess } from "@/components/interactive/FormSuccess"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ease = [0.16, 1, 0.3, 1] as const

type InfoLanguage = "" | "kk" | "ru" | "en"

interface RegistrationFormData {
  surname: string
  firstName: string
  patronymic: string
  birthDate: string
  citizenship: string
  country: string
  region: string
  category: string
  badgeName: string
  infoLanguage: InfoLanguage
  phone: string
  email: string
}

const initialFormData: RegistrationFormData = {
  surname: "",
  firstName: "",
  patronymic: "",
  birthDate: "",
  citizenship: "",
  country: "",
  region: "",
  category: "",
  badgeName: "",
  infoLanguage: "",
  phone: "",
  email: "",
}

const inputClassName =
  "h-12 rounded-sm border border-primary-200 bg-primary-50 px-4 text-primary-900 placeholder:text-primary-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"

const selectClassName = `${inputClassName} w-full appearance-none pr-10`

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

function SelectField({
  value,
  onChange,
  placeholder,
  options,
  name,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: string[]
  name: string
}) {
  return (
    <div className="relative">
      <select
        required
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClassName}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-primary-400"
      />
    </div>
  )
}

export function ParticipantRegister() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("register")
  const countries = useTranslations("common").raw("countries") as string[]
  const categories = t.raw("categories") as string[]
  const regionsByCountry = t.raw("regionsByCountry") as Record<string, string[]>
  const infoLanguageLabels = t.raw("infoLanguageOptions") as Array<{
    value: string
    label: string
  }>
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  )
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)

  const regionOptions = formData.country
    ? (regionsByCountry[formData.country] ?? [])
    : []
  const useRegionSelect = regionOptions.length > 0

  function updateField<K extends keyof RegistrationFormData>(
    key: K,
    value: RegistrationFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function updateCountry(value: string) {
    setFormData((prev) => ({ ...prev, country: value, region: "" }))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("sending")

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          infoLanguage: formData.infoLanguage || undefined,
        }),
      })

      if (!response.ok) throw new Error("request_failed")
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section
      id="register"
      aria-labelledby="register-title"
      className="mesh-surface-white relative overflow-hidden border-y border-accent/25 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="flex flex-col items-start gap-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease }}
            className="flex flex-col gap-8"
          >
            <h2 id="register-title" className="max-w-[18ch] section-title">
              {t("heading")}
            </h2>

            <p className="max-w-[46ch] text-[16px] leading-[1.6] text-primary-600 sm:text-lg">
              {t("description")}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="w-full"
          >
            <div className="relative overflow-hidden rounded-sm border border-accent/40 bg-white shadow-[0_30px_100px_rgba(11,29,51,0.16)]">
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <FormSuccess
                    key="success"
                    title={t("successTitle")}
                    description={t("successDescription")}
                    buttonLabel={t("newApplication")}
                    onReset={() => {
                      setFormData(initialFormData)
                      setStatus("idle")
                    }}
                    iconBoxClassName="mx-auto mb-5 grid size-14 place-items-center border border-accent-200 bg-accent text-primary-900"
                    buttonClassName="mt-8 h-11 rounded-sm border border-accent-300 bg-accent px-6 text-[15px] font-bold text-primary-900 hover:bg-accent-400"
                  />
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                  >
                    <div className="border-b border-accent/35 bg-primary-50 px-6 py-4 sm:px-8">
                      <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-accent-700">
                        {t("cardKicker")}
                      </p>
                    </div>

                    <div className="space-y-10 px-6 py-8 sm:px-8">
                      <div className="grid gap-5">
                          <div className="grid gap-5 sm:grid-cols-3">
                            <label className="grid gap-2.5">
                              <FieldLabel>{t("surname")}</FieldLabel>
                              <Input
                                required
                                name="surname"
                                autoComplete="family-name"
                                placeholder={t("surname")}
                                value={formData.surname}
                                onChange={(event) =>
                                  updateField("surname", event.target.value)
                                }
                                className={inputClassName}
                              />
                            </label>
                            <label className="grid gap-2.5">
                              <FieldLabel>{t("firstName")}</FieldLabel>
                              <Input
                                required
                                name="firstName"
                                autoComplete="given-name"
                                placeholder={t("firstName")}
                                value={formData.firstName}
                                onChange={(event) =>
                                  updateField("firstName", event.target.value)
                                }
                                className={inputClassName}
                              />
                            </label>
                            <label className="grid gap-2.5">
                              <span className="text-[14px] font-semibold text-primary-700">
                                {t("patronymic")}
                              </span>
                              <Input
                                name="patronymic"
                                autoComplete="additional-name"
                                placeholder={t("patronymicPlaceholder")}
                                value={formData.patronymic}
                                onChange={(event) =>
                                  updateField("patronymic", event.target.value)
                                }
                                className={inputClassName}
                              />
                            </label>
                          </div>

                          <label className="grid gap-2.5">
                            <FieldLabel>{t("birthDate")}</FieldLabel>
                            <Input
                              required
                              type="date"
                              name="birthDate"
                              autoComplete="bday"
                              value={formData.birthDate}
                              onChange={(event) =>
                                updateField("birthDate", event.target.value)
                              }
                              className={inputClassName}
                            />
                          </label>

                          <div className="grid gap-5 sm:grid-cols-2">
                            <label className="grid gap-2.5">
                              <FieldLabel>{t("citizenship")}</FieldLabel>
                              <SelectField
                                name="citizenship"
                                placeholder={t("citizenshipPlaceholder")}
                                options={countries}
                                value={formData.citizenship}
                                onChange={(value) =>
                                  updateField("citizenship", value)
                                }
                              />
                            </label>
                            <label className="grid gap-2.5">
                              <FieldLabel>{t("country")}</FieldLabel>
                              <SelectField
                                name="country"
                                placeholder={t("countryPlaceholder")}
                                options={countries}
                                value={formData.country}
                                onChange={updateCountry}
                              />
                            </label>
                          </div>

                          <label className="grid gap-2.5">
                            <FieldLabel>{t("region")}</FieldLabel>
                            {useRegionSelect ? (
                              <SelectField
                                name="region"
                                placeholder={t("regionPlaceholder")}
                                options={regionOptions}
                                value={formData.region}
                                onChange={(value) =>
                                  updateField("region", value)
                                }
                              />
                            ) : (
                              <Input
                                required
                                name="region"
                                disabled={!formData.country}
                                placeholder={
                                  formData.country
                                    ? t("regionOtherPlaceholder")
                                    : t("regionCountryFirst")
                                }
                                value={formData.region}
                                onChange={(event) =>
                                  updateField("region", event.target.value)
                                }
                                className={inputClassName}
                              />
                            )}
                          </label>
                        </div>

                      <div className="grid gap-5">
                          <label className="grid gap-2.5">
                            <FieldLabel>{t("category")}</FieldLabel>
                            <SelectField
                              name="category"
                              placeholder={t("categoryPlaceholder")}
                              options={categories}
                              value={formData.category}
                              onChange={(value) =>
                                updateField("category", value)
                              }
                            />
                          </label>

                          <label className="grid gap-2.5">
                            <FieldLabel>{t("badgeName")}</FieldLabel>
                            <Input
                              required
                              name="badgeName"
                              placeholder={t("badgeNamePlaceholder")}
                              value={formData.badgeName}
                              onChange={(event) =>
                                updateField("badgeName", event.target.value)
                              }
                              className={inputClassName}
                            />
                          </label>

                          <div className="grid gap-3">
                            <span className="text-[14px] font-semibold text-primary-700">
                              {t("infoLanguage")}
                            </span>
                            <div
                              role="radiogroup"
                              aria-label={t("infoLanguage")}
                              className="grid gap-2.5 sm:grid-cols-3"
                            >
                              {infoLanguageLabels.map((lang) => (
                                <button
                                  key={lang.value}
                                  type="button"
                                  role="radio"
                                  aria-checked={
                                    formData.infoLanguage === lang.value
                                  }
                                  onClick={() =>
                                    updateField(
                                      "infoLanguage",
                                      lang.value as InfoLanguage,
                                    )
                                  }
                                  className={`rounded-sm border px-4 py-3 text-[14px] font-semibold transition-colors ${
                                    formData.infoLanguage === lang.value
                                      ? "border-accent bg-accent text-primary-900"
                                      : "border-primary-200 bg-primary-50 text-primary-700 hover:border-accent/50 hover:text-primary-900"
                                  }`}
                                >
                                  {lang.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                          <label className="grid gap-2.5">
                            <FieldLabel>
                              <Phone className="size-4 text-accent-700" />
                              {t("phone")}
                            </FieldLabel>
                            <Input
                              required
                              type="tel"
                              name="phone"
                              autoComplete="tel"
                              placeholder="+7 7__ ___ __ __"
                              value={formData.phone}
                              onChange={(event) =>
                                updateField("phone", event.target.value)
                              }
                              className={inputClassName}
                            />
                          </label>
                          <label className="grid gap-2.5">
                            <FieldLabel>
                              <Mail className="size-4 text-accent-700" />
                              {t("email")}
                            </FieldLabel>
                            <Input
                              required
                              type="email"
                              name="email"
                              autoComplete="email"
                              placeholder="name@example.com"
                              value={formData.email}
                              onChange={(event) =>
                                updateField("email", event.target.value)
                              }
                              className={inputClassName}
                            />
                          </label>
                        </div>

                      {status === "error" ? (
                        <p className="text-[14px] font-semibold text-destructive">
                          {t("errorMessage")}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-end border-t border-accent/20 bg-primary-50 px-6 py-6 sm:px-8">
                      <Button
                        type="submit"
                        disabled={status === "sending"}
                        className="h-11 rounded-sm border border-accent-300 bg-accent px-7 text-[15px] font-bold text-primary-900 hover:bg-accent-400 active:scale-[0.98]"
                      >
                        {status === "sending" ? t("sending") : t("submit")}
                        {status === "idle" && <Send className="size-4" />}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
