# Prisma + Supabase — FreelanceOS

## Configuration dual-connection (obligatoire avec Supabase)

```env
DATABASE_URL=postgresql://...?pgbouncer=true   # PgBouncer (connection pooling)
DIRECT_URL=postgresql://...                     # Direct (pour les migrations)
```

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")   // utilisé par prisma migrate
}
```

## Singleton (lib/prisma.ts)

Ne jamais créer de nouveau PrismaClient — utiliser l'import depuis `@/lib/prisma`.

## Patterns de query multi-tenant

```typescript
// ✅ Toujours filtrer par workspaceId
const invoices = await prisma.invoice.findMany({
  where: {
    workspaceId: workspace.id,  // OBLIGATOIRE
    status: "PAID",
  },
})

// ✅ findFirst pour vérifier ownership avant update/delete
const invoice = await prisma.invoice.findFirst({
  where: { id, workspaceId: workspace.id },
})
if (!invoice) throw new Error("Introuvable")
```

## Numérotation sans trou (transaction + lock)

```typescript
async function generateInvoiceNumber(workspaceId: string) {
  return await prisma.$transaction(async (tx) => {
    const last = await tx.invoice.findFirst({
      where: { workspaceId, number: { startsWith: `${year}-` } },
      orderBy: { number: "desc" },
      select: { number: true },
    })
    const nextNum = last ? parseInt(last.number.split("-")[1]) + 1 : 1
    return `${year}-${String(nextNum).padStart(3, "0")}`
  })
}
```

## Soft delete

```typescript
// Supprimer (soft)
await prisma.client.update({
  where: { id },
  data: { deletedAt: new Date() },
})

// Lire (exclure les supprimés)
await prisma.client.findMany({
  where: { workspaceId: workspace.id, deletedAt: null },
})
```

## Migrations

```bash
npx prisma migrate dev --name "add-invoice-model"
npx prisma generate   # après modification du schéma
npx prisma studio     # UI pour inspecter la DB
```
