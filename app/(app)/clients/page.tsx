import type { Metadata } from "next"
import Link from "next/link"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Plus, Users } from "lucide-react"

export const metadata: Metadata = { title: "Clients" }

export default async function ClientsPage() {
  const workspace = await requireWorkspace()

  const clients = await prisma.client.findMany({
    where: { workspaceId: workspace.id, deletedAt: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { invoices: true } } },
  })

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light" style={{ color: "var(--ink)" }}>
            Clients
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
        >
          <Plus className="h-4 w-4" />
          Nouveau client
        </Link>
      </div>

      {clients.length === 0 ? (
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
            <Users className="h-6 w-6" style={{ color: "var(--gold)" }} />
          </div>
          <p className="mb-1 font-medium" style={{ color: "var(--ink)" }}>
            Aucun client pour le moment
          </p>
          <p className="mb-6 text-sm" style={{ color: "var(--ink-muted)" }}>
            Ajoutez votre premier client pour commencer à facturer
          </p>
          <Link
            href="/clients/new"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}
          >
            <Plus className="h-4 w-4" />
            Ajouter un client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, i) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="animate-fade-in group block rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: "var(--white)",
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-medium"
                  style={{
                    backgroundColor: "rgba(201,168,76,0.12)",
                    color: "var(--gold)",
                  }}
                >
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: "var(--gold-pale)", color: "var(--ink-muted)" }}
                >
                  {client._count.invoices} facture{client._count.invoices !== 1 ? "s" : ""}
                </span>
              </div>
              <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
                {client.name}
              </h3>
              {client.email && (
                <p className="mt-1 text-sm" style={{ color: "var(--ink-muted)" }}>
                  {client.email}
                </p>
              )}
              {client.city && (
                <p className="mt-0.5 text-xs" style={{ color: "var(--ink-faint)" }}>
                  {client.city}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
