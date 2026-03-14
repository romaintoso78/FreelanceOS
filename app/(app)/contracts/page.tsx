import type { Metadata } from "next"
import Link from "next/link"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDateShort } from "@/lib/utils"
import { Plus } from "lucide-react"

export const metadata: Metadata = { title: "Contrats" }

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyé",
  SIGNED: "Signé",
  EXPIRED: "Expiré",
  ARCHIVED: "Archivé",
}

const STATUS_CLASSES: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  SIGNED: "bg-green-100 text-green-700",
  EXPIRED: "bg-yellow-100 text-yellow-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
}

export default async function ContractsPage() {
  const workspace = await requireWorkspace()

  const contracts = await prisma.contract.findMany({
    where: { workspaceId: workspace.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contrats</h1>
          <p className="text-sm text-gray-500">{contracts.length} contrat(s)</p>
        </div>
        <Link
          href="/contracts/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nouveau contrat
        </Link>
      </div>

      {contracts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">Aucun contrat pour le moment</p>
          <Link
            href="/contracts/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Créer un contrat
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-3 text-left font-medium text-gray-500">Titre</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Client</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Créé le</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Expire le</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/contracts/${contract.id}`}
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {contract.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{contract.client.name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDateShort(contract.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {contract.expiresAt ? formatDateShort(contract.expiresAt) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[contract.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {STATUS_LABELS[contract.status] ?? contract.status}
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
