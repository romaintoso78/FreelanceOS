"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Briefcase,
  FileSignature,
  Calculator,
  Settings,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/invoices", label: "Factures", icon: FileText },
  { href: "/quotes", label: "Devis", icon: ClipboardList },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/missions", label: "Missions", icon: Briefcase },
  { href: "/contracts", label: "Contrats", icon: FileSignature },
  { href: "/fiscal", label: "Fiscal", icon: Calculator },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex h-full w-64 flex-col"
      style={{ backgroundColor: "var(--navy)", borderRight: "1px solid rgba(248,247,244,0.07)" }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center gap-3 px-6"
        style={{ borderBottom: "1px solid rgba(248,247,244,0.07)" }}
      >
        <div className="h-7 w-7 rounded-md" style={{ backgroundColor: "var(--gold)" }} />
        <span
          className="font-display text-lg font-medium tracking-wide"
          style={{ color: "#F8F7F4" }}
        >
          FreelanceOS
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150"
              style={{
                backgroundColor: isActive ? "rgba(201,168,76,0.12)" : undefined,
                color: isActive ? "var(--gold)" : "rgba(248,247,244,0.55)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={{ color: isActive ? "var(--gold)" : "inherit" }}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Settings */}
      <div
        className="px-3 pb-4 pt-3"
        style={{ borderTop: "1px solid rgba(248,247,244,0.07)" }}
      >
        {(() => {
          const isActive = pathname.startsWith("/settings")
          return (
            <Link
              href="/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150"
              style={{
                backgroundColor: isActive ? "rgba(201,168,76,0.12)" : undefined,
                color: isActive ? "var(--gold)" : "rgba(248,247,244,0.55)",
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <Settings className="h-4 w-4 shrink-0" />
              Paramètres
            </Link>
          )
        })()}
      </div>
    </aside>
  )
}
