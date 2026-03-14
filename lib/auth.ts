import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import type { Workspace } from "@prisma/client"

export async function getWorkspaceFromAuth(): Promise<Workspace | null> {
  const { userId } = await auth()
  if (!userId) return null

  const workspace = await prisma.workspace.findUnique({
    where: { clerkUserId: userId },
  })

  return workspace
}

export async function requireWorkspace(): Promise<Workspace> {
  const workspace = await getWorkspaceFromAuth()
  if (!workspace) {
    throw new Error("Unauthorized: no workspace found for this user")
  }
  return workspace
}
