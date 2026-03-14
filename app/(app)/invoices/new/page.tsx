import type { Metadata } from "next"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { InvoiceForm } from "@/components/invoices"

export const metadata: Metadata = { title: "Nouvelle facture" }

export default async function NewInvoicePage() {
  const workspace = await requireWorkspace()

  const clients = await prisma.client.findMany({
    where: { workspaceId: workspace.id, deletedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle facture</h1>
        <p className="text-sm text-gray-500">Créez une facture conforme à la loi française</p>
      </div>
      <InvoiceForm
        clients={clients}
        vatExempt={workspace.legalStatus === "AUTO_ENTREPRENEUR"}
      />
    </div>
  )
}
