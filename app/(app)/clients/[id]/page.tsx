import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount, formatDateShort } from "@/lib/utils"
import { Plus } from "lucide-react"

export const metadata: Metadata = { title: "Fiche client" }

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workspace = await requireWorkspace()

  const rawClient = await prisma.client.findFirst({
    where: { id, workspaceId: workspace.id, deletedAt: null },
    include: {
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      missions: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!rawClient) notFound()

  const client = {
    ...rawClient,
    invoices: rawClient.invoices.map(inv => ({
      ...inv,
      subtotalHT: Number(inv.subtotalHT),
      vatAmount: Number(inv.vatAmount),
      totalTTC: Number(inv.totalTTC),
    })),
    missions: rawClient.missions.map(m => ({
      ...m,
      dailyRate: m.dailyRate ? Number(m.dailyRate) : null,
    })),
  }

  const totalCA = client.invoices
    .filter((i) => i.status === "PAID")
    .reduce((sum, i) => sum + Number(i.totalTTC), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <p className="text-sm text-gray-500">
            Client depuis le {formatDateShort(client.createdAt)}
          </p>
        </div>
        <Link
          href="/clients/new"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Modifier
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">CA total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{formatAmount(totalCA)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Factures</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{client.invoices.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Missions</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{client.missions.length}</p>
        </div>
      </div>

      {/* Client info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Informations</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          {client.email && (
            <>
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{client.email}</dd>
            </>
          )}
          {client.phone && (
            <>
              <dt className="text-gray-500">Téléphone</dt>
              <dd className="text-gray-900">{client.phone}</dd>
            </>
          )}
          {client.address && (
            <>
              <dt className="text-gray-500">Adresse</dt>
              <dd className="text-gray-900">
                {client.address}
                {client.postalCode && client.city && (
                  <>
                    <br />
                    {client.postalCode} {client.city}
                  </>
                )}
              </dd>
            </>
          )}
          {client.siret && (
            <>
              <dt className="text-gray-500">SIRET</dt>
              <dd className="text-gray-900">{client.siret}</dd>
            </>
          )}
        </dl>
      </div>

      {/* Recent invoices */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Factures récentes</h2>
          <Link
            href={`/invoices/new?clientId=${client.id}`}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-3 w-3" />
            Nouvelle facture
          </Link>
        </div>
        {client.invoices.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Aucune facture pour ce client
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {client.invoices.map((invoice) => (
              <li key={invoice.id} className="flex items-center justify-between px-6 py-3">
                <Link
                  href={`/invoices/${invoice.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {invoice.number}
                </Link>
                <span className="text-sm text-gray-500">
                  {formatDateShort(invoice.issueDate)}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatAmount(Number(invoice.totalTTC))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
