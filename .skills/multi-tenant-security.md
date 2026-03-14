# Multi-tenant Security — FreelanceOS

## Le problème fondamental

Dans une app multi-tenant avec un seul schéma de base de données, chaque query Prisma
doit être filtrée par `workspaceId`. Un oubli = data leak entre comptes.

## Pattern obligatoire dans chaque Server Action

```typescript
"use server"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function someAction(id: string) {
  // 1. Toujours en premier
  const workspace = await requireWorkspace()

  // 2. Toujours vérifier que la ressource appartient au workspace
  const resource = await prisma.someModel.findFirst({
    where: {
      id,
      workspaceId: workspace.id,  // ← OBLIGATOIRE
    },
  })

  if (!resource) throw new Error("Introuvable")  // Ne pas révéler si ça existe ailleurs

  // 3. Mutation
  await prisma.someModel.update({
    where: { id },
    data: { ... },
  })
}
```

## Règles absolues

1. **Jamais** passer `workspaceId` depuis le client (params URL, body request)
2. **Toujours** appeler `requireWorkspace()` ou `getWorkspaceFromAuth()`
3. **Toujours** filtrer par `workspaceId` dans chaque `findMany`, `findFirst`, `findUnique`
4. Pour `findUnique` par ID : utiliser `findFirst` avec filtre `workspaceId`
5. Les erreurs "non trouvé" ne doivent pas révéler si la ressource existe dans un autre workspace

## Helper auth.ts

```typescript
// lib/auth.ts
export async function getWorkspaceFromAuth(): Promise<Workspace | null>
export async function requireWorkspace(): Promise<Workspace>  // throw si non connecté
```

## Checklist review

- [ ] Server Action commence par `requireWorkspace()` ou `getWorkspaceFromAuth()`
- [ ] Chaque query Prisma inclut `workspaceId: workspace.id`
- [ ] Aucun `workspaceId` ne vient du client
- [ ] Les tokens (contrats) sont des CUID imprévisibles
