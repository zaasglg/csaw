"use client"

import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { type SpeakerDto, SpeakerFormDialog } from "./SpeakerFormDialog"

export function SpeakerRowActions({ speaker }: { speaker: SpeakerDto }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm(`Удалить спикера «${speaker.name}»?`)) return

    setDeleting(true)
    const response = await fetch(`/api/admin/speakers/${speaker.id}`, { method: "DELETE" })
    setDeleting(false)

    if (!response.ok) {
      window.alert("Не удалось удалить спикера")
      return
    }
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        aria-label="Редактировать спикера"
        className="grid size-8 shrink-0 place-items-center rounded-sm border border-accent/25 text-primary-200 transition-colors hover:border-accent/50 hover:text-accent-300"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Удалить спикера"
        className="grid size-8 shrink-0 place-items-center rounded-sm border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
      >
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      </button>

      <SpeakerFormDialog speaker={speaker} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}
