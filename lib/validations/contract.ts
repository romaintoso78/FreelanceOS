import { z } from "zod"

export const createContractSchema = z.object({
  clientId: z.string().cuid("Sélectionnez un client"),
  templateId: z.string().cuid().optional(),
  title: z.string().min(1, "Le titre est requis").max(255),
  content: z.string().min(1, "Le contenu est requis"),
  expiresAt: z.coerce.date().optional(),
})

export const updateContractSchema = createContractSchema.partial()

export const signContractSchema = z.object({
  token: z.string().cuid(),
  signerName: z.string().min(1, "Le nom est requis"),
})

export type CreateContractInput = z.infer<typeof createContractSchema>
export type UpdateContractInput = z.infer<typeof updateContractSchema>
export type SignContractInput = z.infer<typeof signContractSchema>
