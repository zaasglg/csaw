"use client"

import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export interface HackathonTeamDto {
  id: string
  teamName: string
  country: string
  region: string
  captainName: string
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

export function TeamActions({ team }: { team: HackathonTeamDto }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [teamName, setTeamName] = useState(team.teamName)
  const [country, setCountry] = useState(team.country)
  const [region, setRegion] = useState(team.region)
  const [captainName, setCaptainName] = useState(team.captainName)

  function resetForm() {
    setTeamName(team.teamName)
    setCountry(team.country)
    setRegion(team.region)
    setCaptainName(team.captainName)
    setError("")
  }

  async function handleDelete() {
    if (!window.confirm(`Удалить команду «${team.teamName}»?`)) return

    setDeleting(true)
    const response = await fetch(`/api/admin/hackathon-teams/${team.id}`, { method: "DELETE" })
    setDeleting(false)

    if (!response.ok) {
      window.alert("Не удалось удалить команду")
      return
    }
    router.refresh()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const response = await fetch(`/api/admin/hackathon-teams/${team.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamName, country, region, captainName }),
    })

    setSaving(false)

    if (!response.ok) {
      setError("Не удалось сохранить изменения")
      return
    }

    setEditOpen(false)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          resetForm()
          setEditOpen(true)
        }}
        aria-label="Редактировать команду"
        className="grid size-8 place-items-center rounded-sm border border-accent/25 text-primary-200 transition-colors hover:border-accent/50 hover:text-accent-300"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Удалить команду"
        className="grid size-8 place-items-center rounded-sm border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
      >
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          data-lenis-prevent
          showCloseButton
          className="max-h-[calc(100dvh-2rem)] max-w-[calc(100%-2rem)] overflow-y-auto rounded-sm border border-accent/40 bg-primary-800 p-0 text-primary-50 shadow-[0_30px_100px_rgba(11,29,51,0.72)] sm:max-w-3xl"
        >
          <form onSubmit={handleSubmit}>
            <div className="border-b border-accent/35 bg-primary-900 px-8 py-4">
              <DialogTitle className="text-[18px] font-bold text-primary-50">
                Редактировать команду
              </DialogTitle>
            </div>

            <div className="grid gap-4 px-8 py-6 sm:grid-cols-2">
              <Field label="Название команды">
                <Input
                  required
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  className={inputClassName}
                />
              </Field>
              <Field label="Страна">
                <Input
                  required
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  className={inputClassName}
                />
              </Field>
              <Field label="Регион / город">
                <Input
                  required
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className={inputClassName}
                />
              </Field>
              <Field label="Капитан">
                <Input
                  required
                  value={captainName}
                  onChange={(event) => setCaptainName(event.target.value)}
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
