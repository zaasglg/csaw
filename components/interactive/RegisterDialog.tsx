"use client"

import { Check, Send } from "lucide-react"
import { useTranslations } from "next-intl"
import { type FormEvent, type ReactElement, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export type RegistrationKind = "participant"

export function RegisterDialog({
  kind,
  children,
}: {
  kind: RegistrationKind
  children: ReactElement
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle")
  const t = useTranslations("registerDialog")
  const content = {
    title: t(`${kind}.title`),
    description: t(`${kind}.description`),
  }
  const badge = t(`${kind}.badge`)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("sending")
    window.setTimeout(() => setStatus("success"), 850)
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) window.setTimeout(() => setStatus("idle"), 150)
      }}
    >
      <DialogTrigger render={children} />
      <DialogContent
        data-lenis-prevent
        className="max-h-[calc(100dvh-2rem)] max-w-xl overflow-y-auto rounded-sm border border-accent/40 bg-primary-800 p-0 text-primary-50 shadow-[0_30px_100px_rgba(11,29,51,0.72)] sm:max-w-xl"
      >
        {status === "success" ? (
          <div className="grid min-h-80 place-items-center px-8 py-10 text-center">
            <div>
              <div className="mx-auto mb-5 grid size-14 place-items-center border border-accent-200 bg-accent text-primary-900">
                <Check className="size-6" />
              </div>
              <DialogTitle className="text-3xl font-black tracking-[-0.04em] text-primary-50">
                {t("successTitle")}
              </DialogTitle>
              <DialogDescription className="mx-auto mt-3 max-w-sm text-[16px] leading-[1.45] text-primary-200">
                {t("successDescription")}
              </DialogDescription>
              <DialogClose
                render={
                  <Button className="mt-8 h-11 rounded-sm border border-accent-300 bg-accent px-6 text-[15px] font-bold text-primary-900 hover:bg-accent-400" />
                }
              >
                {t("done")}
              </DialogClose>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="border-b border-accent/35 bg-primary-900 px-8 py-4">
              <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-accent-300">
                CSAW 2026 · {badge}
              </p>
            </div>

            <DialogHeader className="px-8 pt-7">
              <DialogTitle className="max-w-[16ch] text-[clamp(2rem,3.4vw,2.8rem)] leading-[0.93] font-black tracking-[-0.045em] text-primary-50">
                {content.title}
              </DialogTitle>
              <DialogDescription className="max-w-[35ch] text-[16px] leading-[1.5] text-primary-200">
                {content.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-7 grid gap-5 px-8 pb-1">
              <label className="grid gap-2.5 text-[15px] font-semibold text-primary-100">
                {t("nameLabel")}
                <Input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder={t("namePlaceholder")}
                  className="h-13 rounded-sm border border-accent/25 bg-primary-900/45 px-4 text-primary-50 placeholder:text-primary-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
                />
              </label>
              <label className="grid gap-2.5 text-[15px] font-semibold text-primary-100">
                {t("emailLabel")}
                <Input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="h-13 rounded-sm border border-accent/25 bg-primary-900/45 px-4 text-primary-50 placeholder:text-primary-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"
                />
              </label>
            </div>

            <DialogFooter className="mt-8 border-t border-accent/20 bg-primary-900 px-8 py-6">
              <Button
                type="submit"
                disabled={status === "sending"}
                className="h-11 w-full rounded-sm border border-accent-300 bg-accent px-7 text-[15px] font-bold text-primary-900 hover:bg-accent-400 active:scale-[0.98] sm:w-auto"
              >
                {status === "sending" ? t("sending") : t("submit")}
                {status === "idle" && <Send className="size-4" />}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
