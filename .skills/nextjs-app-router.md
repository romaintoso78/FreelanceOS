# Next.js App Router — Conventions FreelanceOS

## Règle fondamentale : Server Components par défaut

```
Composant → besoin d'interactivité ?
  NON → Server Component (par défaut, pas de directive nécessaire)
  OUI → "use client" + Client Component
```

## Quand utiliser `"use client"`

- `useState`, `useEffect`, `useCallback`, `useMemo`
- Event handlers (onClick, onChange, onSubmit)
- Browser APIs (localStorage, window, navigator)
- Hooks React Query / SWR

## Structure des dossiers

```
app/
  (marketing)/     ← route group, pas de segment URL
  (auth)/          ← route group auth
  (app)/           ← route group app protégé (layout vérifie l'auth)
  api/             ← API routes (webhooks, PDF streaming)
  actions/         ← Server Actions (mutations)
```

## Server Actions (mutations)

```typescript
// app/actions/invoice.ts
"use server"

export async function createInvoiceAction(data: unknown) {
  const workspace = await requireWorkspace()
  // validation Zod, mutation Prisma, revalidatePath
}
```

## Loading states

```
app/(app)/invoices/
  page.tsx      ← la page
  loading.tsx   ← skeleton pendant le chargement (Suspense automatique)
  error.tsx     ← error boundary
```

## Patterns de fetch data

```typescript
// ✅ Correct — Server Component avec fetch direct
export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany(...)
  return <InvoiceTable invoices={invoices} />
}

// ❌ Incorrect — ne pas fetcher dans les composants clients
export function InvoiceTable() {
  useEffect(() => {
    fetch('/api/invoices') // ne pas faire ça
  }, [])
}
```

## Dynamic routes

```typescript
// app/(app)/invoices/[id]/page.tsx
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params  // params est une Promise en Next.js 15+
  // ...
}
```
