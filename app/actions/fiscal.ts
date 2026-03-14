"use server"

import { prisma } from "@/lib/prisma"
import { requireWorkspace } from "@/lib/auth"
import { getFiscalEventsForStatus } from "@/lib/fiscal/calendar"
import { revalidatePath } from "next/cache"

export async function generateFiscalCalendarAction(year?: number) {
  const workspace = await requireWorkspace()
  const targetYear = year ?? new Date().getFullYear()

  const events = getFiscalEventsForStatus(workspace.legalStatus, targetYear)

  // Check which events already exist
  const existing = await prisma.fiscalEvent.findMany({
    where: {
      workspaceId: workspace.id,
      dueDate: {
        gte: new Date(targetYear, 0, 1),
        lt: new Date(targetYear + 1, 0, 1),
      },
    },
    select: { title: true, dueDate: true },
  })

  const existingSet = new Set(
    existing.map((e) => `${e.title}-${e.dueDate.toISOString().slice(0, 10)}`)
  )

  const toCreate = events.filter((e) => {
    const key = `${e.title}-${e.date.toISOString().slice(0, 10)}`
    return !existingSet.has(key)
  })

  if (toCreate.length > 0) {
    await prisma.fiscalEvent.createMany({
      data: toCreate.map((e) => ({
        workspaceId: workspace.id,
        type: e.type,
        title: e.title,
        description: e.description,
        dueDate: e.date,
        isRecurring: e.isRecurring,
      })),
    })
  }

  revalidatePath("/fiscal")
  return toCreate.length
}

export async function markFiscalEventPaidAction(id: string) {
  const workspace = await requireWorkspace()

  const event = await prisma.fiscalEvent.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!event) throw new Error("Échéance introuvable")

  await prisma.fiscalEvent.update({
    where: { id },
    data: { isPaid: true, paidAt: new Date() },
  })

  revalidatePath("/fiscal")
}
