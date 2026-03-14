"use client"

import { UserButton } from "@clerk/nextjs"
import { Bell } from "lucide-react"

export function Header() {
  return (
    <header
      className="flex h-16 items-center justify-between px-8"
      style={{
        backgroundColor: "var(--parchment)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[#E2DDD5]"
          style={{ color: "var(--ink-muted)" }}
        >
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-6 w-px" style={{ backgroundColor: "var(--border)" }} />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}
