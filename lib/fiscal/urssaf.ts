import type { LegalStatus } from "@prisma/client"

// Taux URSSAF 2024
const URSSAF_RATES = {
  AUTO_ENTREPRENEUR: {
    services: 0.22, // 22% pour activités de services BNC/BIC
    commerce: 0.128, // 12.8% pour vente de marchandises
  },
  SASU: {
    dividendes: 0.172, // prélèvements sociaux sur dividendes
    salaire: 0.45, // charges patronales + salariales approximatives
  },
  EURL: {
    tns: 0.45, // cotisations TNS approximatives
  },
}

// Seuils TVA Auto-entrepreneur 2024
export const AE_VAT_THRESHOLDS = {
  services: 37_500, // seuil franchise TVA pour services
  commerce: 85_000, // seuil franchise TVA pour commerce
}

export interface UrssafEstimation {
  cotisations: number
  tauxApplique: number
  base: number
  detail: string
}

export function calculateUrssafAE(caAnnuel: number): UrssafEstimation {
  const taux = URSSAF_RATES.AUTO_ENTREPRENEUR.services
  const cotisations = caAnnuel * taux

  return {
    cotisations,
    tauxApplique: taux,
    base: caAnnuel,
    detail: `22% du CA brut (activité de services)`,
  }
}

export function calculateUrssaf(
  legalStatus: LegalStatus,
  caAnnuel: number
): UrssafEstimation {
  switch (legalStatus) {
    case "AUTO_ENTREPRENEUR":
      return calculateUrssafAE(caAnnuel)
    case "SASU":
      // Estimation simplifiée : IS + charges sociales sur salaire minimum
      return {
        cotisations: caAnnuel * 0.35,
        tauxApplique: 0.35,
        base: caAnnuel,
        detail: "Estimation charges SASU (IS + cotisations sociales)",
      }
    case "EURL":
      return {
        cotisations: caAnnuel * 0.4,
        tauxApplique: 0.4,
        base: caAnnuel,
        detail: "Estimation cotisations TNS EURL",
      }
  }
}

export function getVatThresholdWarning(
  caYTD: number,
  legalStatus: LegalStatus
): { level: "none" | "warning" | "critical"; message: string } | null {
  if (legalStatus !== "AUTO_ENTREPRENEUR") return null

  const threshold = AE_VAT_THRESHOLDS.services

  if (caYTD >= threshold * 0.95) {
    return {
      level: "critical",
      message: `Attention : vous approchez du seuil de franchise TVA (${threshold.toLocaleString("fr-FR")} €). Consultez un comptable.`,
    }
  }

  if (caYTD >= threshold * 0.8) {
    return {
      level: "warning",
      message: `Vigilance : vous avez atteint 80% du seuil de franchise TVA (${threshold.toLocaleString("fr-FR")} €).`,
    }
  }

  return { level: "none", message: "" }
}
