import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount, formatDateShort } from "@/lib/utils"

export const metadata: Metadata = { title: "Facture" }

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const workspace = await requireWorkspace()

  const rawInvoice = await prisma.invoice.findFirst({
    where: { id, workspaceId: workspace.id },
    include: {
      client: true,
      items: { orderBy: { position: "asc" } },
    },
  })

  if (!rawInvoice) notFound()

  const invoice = {
    ...rawInvoice,
    subtotalHT: Number(rawInvoice.subtotalHT),
    vatAmount: Number(rawInvoice.vatAmount),
    totalTTC: Number(rawInvoice.totalTTC),
    items: rawInvoice.items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      vatRate: Number(item.vatRate),
      totalHT: Number(item.totalHT),
    })),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facture {invoice.number}</h1>
          <p className="text-sm text-gray-500">
            Émise le {formatDateShort(invoice.issueDate)} · Échéance{" "}
            {formatDateShort(invoice.dueDate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/api/invoices/${id}/pdf`}
            target="_blank"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Télécharger PDF
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Prestataire</h2>
            <p className="mt-1 font-medium text-gray-900">{workspace.name}</p>
            {workspace.siret && (
              <p className="text-sm text-gray-500">SIRET : {workspace.siret}</p>
            )}
            {workspace.address && (
              <p className="text-sm text-gray-500">{workspace.address}</p>
            )}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500">Client</h2>
            <p className="mt-1 font-medium text-gray-900">{invoice.client.name}</p>
            {invoice.client.email && (
              <p className="text-sm text-gray-500">{invoice.client.email}</p>
            )}
            {invoice.client.address && (
              <p className="text-sm text-gray-500">{invoice.client.address}</p>
            )}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Qté</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Prix unit. HT</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">TVA</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-gray-700">{item.description}</td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {Number(item.quantity)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {formatAmount(Number(item.unitPrice))}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {Number(item.vatRate)}%
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {formatAmount(Number(item.totalHT))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sous-total HT</span>
              <span className="text-gray-900">{formatAmount(Number(invoice.subtotalHT))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">TVA</span>
              <span className="text-gray-900">{formatAmount(Number(invoice.vatAmount))}</span>
            </div>
            {invoice.vatExempt && (
              <p className="text-xs text-gray-400">
                TVA non applicable, art. 293B du CGI
              </p>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
              <span>Total TTC</span>
              <span>{formatAmount(Number(invoice.totalTTC))}</span>
            </div>
          </div>
        </div>

        {!invoice.vatExempt && (
          <p className="mt-6 text-xs text-gray-400">
            En cas de retard de paiement, des pénalités de retard au taux de 3 fois le taux
            d&apos;intérêt légal seront appliquées, ainsi qu&apos;une indemnité forfaitaire de
            recouvrement de 40 €.
          </p>
        )}
      </div>
    </div>
  )
}
