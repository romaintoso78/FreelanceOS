import type { Metadata } from "next"
import Link from "next/link"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount, formatDateShort } from "@/lib/utils"
import { Plus, ClipboardList } from "lucide-react"

export const metadata: Metadata = { title: "Devis" }

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon", SENT: "Envoyé", ACCEPTED: "Accepté",
  REJECTED: "Refusé", EXPIRED: "Expiré",
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: "rgba(168,163,158,0.15)", color: "var(--ink-muted)" },
  SENT: { bg: "rgba(30,58,95,0.12)", color: "var(--navy-mid)" },
  ACCEPTED: { bg: "rgba(22,101,52,0.12)", color: "var(--success)" },
  REJECTED: { bg: "rgba(153,27,27,0.12)", color: "var(--error)" },
  EXPIRED: { bg: "rgba(146,64,14,0.12)", color: "var(--warning)" },
}

export default async function QuotesPage() {
  const workspace = await requireWorkspace()

  const quotes = (await prisma.quote.findMany({
    where: { workspaceId: workspace.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
  })).map(q => ({
    ...q,
    subtotalHT: Number(q.subtotalHT),
    vatAmount: Number(q.vatAmount),
    totalTTC: Number(q.totalTTC),
  }))

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light" style={{ color: "var(--ink)" }}>
            Devis
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            {quotes.length} devis
          </p>
        </div>
        <Link
          href="/quotes/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
        >
          <Plus className="h-4 w-4" />
          Nouveau devis
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-20"
          style={{ backgroundColor: "var(--white)", border: "1px dashed var(--border-strong)" }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--gold-pale)" }}
          >
            <ClipboardList className="h-6 w-6" style={{ color: "var(--gold)" }} />
          </div>
          <p className="mb-1 font-medium" style={{ color: "var(--ink)" }}>
            Aucun devis pour le moment
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--ink-muted)" }}>
            Créez un devis professionnel convertible en facture
          </p>
          <Link
            href="/quotes/new"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
          >
            <Plus className="h-4 w-4" />
            Créer un devis
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
                  { label: "Émis le", align: "left" },
                  { label: "Validité", align: "left" },
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
              {quotes.map((quote, i) => (
                <tr
                  key={quote.id}
                  className="transition-colors hover:bg-[#FDF6E3]"
                  style={{ borderBottom: i < quotes.length - 1 ? "1px solid var(--border)" : "none" }}
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/quotes/${quote.id}`}
                      className="font-semibold"
                      style={{ color: "var(--navy-mid)", fontFamily: "var(--font-mono)" }}
                    >
                      {quote.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--ink)" }}>
                    {quote.client.name}
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--ink-muted)" }}>
                    {formatDateShort(quote.issueDate)}
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--ink-muted)" }}>
                    {formatDateShort(quote.validUntil)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold" style={{ color: "var(--ink)" }}>
                    {formatAmount(Number(quote.totalTTC))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                      style={STATUS_STYLES[quote.status] ?? STATUS_STYLES.DRAFT}
                    >
                      {STATUS_LABELS[quote.status] ?? quote.status}
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
