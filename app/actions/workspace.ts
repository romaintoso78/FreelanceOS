"use server"

import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getWorkspaceFromAuth } from "@/lib/auth"
import { onboardingSchema, updateWorkspaceSchema, type OnboardingInput, type UpdateWorkspaceInput } from "@/lib/validations/workspace"
import { generateSlug } from "@/lib/utils"
import { revalidatePath } from "next/cache"

export async function completeOnboardingAction(data: OnboardingInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Non autorisé")

  const validated = onboardingSchema.parse(data)
  const slug = generateSlug(validated.name)

  await prisma.workspace.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      name: validated.name,
      slug,
      legalStatus: validated.legalStatus,
      siret: validated.siret || null,
      address: validated.address || null,
      city: validated.city || null,
      postalCode: validated.postalCode || null,
      email: validated.email || null,
      phone: validated.phone || null,
      onboardingDone: true,
    },
    update: {
      name: validated.name,
      legalStatus: validated.legalStatus,
      siret: validated.siret || null,
      address: validated.address || null,
      city: validated.city || null,
      postalCode: validated.postalCode || null,
      email: validated.email || null,
      phone: validated.phone || null,
      onboardingDone: true,
    },
  })

  revalidatePath("/dashboard")
}

export async function updateWorkspaceAction(data: UpdateWorkspaceInput) {
  const workspace = await getWorkspaceFromAuth()
  if (!workspace) throw new Error("Non autorisé")

  const validated = updateWorkspaceSchema.parse(data)

  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      ...validated,
      siret: validated.siret || null,
      email: validated.email || null,
    },
  })

  revalidatePath("/settings")
  revalidatePath("/settings/workspace")
}
