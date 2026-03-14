"use server"

import { prisma } from "@/lib/prisma"
import { requireWorkspace } from "@/lib/auth"
import { createQuoteSchema, type CreateQuoteInput } from "@/lib/validations/quote"
import { revalidatePath } from "next/cache"
import { Decimal } from "@prisma/client/runtime/library"

async function generateQuoteNumber(workspaceId: string): Promise<string> {
  const year = new Date().getFullYear()

  return await prisma.$transaction(async (tx) => {
    const lastQuote = await tx.quote.findFirst({
      where: {
        workspaceId,
        number: { startsWith: `DEV-${year}-` },
      },
      orderBy: { number: "desc" },
      select: { number: true },
    })

    let nextNum = 1
    if (lastQuote) {
      const parts = lastQuote.number.split("-")
      nextNum = parseInt(parts[2] ?? "0", 10) + 1
    }

    return `DEV-${year}-${String(nextNum).padStart(3, "0")}`
  })
}

export async function createQuoteAction(data: CreateQuoteInput) {
  const workspace = await requireWorkspace()
  const validated = createQuoteSchema.parse(data)

  const client = await prisma.client.findFirst({
    where: { id: validated.clientId, workspaceId: workspace.id, deletedAt: null },
  })
  if (!client) throw new Error("Client introuvable")

  const number = await generateQuoteNumber(workspace.id)

  let subtotalHT = 0
  let vatAmount = 0
  for (const item of validated.items) {
    const lineHT = item.quantity * item.unitPrice
    subtotalHT += lineHT
    vatAmount += lineHT * (item.vatRate / 100)
  }

  const quote = await prisma.quote.create({
    data: {
      workspaceId: workspace.id,
      clientId: validated.clientId,
      number,
      status: "DRAFT",
      issueDate: validated.issueDate,
      validUntil: validated.validUntil,
      subtotalHT: new Decimal(subtotalHT.toFixed(2)),
      vatAmount: new Decimal(vatAmount.toFixed(2)),
      totalTTC: new Decimal((subtotalHT + vatAmount).toFixed(2)),
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

  revalidatePath("/quotes")
  return quote
}

export async function convertQuoteToInvoiceAction(quoteId: string) {
  const workspace = await requireWorkspace()

  const quote = await prisma.quote.findFirst({
    where: { id: quoteId, workspaceId: workspace.id },
    include: { items: true },
  })
  if (!quote) throw new Error("Devis introuvable")
  if (quote.status !== "ACCEPTED") throw new Error("Le devis doit être accepté")

  const year = new Date().getFullYear()
  const invoiceNumber = await prisma.$transaction(async (tx) => {
    const lastInvoice = await tx.invoice.findFirst({
      where: { workspaceId: workspace.id, number: { startsWith: `${year}-` } },
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

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 30)

  const invoice = await prisma.invoice.create({
    data: {
      workspaceId: workspace.id,
      clientId: quote.clientId,
      number: invoiceNumber,
      status: "DRAFT",
      issueDate: new Date(),
      dueDate,
      vatExempt: false,
      subtotalHT: quote.subtotalHT,
      vatAmount: quote.vatAmount,
      totalTTC: quote.totalTTC,
      notes: quote.notes,
      items: {
        create: quote.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          vatRate: item.vatRate,
          totalHT: item.totalHT,
          position: item.position,
        })),
      },
    },
  })

  revalidatePath("/invoices")
  revalidatePath("/quotes")
  return invoice
}
