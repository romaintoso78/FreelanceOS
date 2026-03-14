import { z } from "zod"

export const quoteItemSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  unitPrice: z.coerce.number().nonnegative("Le prix doit être positif"),
  vatRate: z.coerce.number().min(0).max(100),
  position: z.number().int().nonnegative(),
})

export const createQuoteSchema = z.object({
  clientId: z.string().cuid("Sélectionnez un client"),
  issueDate: z.coerce.date(),
  validUntil: z.coerce.date(),
  notes: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "Ajoutez au moins une ligne"),
})

export const updateQuoteSchema = createQuoteSchema.partial()

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>
