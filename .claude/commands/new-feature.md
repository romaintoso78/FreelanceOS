# New Feature Command

When implementing a new feature, follow this checklist:

## 1. Schema (if needed)
- [ ] Ajouter les modèles Prisma nécessaires
- [ ] Créer la migration : `npx prisma migrate dev --name "feat-nom-feature"`
- [ ] Ajouter les types dans `types/`

## 2. Validation
- [ ] Créer le schéma Zod dans `lib/validations/`

## 3. Server Actions
- [ ] Créer dans `app/actions/nom-feature.ts`
- [ ] Toujours : `getWorkspaceFromAuth()` en premier
- [ ] Toujours : validation Zod des inputs
- [ ] Toujours : filtrer par `workspaceId`

## 4. UI Components
- [ ] Server Component si possible (pas d'interactivité)
- [ ] Client Component avec `"use client"` uniquement si nécessaire
- [ ] Créer dans `components/nom-feature/`
- [ ] Exporter depuis `index.ts`

## 5. Pages
- [ ] Créer dans `app/(app)/nom-feature/`
- [ ] Loading state avec `loading.tsx`
- [ ] Error boundary avec `error.tsx`
- [ ] Empty state si liste vide

## 6. Tests
- [ ] Tests unitaires pour la logique métier
- [ ] Tests d'intégration pour les Server Actions critiques

## 7. Email (si applicable)
- [ ] Template dans `lib/email/templates/`
- [ ] Appel depuis la Server Action après mutation DB

## Pattern Server Action type :
```typescript
"use server"
import { getWorkspaceFromAuth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { featureSchema } from "@/lib/validations/feature"

export async function createFeatureAction(data: unknown) {
  const workspace = await getWorkspaceFromAuth()
  if (!workspace) throw new Error("Unauthorized")

  const validated = featureSchema.parse(data)

  const result = await prisma.feature.create({
    data: {
      ...validated,
      workspaceId: workspace.id,
    }
  })

  revalidatePath("/app/feature")
  return result
}
```
