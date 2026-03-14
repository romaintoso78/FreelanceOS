"use server"

import { prisma } from "@/lib/prisma"
import { requireWorkspace } from "@/lib/auth"
import { createContractSchema, type CreateContractInput } from "@/lib/validations/contract"
import { revalidatePath } from "next/cache"
import { createId } from "@paralleldrive/cuid2"
import { headers } from "next/headers"

export async function createContractAction(data: CreateContractInput) {
  const workspace = await requireWorkspace()
  const validated = createContractSchema.parse(data)

  const client = await prisma.client.findFirst({
    where: { id: validated.clientId, workspaceId: workspace.id, deletedAt: null },
  })
  if (!client) throw new Error("Client introuvable")

  const contract = await prisma.contract.create({
    data: {
      workspaceId: workspace.id,
      clientId: validated.clientId,
      templateId: validated.templateId ?? null,
      title: validated.title,
      content: validated.content,
      expiresAt: validated.expiresAt ?? null,
    },
  })

  revalidatePath("/contracts")
  return contract
}

export async function sendContractForSignatureAction(id: string) {
  const workspace = await requireWorkspace()

  const contract = await prisma.contract.findFirst({
    where: { id, workspaceId: workspace.id },
    include: { client: true },
  })
  if (!contract) throw new Error("Contrat introuvable")
  if (!contract.client.email) throw new Error("Le client n'a pas d'adresse email")

  const signatureToken = createId()
  const expiresAt = contract.expiresAt ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  await prisma.contract.update({
    where: { id },
    data: {
      status: "SENT",
      sentAt: new Date(),
      signatureToken,
      expiresAt,
    },
  })

  // Email sending would be implemented here
  // const signatureUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${signatureToken}`
  // await sendEmail({ ... })

  revalidatePath("/contracts")
  revalidatePath(`/contracts/${id}`)
}

export async function signContractAction(token: string, signerName: string) {
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? headersList.get("x-real-ip") ?? "unknown"

  const contract = await prisma.contract.findUnique({
    where: { signatureToken: token },
  })

  if (!contract) throw new Error("Contrat introuvable ou lien invalide")
  if (contract.status === "SIGNED") throw new Error("Ce contrat a déjà été signé")
  if (contract.expiresAt && contract.expiresAt < new Date()) {
    throw new Error("Ce lien de signature a expiré")
  }

  await prisma.contract.update({
    where: { id: contract.id },
    data: {
      status: "SIGNED",
      signedAt: new Date(),
      signerName,
      signerIp: ip,
      signatureToken: null, // Invalidate token after use
    },
  })

  revalidatePath(`/contracts/${contract.id}`)
}
