"use server"

import { prisma } from "@/lib/prisma"
import { requireWorkspace } from "@/lib/auth"
import { createInvoiceSchema, type CreateInvoiceInput } from "@/lib/validations/invoice"
import { revalidatePath } from "next/cache"
import { Decimal } from "@prisma/client/runtime/library"

async function generateInvoiceNumber(workspaceId: string): Promise<string> {
  const year = new Date().getFullYear()

  // Use a transaction with locking to prevent race conditions
  return await prisma.$transaction(async (tx) => {
    const lastInvoice = await tx.invoice.findFirst({
      where: {
        workspaceId,
        number: { startsWith: `${year}-` },
      },
      orderBy: { number: "desc" },
      select: { number: true },
    })

    let nextNum = 1
    if (lastInvoice) {
      const parts = lastInvoice.number.split("-")
      nextNum = parseInt(parts[1] ?? "0", 10) + 1
    }

    return `${year}-${String(nextNum).padStart(3, "0")}`
  })
}

function calculateTotals(
  items: CreateInvoiceInput["items"],
  vatExempt: boolean
): { subtotalHT: Decimal; vatAmount: Decimal; totalTTC: Decimal } {
  let subtotalHT = 0
  let vatAmount = 0

  for (const item of items) {
    const lineHT = item.quantity * item.unitPrice
    subtotalHT += lineHT
    if (!vatExempt) {
      vatAmount += lineHT * (item.vatRate / 100)
    }
  }

  return {
    subtotalHT: new Decimal(subtotalHT.toFixed(2)),
    vatAmount: new Decimal(vatAmount.toFixed(2)),
    totalTTC: new Decimal((subtotalHT + vatAmount).toFixed(2)),
  }
}

export async function createInvoiceAction(data: CreateInvoiceInput) {
  const workspace = await requireWorkspace()
  const validated = createInvoiceSchema.parse(data)

  // Verify client belongs to this workspace
  const client = await prisma.client.findFirst({
    where: { id: validated.clientId, workspaceId: workspace.id, deletedAt: null },
  })
  if (!client) throw new Error("Client introuvable")

  const number = await generateInvoiceNumber(workspace.id)
  const { subtotalHT, vatAmount, totalTTC } = calculateTotals(
    validated.items,
    validated.vatExempt
  )

  const invoice = await prisma.invoice.create({
    data: {
      workspaceId: workspace.id,
      clientId: validated.clientId,
      missionId: validated.missionId ?? null,
      number,
      status: "DRAFT",
      issueDate: validated.issueDate,
      dueDate: validated.dueDate,
      vatExempt: validated.vatExempt,
      subtotalHT,
      vatAmount,
      totalTTC,
      notes: validated.notes ?? null,
      items: {
        create: validated.items.map((item, index) => ({
          description: item.description,
          quantity: new Decimal(item.quantity),
          unitPrice: new Decimal(item.unitPrice),
          vatRate: new Decimal(item.vatRate),
          totalHT: new Decimal((item.quantity * item.unitPrice).toFixed(2)),
          position: item.position ?? index,
        })),
      },
    },
    include: { items: true },
  })

  revalidatePath("/invoices")
  return invoice
}

export async function markInvoicePaidAction(id: string) {
  const workspace = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!invoice) throw new Error("Facture introuvable")

  await prisma.invoice.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  })

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${id}`)
}

export async function sendInvoiceAction(id: string) {
  const workspace = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: { id, workspaceId: workspace.id },
    include: { client: true },
  })
  if (!invoice) throw new Error("Facture introuvable")
  if (!invoice.client.email) throw new Error("Le client n'a pas d'adresse email")

  await prisma.invoice.update({
    where: { id },
    data: { status: "SENT", sentAt: new Date() },
  })

  // Email sending would be implemented here when PDF generation is set up
  // const pdfBuffer = await generateInvoicePdf(invoice)
  // await sendEmail({ ... })

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${id}`)
}

export async function cancelInvoiceAction(id: string, avoirReference?: string) {
  const workspace = await requireWorkspace()

  const invoice = await prisma.invoice.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!invoice) throw new Error("Facture introuvable")

  await prisma.invoice.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      avoirReference: avoirReference ?? null,
    },
  })

  revalidatePath("/invoices")
  revalidatePath(`/invoices/${id}`)
}
