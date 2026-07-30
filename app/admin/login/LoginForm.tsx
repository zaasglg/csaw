"use client"

import { useRouter } from "next/navigation"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const inputClassName =
  "h-11 border-accent/25 bg-primary-900/45 px-4 text-primary-50 placeholder:text-primary-400 focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20"

export function LoginForm() {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("sending")

    const formData = new FormData(event.currentTarget)

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      setErrorMessage(data?.error ?? "Не удалось выполнить вход")
      setStatus("error")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-sm rounded-sm border border-accent/40 bg-primary-800 p-8 shadow-[0_30px_100px_rgba(11,29,51,0.72)]"
    >
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-300">
        CSAW 2026 · Админ-панель
      </p>
      <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-primary-50">Вход</h1>

      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-[14px] font-semibold text-primary-100">
          Логин
          <Input
            required
            autoFocus
            name="username"
            autoComplete="username"
            className={inputClassName}
          />
        </label>
        <label className="grid gap-2 text-[14px] font-semibold text-primary-100">
          Пароль
          <Input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            className={inputClassName}
          />
        </label>
      </div>

      {status === "error" ? (
        <p className="mt-4 text-[14px] font-semibold text-destructive">{errorMessage}</p>
      ) : null}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 h-11 w-full border-accent-300 bg-accent px-7 text-[15px] font-bold text-primary-900 hover:bg-accent-400 active:scale-[0.98]"
      >
        {status === "sending" ? "Проверка..." : "Войти"}
      </Button>
    </form>
  )
}
