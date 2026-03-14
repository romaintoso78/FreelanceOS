# Zod Validation — FreelanceOS

## Emplacement des schémas

Tous les schémas Zod dans `lib/validations/`. Jamais inline dans les composants.

## Pattern schéma + types

```typescript
// lib/validations/client.ts
import { z } from "zod"

export const createClientSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  siret: z.string().regex(/^\d{14}$/, "SIRET invalide").optional().or(z.literal("")),
})

export type CreateClientInput = z.infer<typeof createClientSchema>
```

## Intégration react-hook-form

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSchema, type CreateClientInput } from "@/lib/validations/client"

const { register, handleSubmit, formState: { errors } } = useForm<CreateClientInput>({
  resolver: zodResolver(createClientSchema),
})
```

## Validation dans les Server Actions

```typescript
export async function createClientAction(data: unknown) {
  const workspace = await requireWorkspace()
  const validated = createClientSchema.parse(data)  // throw si invalide
  // ...
}
```

## Patterns courants

```typescript
// Champ optionnel ou vide
z.string().optional().or(z.literal(""))

// Date coercée depuis string (input[type="date"])
z.coerce.date()

// Nombre coercé depuis input
z.coerce.number().positive()

// Enum
z.enum(["AUTO_ENTREPRENEUR", "SASU", "EURL"])
```
