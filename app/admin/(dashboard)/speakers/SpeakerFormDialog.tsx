"use client"

import { ImagePlus } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type ChangeEvent, type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export interface SpeakerDto {
  id: string
  name: string
  role: string
  organization: string
  bio: string | null
  avatarUrl: string | null
  order: number
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

export function SpeakerFormDialog({
  speaker,
  open,
  onOpenChange,
}: {
  speaker?: SpeakerDto
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const isEdit = Boolean(speaker)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(speaker?.avatarUrl ?? null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const url = isEdit ? `/api/admin/speakers/${speaker!.id}` : "/api/admin/speakers"

    const response = await fetch(url, {
      method: isEdit ? "PATCH" : "POST",
      body: formData,
    })

    setSaving(false)

    if (!response.ok) {
      setError("Не удалось сохранить спикера")
      return
    }

    onOpenChange(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-lenis-prevent
        showCloseButton
        className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-sm border border-accent/40 bg-primary-800 p-0 text-primary-50 shadow-[0_30px_100px_rgba(11,29,51,0.72)] sm:max-w-xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="border-b border-accent/35 bg-primary-900 px-8 py-4">
            <DialogTitle className="text-[18px] font-bold text-primary-50">
              {isEdit ? "Редактировать спикера" : "Добавить спикера"}
            </DialogTitle>
          </div>

          <div className="grid gap-4 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-sm border border-accent/25 bg-primary-900/50">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-primary-500">
                    <ImagePlus className="size-6" />
                  </div>
                )}
              </div>
              <label className="grid gap-1.5 text-[13px] font-semibold text-primary-100">
                Фотография
                <input
                  type="file"
                  name="avatar"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="text-[13px] text-primary-300 file:mr-3 file:rounded-sm file:border file:border-accent/40 file:bg-primary-900/60 file:px-3 file:py-1.5 file:text-[12px] file:font-bold file:text-accent-300"
                />
              </label>
            </div>

            <Field label="Имя">
              <Input required name="name" defaultValue={speaker?.name} className={inputClassName} />
            </Field>
            <Field label="Должность">
              <Input required name="role" defaultValue={speaker?.role} className={inputClassName} />
            </Field>
            <Field label="Организация">
              <Input
                required
                name="organization"
                defaultValue={speaker?.organization}
                className={inputClassName}
              />
            </Field>
            <Field label="Биография (для модального окна)">
              <textarea
                name="bio"
                rows={4}
                defaultValue={speaker?.bio ?? ""}
                className={`${inputClassName} h-auto resize-none py-2`}
              />
            </Field>
            <Field label="Порядок отображения">
              <Input
                type="number"
                name="order"
                defaultValue={speaker?.order ?? 0}
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
              onClick={() => onOpenChange(false)}
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
  )
}
