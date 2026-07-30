"use client"

import { ChevronDown, Loader2, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const COUNTRY_OPTIONS = ["Казахстан", "Азербайджан", "Россия", "Туркменистан", "Иран", "Другое"]

const CATEGORY_OPTIONS = [
  "Государственный орган",
  "Международная организация",
  "Научная организация",
  "ВУЗ",
  "Колледж",
  "НПО",
  "Волонтерская организация",
  "Бизнес-сообщество",
  "Стартап",
  "СМИ",
  "Студент",
  "Индивидуальный участник",
  "Другое",
]

export interface VolunteerDto {
  id: string
  surname: string
  firstName: string
  patronymic: string | null
  birthDate: string
  citizenship: string
  country: string
  region: string
  category: string
  badgeName: string
  infoLanguage: string | null
  phone: string
  email: string
}

const inputClassName =
  "h-10 border-accent/25 bg-primary-900/45 px-3 text-[14px] text-primary-50 placeholder:text-primary-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-[13px] font-semibold text-primary-100">
      {label}
      {children}
    </label>
  )
}

function SelectField({
  name,
  defaultValue,
  options,
}: {
  name: string
  defaultValue: string
  options: string[]
}) {
  const allOptions = !defaultValue || options.includes(defaultValue)
    ? options
    : [defaultValue, ...options]

  return (
    <div className="relative">
      <select
        required
        name={name}
        defaultValue={defaultValue}
        className={`${inputClassName} w-full appearance-none pr-9`}
      >
        {allOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-primary-400"
      />
    </div>
  )
}

export function VolunteerActions({ volunteer }: { volunteer: VolunteerDto }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")

  async function handleDelete() {
    if (!window.confirm(`Удалить заявку «${volunteer.surname} ${volunteer.firstName}»?`)) return

    setDeleting(true)
    const response = await fetch(`/api/admin/volunteers/${volunteer.id}`, { method: "DELETE" })
    setDeleting(false)

    if (!response.ok) {
      window.alert("Не удалось удалить заявку")
      return
    }
    router.refresh()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const formData = new FormData(event.currentTarget)

    const response = await fetch(`/api/admin/volunteers/${volunteer.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        surname: formData.get("surname"),
        firstName: formData.get("firstName"),
        patronymic: formData.get("patronymic") || undefined,
        birthDate: formData.get("birthDate"),
        citizenship: formData.get("citizenship"),
        country: formData.get("country"),
        region: formData.get("region"),
        category: formData.get("category"),
        badgeName: formData.get("badgeName"),
        infoLanguage: formData.get("infoLanguage") || undefined,
        phone: formData.get("phone"),
        email: formData.get("email"),
      }),
    })

    setSaving(false)

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      setError(
        data?.error === "email_taken"
          ? "Такой email уже используется"
          : "Не удалось сохранить изменения",
      )
      return
    }

    setEditOpen(false)
    router.refresh()
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        aria-label="Редактировать заявку"
        className="grid size-8 place-items-center rounded-sm border border-accent/25 text-primary-200 transition-colors hover:border-accent/50 hover:text-accent-300"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Удалить заявку"
        className="grid size-8 place-items-center rounded-sm border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
      >
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          data-lenis-prevent
          showCloseButton
          className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-sm border border-accent/40 bg-primary-800 p-0 text-primary-50 shadow-[0_30px_100px_rgba(11,29,51,0.72)] sm:max-w-2xl"
        >
          <form onSubmit={handleSubmit}>
            <div className="border-b border-accent/35 bg-primary-900 px-8 py-4">
              <DialogTitle className="text-[18px] font-bold text-primary-50">
                Редактировать заявку волонтёра
              </DialogTitle>
            </div>

            <div className="grid gap-4 px-8 py-6 sm:grid-cols-2">
              <Field label="Фамилия">
                <Input
                  required
                  name="surname"
                  defaultValue={volunteer.surname}
                  className={inputClassName}
                />
              </Field>
              <Field label="Имя">
                <Input
                  required
                  name="firstName"
                  defaultValue={volunteer.firstName}
                  className={inputClassName}
                />
              </Field>
              <Field label="Отчество">
                <Input
                  name="patronymic"
                  defaultValue={volunteer.patronymic ?? ""}
                  className={inputClassName}
                />
              </Field>
              <Field label="Дата рождения">
                <Input
                  required
                  type="date"
                  name="birthDate"
                  defaultValue={volunteer.birthDate}
                  className={inputClassName}
                />
              </Field>
              <Field label="Гражданство">
                <SelectField
                  name="citizenship"
                  defaultValue={volunteer.citizenship}
                  options={COUNTRY_OPTIONS}
                />
              </Field>
              <Field label="Государство">
                <SelectField
                  name="country"
                  defaultValue={volunteer.country}
                  options={COUNTRY_OPTIONS}
                />
              </Field>
              <Field label="Регион">
                <Input
                  required
                  name="region"
                  defaultValue={volunteer.region}
                  className={inputClassName}
                />
              </Field>
              <Field label="Категория">
                <SelectField
                  name="category"
                  defaultValue={volunteer.category}
                  options={CATEGORY_OPTIONS}
                />
              </Field>
              <Field label="Имя для бейджа">
                <Input
                  required
                  name="badgeName"
                  defaultValue={volunteer.badgeName}
                  className={inputClassName}
                />
              </Field>
              <Field label="Язык информирования">
                <div className="relative">
                  <select
                    name="infoLanguage"
                    defaultValue={volunteer.infoLanguage ?? ""}
                    className={`${inputClassName} w-full appearance-none pr-9`}
                  >
                    <option value="">Не указан</option>
                    <option value="kk">Қазақша</option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-primary-400"
                  />
                </div>
              </Field>
              <Field label="Телефон">
                <Input
                  required
                  type="tel"
                  name="phone"
                  defaultValue={volunteer.phone}
                  className={inputClassName}
                />
              </Field>
              <Field label="Email">
                <Input
                  required
                  type="email"
                  name="email"
                  defaultValue={volunteer.email}
                  className={inputClassName}
                />
              </Field>
            </div>

            {error ? (
              <p className="px-8 pb-2 text-[13px] font-semibold text-destructive">{error}</p>
            ) : null}

            <div className="flex items-center justify-end gap-3 border-t border-accent/20 bg-primary-900 px-8 py-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="h-10 px-5 text-[14px]"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="h-10 rounded-sm border border-accent-300 bg-accent px-6 text-[14px] font-bold text-primary-900 hover:bg-accent-400"
              >
                {saving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
