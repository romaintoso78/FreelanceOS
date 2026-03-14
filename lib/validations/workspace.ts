import { z } from "zod"

export const onboardingSchema = z.object({
  name: z.string().min(1, "Le nom commercial est requis").max(255),
  legalStatus: z.enum(["AUTO_ENTREPRENEUR", "SASU", "EURL"]),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
})

export const updateWorkspaceSchema = onboardingSchema.partial()

export type OnboardingInput = z.infer<typeof onboardingSchema>
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>
