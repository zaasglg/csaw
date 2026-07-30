"use client"

import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  Phone,
  Send,
} from "lucide-react"
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
  const infoLanguageLabels = t.raw("infoLanguageOptions") as Array<{
    value: string
    label: string
  }>
  const stepTitles = t.raw("steps") as string[]
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData)

  function updateField<K extends keyof RegistrationFormData>(
    key: K,
    value: RegistrationFormData[K],
  ) {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  function goNext() {
    setDirection(1)
    setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev))
  }

  function goBack() {
    setDirection(-1)
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (step < 3) {
      goNext()
      return
    }
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
      className="relative overflow-hidden border-y border-accent/25 bg-white px-5 py-24 lg:px-10 lg:py-36"
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
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent" aria-hidden />
              <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-accent sm:text-xs">
                {t("overline")}
              </p>
            </div>

            <h2
              id="register-title"
              className="max-w-[18ch] text-[clamp(2.5rem,4.4vw,4.6rem)] leading-[0.98] font-black tracking-[-0.045em] text-primary-900"
            >
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
                    setStep(1)
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
                  onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between gap-4 border-b border-accent/35 bg-primary-50 px-6 py-4 sm:px-8">
                    <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-accent-700">
                      {t("cardKicker")}
                    </p>
                    <div className="flex items-center gap-3">
                      {stepTitles.map((_, index) => {
                        const stepId = (index + 1) as 1 | 2 | 3
                        return (
                          <div key={stepId} className="flex items-center gap-3">
                            <div
                              className={`flex size-7 items-center justify-center rounded-full border font-mono text-[11px] font-bold transition-colors ${
                                step === stepId
                                  ? "border-accent bg-accent text-primary-900"
                                  : step > stepId
                                    ? "border-accent/60 bg-transparent text-accent"
                                    : "border-primary-400/30 text-primary-400"
                              }`}
                            >
                              {step > stepId ? (
                                <Check className="size-3.5" />
                              ) : (
                                stepId
                              )}
                            </div>
                            {index < stepTitles.length - 1 && (
                              <span
                                aria-hidden
                                className={`h-px w-6 sm:w-10 ${
                                  step > stepId ? "bg-accent" : "bg-primary-400/20"
                                }`}
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="overflow-hidden px-6 pt-7 sm:px-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-500">
                      {t("stepLabel")} {step}/{stepTitles.length}
                    </p>
                    <h3 className="mt-2 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-[1.1] font-bold tracking-[-0.03em] text-primary-900">
                      {stepTitles[step - 1]}
                    </h3>

                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                      {step === 1 ? (
                        <motion.div
                          key="step-1"
                          custom={direction}
                          initial={
                            reduceMotion
                              ? false
                              : { opacity: 0, x: direction * 24 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={
                            reduceMotion
                              ? undefined
                              : { opacity: 0, x: direction * -24 }
                          }
                          transition={{ duration: 0.4, ease }}
                          className="mt-6 grid gap-5 pb-1"
                        >
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
                                onChange={(value) => updateField("country", value)}
                              />
                            </label>
                          </div>

                          <label className="grid gap-2.5">
                            <FieldLabel>{t("region")}</FieldLabel>
                            <Input
                              required
                              name="region"
                              placeholder={t("regionPlaceholder")}
                              value={formData.region}
                              onChange={(event) =>
                                updateField("region", event.target.value)
                              }
                              className={inputClassName}
                            />
                          </label>
                        </motion.div>
                      ) : step === 2 ? (
                        <motion.div
                          key="step-2"
                          custom={direction}
                          initial={
                            reduceMotion
                              ? false
                              : { opacity: 0, x: direction * 24 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={
                            reduceMotion
                              ? undefined
                              : { opacity: 0, x: direction * -24 }
                          }
                          transition={{ duration: 0.4, ease }}
                          className="mt-6 grid gap-5 pb-1"
                        >
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
                                  aria-checked={formData.infoLanguage === lang.value}
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
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step-3"
                          custom={direction}
                          initial={
                            reduceMotion
                              ? false
                              : { opacity: 0, x: direction * 24 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          exit={
                            reduceMotion
                              ? undefined
                              : { opacity: 0, x: direction * -24 }
                          }
                          transition={{ duration: 0.4, ease }}
                          className="mt-6 grid gap-5 pb-1"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {status === "error" ? (
                      <p className="mt-5 text-[14px] font-semibold text-destructive">
                        {t("errorMessage")}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-accent/20 bg-primary-50 px-6 py-6 sm:px-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={goBack}
                        className="inline-flex h-11 items-center gap-2 rounded-sm border border-accent/30 px-5 text-[15px] font-bold text-primary-600 transition-colors hover:border-accent/60 hover:text-primary-900"
                      >
                        <ArrowLeft className="size-4" />
                        {t("back")}
                      </button>
                    ) : (
                      <span />
                    )}

                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="h-11 rounded-sm border border-accent-300 bg-accent px-7 text-[15px] font-bold text-primary-900 hover:bg-accent-400 active:scale-[0.98]"
                    >
                      {step < 3
                        ? t("next")
                        : status === "sending"
                          ? t("sending")
                          : t("submit")}
                      {step < 3 && <ArrowRight className="size-4" />}
                      {step === 3 && status === "idle" && (
                        <Send className="size-4" />
                      )}
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
