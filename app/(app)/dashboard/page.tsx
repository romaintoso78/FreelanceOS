import type { Metadata } from "next"
import Link from "next/link"
import { getWorkspaceFromAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount, formatDateShort } from "@/lib/utils"
import { calculateUrssaf } from "@/lib/fiscal/urssaf"
import { TrendingUp, AlertCircle, Receipt } from "lucide-react"

export const metadata: Metadata = { title: "Tableau de bord" }

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon", SENT: "Envoyée", VIEWED: "Vue",
  PAID: "Payée", OVERDUE: "En retard", CANCELLED: "Annulée",
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: "rgba(168,163,158,0.15)", color: "var(--ink-muted)" },
  SENT: { bg: "rgba(30,58,95,0.12)", color: "var(--navy-mid)" },
  VIEWED: { bg: "rgba(109,40,217,0.10)", color: "#6D28D9" },
  PAID: { bg: "rgba(22,101,52,0.12)", color: "var(--success)" },
  OVERDUE: { bg: "rgba(153,27,27,0.12)", color: "var(--error)" },
  CANCELLED: { bg: "rgba(168,163,158,0.10)", color: "var(--ink-faint)" },
}

export default async function DashboardPage() {
  const workspace = await getWorkspaceFromAuth()
  if (!workspace) return null

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const [invoicesThisMonth, invoicesYTD, overdueInvoices, recentInvoices, clientCount] =
    await Promise.all([
      prisma.invoice.aggregate({
        where: { workspaceId: workspace.id, status: "PAID", paidAt: { gte: startOfMonth } },
        _sum: { totalTTC: true },
      }),
      prisma.invoice.aggregate({
        where: { workspaceId: workspace.id, status: "PAID", paidAt: { gte: startOfYear } },
        _sum: { totalTTC: true },
      }),
      prisma.invoice.count({
        where: { workspaceId: workspace.id, status: "OVERDUE" },
      }),
      prisma.invoice.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { client: { select: { name: true } } },
      }),
      prisma.client.count({
        where: { workspaceId: workspace.id, deletedAt: null },
      }),
    ])

  const caMonth = Number(invoicesThisMonth._sum.totalTTC ?? 0)
  const caYTD = Number(invoicesYTD._sum.totalTTC ?? 0)
  const urssaf = calculateUrssaf(workspace.legalStatus, caYTD)

  const recentInvoicesPlain = recentInvoices.map(inv => ({
    ...inv,
    subtotalHT: Number(inv.subtotalHT),
    vatAmount: Number(inv.vatAmount),
    totalTTC: Number(inv.totalTTC),
  }))

  const kpis = [
    {
      label: "CA ce mois",
      value: formatAmount(caMonth),
      sub: "Encaissé en " + now.toLocaleDateString("fr-FR", { month: "long" }),
      icon: TrendingUp,
      accent: "var(--gold)",
    },
    {
      label: "CA annuel (YTD)",
      value: formatAmount(caYTD),
      sub: `Depuis le 1er janvier ${now.getFullYear()}`,
      icon: Receipt,
      accent: "var(--navy-mid)",
    },
    {
      label: "Cotisations estimées",
      value: formatAmount(urssaf.cotisations),
      sub: urssaf.detail,
      icon: Calculator,
      accent: "#6D28D9",
    },
    {
      label: "Factures en retard",
      value: String(overdueInvoices),
      sub: `${clientCount} client${clientCount > 1 ? "s" : ""} actif${clientCount > 1 ? "s" : ""}`,
      icon: AlertCircle,
      accent: overdueInvoices > 0 ? "var(--error)" : "var(--success)",
    },
  ]

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1
          className="font-display text-3xl font-light"
          style={{ color: "var(--ink)" }}
        >
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
          Bienvenue, {workspace.name}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className="animate-fade-in rounded-2xl p-6"
            style={{
              backgroundColor: "var(--white)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-sm)",
              animationDelay: `${i * 0.07}s`,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--ink-faint)" }}>
                {kpi.label}
              </p>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: kpi.accent + "18" }}
              >
                <kpi.icon className="h-4 w-4" style={{ color: kpi.accent }} />
              </div>
            </div>
            <p
              className="font-display text-3xl font-light"
              style={{ color: "var(--ink)" }}
            >
              {kpi.value}
            </p>
            <p className="mt-2 text-xs" style={{ color: "var(--ink-muted)" }}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Invoices */}
      <div
        className="animate-fade-in overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "var(--white)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-sm)",
          animationDelay: "0.28s",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="font-display text-lg font-medium" style={{ color: "var(--ink)" }}>
            Dernières factures
          </h2>
          <Link
            href="/invoices"
            className="text-xs font-medium opacity-100 transition-opacity hover:opacity-70"
            style={{ color: "var(--gold)" }}
          >
            Voir tout →
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "var(--gold-pale)" }}
            >
              <Receipt className="h-6 w-6" style={{ color: "var(--gold)" }} />
            </div>
            <p className="mb-1 font-medium" style={{ color: "var(--ink)" }}>
              Aucune facture pour le moment
            </p>
            <p className="mb-6 text-sm" style={{ color: "var(--ink-muted)" }}>
              Créez votre première facture en quelques secondes
            </p>
            <Link
              href="/invoices/new"
              className="rounded-xl px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
            >
              Créer une facture
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Numéro", "Client", "Date", "Montant TTC", "Statut"].map(h => (
                  <th
                    key={h}
                    className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider ${h === "Montant TTC" ? "text-right" : "text-left"}`}
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentInvoicesPlain.map((invoice, i) => (
                <tr
                  key={invoice.id}
                  className="transition-colors hover:bg-[#FDF6E3]"
                  style={{ borderBottom: i < recentInvoices.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-sm font-medium transition-colors"
                      style={{ color: "var(--navy-mid)" }}
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--ink)" }}>
                    {invoice.client.name}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "var(--ink-muted)" }}>
                    {formatDateShort(invoice.issueDate)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold" style={{ color: "var(--ink)" }}>
                    {formatAmount(Number(invoice.totalTTC))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                      style={STATUS_STYLES[invoice.status] ?? STATUS_STYLES.DRAFT}
                    >
                      {STATUS_LABELS[invoice.status] ?? invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Calculator({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="12" x2="10" y2="12" />
      <line x1="14" y1="12" x2="16" y2="12" />
      <line x1="8" y1="17" x2="10" y2="17" />
      <line x1="14" y1="17" x2="16" y2="17" />
    </svg>
  )
}
