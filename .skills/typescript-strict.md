# TypeScript Strict — FreelanceOS

## Config

```json
{ "compilerOptions": { "strict": true } }
```

## Règles absolues

- **Jamais `any`** — utiliser `unknown` + type guard, ou type précis
- **Jamais `as X`** sans justification claire
- **Jamais `!`** (non-null assertion) sans être certain que ça ne peut pas être null

## Types Prisma

```typescript
// ✅ Utiliser les types générés par Prisma
import type { Invoice, Client, Workspace } from "@prisma/client"

// Types avec relations (via Prisma utility types)
import type { Prisma } from "@prisma/client"
type InvoiceWithClient = Prisma.InvoiceGetPayload<{
  include: { client: true }
}>
```

## Decimal Prisma

```typescript
import { Decimal } from "@prisma/client/runtime/library"

// Convertir pour l'affichage
const amount = Number(invoice.totalTTC)
formatAmount(amount)

// Créer un Decimal pour Prisma
new Decimal(123.45)
new Decimal("123.45")
```

## Patterns utiles

```typescript
// Type guard
function isError(e: unknown): e is Error {
  return e instanceof Error
}

// Satisfies operator (vérifie sans widening)
const config = { key: "value" } satisfies Record<string, string>

// Template literal types
type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED"
```
