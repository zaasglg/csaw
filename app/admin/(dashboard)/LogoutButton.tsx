"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      onClick={handleLogout}
      className="h-9 px-4 text-[13px]"
    >
      {loading ? "Выход..." : "Выйти"}
    </Button>
  )
}
