"use server"

import { prisma } from "@/lib/prisma"
import { requireWorkspace } from "@/lib/auth"
import { createClientSchema, updateClientSchema, type CreateClientInput, type UpdateClientInput } from "@/lib/validations/client"
import { revalidatePath } from "next/cache"

export async function createClientAction(data: CreateClientInput) {
  const workspace = await requireWorkspace()
  const validated = createClientSchema.parse(data)

  const client = await prisma.client.create({
    data: {
      workspaceId: workspace.id,
      name: validated.name,
      email: validated.email || null,
      phone: validated.phone || null,
      address: validated.address || null,
      city: validated.city || null,
      postalCode: validated.postalCode || null,
      country: validated.country ?? "FR",
      siret: validated.siret || null,
      vatNumber: validated.vatNumber || null,
      notes: validated.notes || null,
    },
  })

  revalidatePath("/clients")
  return client
}

export async function updateClientAction(id: string, data: UpdateClientInput) {
  const workspace = await requireWorkspace()
  const validated = updateClientSchema.parse(data)

  // Verify ownership
  const existing = await prisma.client.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!existing) throw new Error("Client introuvable")

  const client = await prisma.client.update({
    where: { id },
    data: {
      ...validated,
      email: validated.email || null,
      siret: validated.siret || null,
    },
  })

  revalidatePath("/clients")
  revalidatePath(`/clients/${id}`)
  return client
}

export async function deleteClientAction(id: string) {
  const workspace = await requireWorkspace()

  const existing = await prisma.client.findFirst({
    where: { id, workspaceId: workspace.id },
  })
  if (!existing) throw new Error("Client introuvable")

  await prisma.client.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  revalidatePath("/clients")
}
