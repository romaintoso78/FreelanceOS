import type { Metadata } from "next"
import Link from "next/link"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount, formatDateShort } from "@/lib/utils"
import { Plus, FileText } from "lucide-react"

export const metadata: Metadata = { title: "Factures" }

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

export default async function InvoicesPage() {
  const workspace = await requireWorkspace()

  const invoices = (await prisma.invoice.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
  })).map(inv => ({
    ...inv,
    subtotalHT: Number(inv.subtotalHT),
    vatAmount: Number(inv.vatAmount),
    totalTTC: Number(inv.totalTTC),
  }))

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light" style={{ color: "var(--ink)" }}>
            Factures
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            {invoices.length} facture{invoices.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
        >
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-20"
          style={{
            backgroundColor: "var(--white)",
            border: "1px dashed var(--border-strong)",
          }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--gold-pale)" }}
          >
            <FileText className="h-6 w-6" style={{ color: "var(--gold)" }} />
          </div>
          <p className="mb-1 font-medium" style={{ color: "var(--ink)" }}>
            Aucune facture pour le moment
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--ink-muted)" }}>
            Créez votre première facture en quelques secondes
          </p>
          <Link
            href="/invoices/new"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
          >
            <Plus className="h-4 w-4" />
            Créer une facture
          </Link>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            backgroundColor: "var(--white)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {[
                  { label: "Numéro", align: "left" },
                  { label: "Client", align: "left" },
                  { label: "Émise le", align: "left" },
                  { label: "Échéance", align: "left" },
                  { label: "Montant TTC", align: "right" },
                  { label: "Statut", align: "left" },
                ].map(col => (
                  <th
                    key={col.label}
                    className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-${col.align}`}
                    style={{ color: "var(--ink-faint)", backgroundColor: "var(--gold-pale)" }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, i) => (
                <tr
                  key={invoice.id}
                  className="transition-colors hover:bg-[#FDF6E3]"
                  style={{
                    borderBottom:
                      i < invoices.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="font-semibold transition-colors"
                      style={{ color: "var(--navy-mid)", fontFamily: "var(--font-mono)" }}
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--ink)" }}>
                    {invoice.client.name}
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--ink-muted)" }}>
                    {formatDateShort(invoice.issueDate)}
                  </td>
                  <td
                    className="px-6 py-4"
                    style={{
                      color:
                        invoice.status === "OVERDUE"
                          ? "var(--error)"
                          : "var(--ink-muted)",
                      fontWeight: invoice.status === "OVERDUE" ? 600 : 400,
                    }}
                  >
                    {formatDateShort(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold" style={{ color: "var(--ink)" }}>
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
        </div>
      )}
    </div>
  )
}
