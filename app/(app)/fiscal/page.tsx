import type { Metadata } from "next"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount, formatDateShort } from "@/lib/utils"
import { generateFiscalCalendarAction } from "@/app/actions/fiscal"

export const metadata: Metadata = { title: "Fiscal" }

const TYPE_LABELS: Record<string, string> = {
  URSSAF: "URSSAF",
  TVA: "TVA",
  IS: "Impôt sur les sociétés",
  CFE: "CFE",
  OTHER: "Autre",
}

const TYPE_CLASSES: Record<string, string> = {
  URSSAF: "bg-blue-100 text-blue-700",
  TVA: "bg-purple-100 text-purple-700",
  IS: "bg-orange-100 text-orange-700",
  CFE: "bg-pink-100 text-pink-700",
  OTHER: "bg-gray-100 text-gray-700",
}

export default async function FiscalPage() {
  const workspace = await requireWorkspace()

  let events = await prisma.fiscalEvent.findMany({
    where: {
      workspaceId: workspace.id,
      dueDate: { gte: new Date(new Date().getFullYear(), 0, 1) },
    },
    orderBy: { dueDate: "asc" },
  })

  // Auto-generate if none exist
  if (events.length === 0) {
    await generateFiscalCalendarAction()
    events = await prisma.fiscalEvent.findMany({
      where: {
        workspaceId: workspace.id,
        dueDate: { gte: new Date(new Date().getFullYear(), 0, 1) },
      },
      orderBy: { dueDate: "asc" },
    })
  }

  const eventsPlain = events.map(e => ({
    ...e,
    amount: e.amount ? Number(e.amount) : null,
  }))

  const upcoming = eventsPlain.filter((e) => !e.isPaid && e.dueDate >= new Date())
  const past = eventsPlain.filter((e) => e.isPaid || e.dueDate < new Date())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendrier fiscal</h1>
        <p className="text-sm text-gray-500">
          Vos échéances {new Date().getFullYear()} — statut :{" "}
          {workspace.legalStatus.replace("_", " ")}
        </p>
      </div>

      {upcoming.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              À venir ({upcoming.length})
            </h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {upcoming.map((event) => {
              const daysLeft = Math.ceil(
                (event.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
              return (
                <li key={event.id} className="flex items-center gap-4 px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_CLASSES[event.type] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {TYPE_LABELS[event.type] ?? event.type}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    {event.description && (
                      <p className="text-xs text-gray-500">{event.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{formatDateShort(event.dueDate)}</p>
                    <p
                      className={`text-xs ${daysLeft <= 15 ? "text-red-500" : "text-gray-400"}`}
                    >
                      {daysLeft === 0
                        ? "Aujourd&apos;hui"
                        : daysLeft === 1
                          ? "Demain"
                          : `Dans ${daysLeft} jours`}
                    </p>
                  </div>
                  {event.amount && (
                    <p className="w-28 text-right text-sm font-medium text-gray-900">
                      {formatAmount(Number(event.amount))}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {past.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-500">Passé ({past.length})</h2>
          </div>
          <ul className="divide-y divide-gray-100 opacity-60">
            {past.slice(0, 5).map((event) => (
              <li key={event.id} className="flex items-center gap-4 px-6 py-4">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_CLASSES[event.type] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {TYPE_LABELS[event.type] ?? event.type}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{event.title}</p>
                </div>
                <p className="text-sm text-gray-500">{formatDateShort(event.dueDate)}</p>
                {event.isPaid && (
                  <span className="text-xs text-green-600">Payé</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
