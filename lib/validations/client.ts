import { z } from "zod"

export const createClientSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("FR"),
  siret: z.string().regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres").optional().or(z.literal("")),
  vatNumber: z.string().optional(),
  notes: z.string().optional(),
})

export const updateClientSchema = createClientSchema.partial()

export type CreateClientInput = z.infer<typeof createClientSchema>
export type UpdateClientInput = z.infer<typeof updateClientSchema>
