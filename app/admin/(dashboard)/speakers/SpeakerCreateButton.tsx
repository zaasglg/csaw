"use client"

import { Plus } from "lucide-react"
import { useState } from "react"

import { SpeakerFormDialog } from "./SpeakerFormDialog"

export function SpeakerCreateButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-sm border border-accent/40 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-accent-300 transition-colors hover:border-accent hover:text-accent"
      >
        <Plus className="size-3.5" />
        Добавить спикера
      </button>

      <SpeakerFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
