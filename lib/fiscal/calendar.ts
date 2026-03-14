import type { LegalStatus, FiscalEventType } from "@prisma/client"

export interface FiscalEventTemplate {
  type: FiscalEventType
  title: string
  description: string
  month: number // 1-12
  day: number
  isRecurring: boolean
}

const AE_MONTHLY_EVENTS: FiscalEventTemplate[] = [
  // Déclarations URSSAF mensuelles (le 31 de chaque mois)
  ...Array.from({ length: 12 }, (_, i) => ({
    type: "URSSAF" as FiscalEventType,
    title: `Déclaration URSSAF — ${new Date(2024, i, 1).toLocaleString("fr-FR", { month: "long" })}`,
    description: "Déclaration mensuelle du CA et paiement des cotisations URSSAF",
    month: i + 1,
    day: 31,
    isRecurring: true,
  })),
]

const AE_QUARTERLY_EVENTS: FiscalEventTemplate[] = [
  {
    type: "URSSAF",
    title: "Déclaration URSSAF T1 (jan-mars)",
    description: "Déclaration trimestrielle URSSAF — Q1",
    month: 4,
    day: 30,
    isRecurring: true,
  },
  {
    type: "URSSAF",
    title: "Déclaration URSSAF T2 (avr-juin)",
    description: "Déclaration trimestrielle URSSAF — Q2",
    month: 7,
    day: 31,
    isRecurring: true,
  },
  {
    type: "URSSAF",
    title: "Déclaration URSSAF T3 (juil-sept)",
    description: "Déclaration trimestrielle URSSAF — Q3",
    month: 10,
    day: 31,
    isRecurring: true,
  },
  {
    type: "URSSAF",
    title: "Déclaration URSSAF T4 (oct-déc)",
    description: "Déclaration trimestrielle URSSAF — Q4",
    month: 1,
    day: 31,
    isRecurring: true,
  },
]

const CFE_EVENT: FiscalEventTemplate = {
  type: "CFE",
  title: "Cotisation Foncière des Entreprises (CFE)",
  description: "Paiement annuel de la CFE",
  month: 12,
  day: 15,
  isRecurring: true,
}

const SASU_EVENTS: FiscalEventTemplate[] = [
  {
    type: "IS",
    title: "Acompte IS — Échéance 1",
    description: "Premier acompte d'impôt sur les sociétés",
    month: 3,
    day: 15,
    isRecurring: true,
  },
  {
    type: "IS",
    title: "Acompte IS — Échéance 2",
    description: "Deuxième acompte d'impôt sur les sociétés",
    month: 6,
    day: 15,
    isRecurring: true,
  },
  {
    type: "IS",
    title: "Acompte IS — Échéance 3",
    description: "Troisième acompte d'impôt sur les sociétés",
    month: 9,
    day: 15,
    isRecurring: true,
  },
  {
    type: "IS",
    title: "Acompte IS — Échéance 4",
    description: "Quatrième acompte d'impôt sur les sociétés",
    month: 12,
    day: 15,
    isRecurring: true,
  },
  {
    type: "TVA",
    title: "Déclaration TVA trimestrielle",
    description: "Déclaration et paiement de la TVA collectée",
    month: 4,
    day: 20,
    isRecurring: true,
  },
  CFE_EVENT,
]

export function getFiscalEventsForStatus(
  legalStatus: LegalStatus,
  year: number,
  quarterly = false
): Array<{ date: Date; type: FiscalEventType; title: string; description: string; isRecurring: boolean }> {
  let templates: FiscalEventTemplate[]

  switch (legalStatus) {
    case "AUTO_ENTREPRENEUR":
      templates = [
        ...(quarterly ? AE_QUARTERLY_EVENTS : AE_MONTHLY_EVENTS),
        CFE_EVENT,
      ]
      break
    case "SASU":
    case "EURL":
      templates = SASU_EVENTS
      break
  }

  return templates.map((t) => {
    const eventYear = t.month === 1 && legalStatus === "AUTO_ENTREPRENEUR" && quarterly
      ? year + 1
      : year

    // Clamp day to last day of month
    const lastDay = new Date(eventYear, t.month, 0).getDate()
    const day = Math.min(t.day, lastDay)

    return {
      date: new Date(eventYear, t.month - 1, day),
      type: t.type,
      title: t.title,
      description: t.description,
      isRecurring: t.isRecurring,
    }
  })
}
