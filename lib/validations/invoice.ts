import { z } from "zod"

export const invoiceItemSchema = z.object({
  description: z.string().min(1, "La description est requise"),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  unitPrice: z.coerce.number().nonnegative("Le prix doit être positif"),
  vatRate: z.coerce.number().min(0).max(100),
  position: z.number().int().nonnegative(),
})

export const createInvoiceSchema = z.object({
  clientId: z.string().cuid("Sélectionnez un client"),
  missionId: z.string().cuid().optional(),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  vatExempt: z.boolean().default(false),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, "Ajoutez au moins une ligne"),
})

export const updateInvoiceSchema = createInvoiceSchema.partial()

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>
