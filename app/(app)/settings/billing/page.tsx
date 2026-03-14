import type { Metadata } from "next"
import { requireWorkspace } from "@/lib/auth"

export const metadata: Metadata = { title: "Abonnement" }

const PLAN_LABELS: Record<string, string> = {
  STARTER: "Starter",
  PRO: "Pro",
  EXPERT: "Expert",
}

export default async function BillingPage() {
  const workspace = await requireWorkspace()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Abonnement</h1>
        <p className="text-sm text-gray-500">Gérez votre plan FreelanceOS</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Plan actuel</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {PLAN_LABELS[workspace.plan]}
            </p>
          </div>
          {workspace.plan === "STARTER" && (
            <a
              href="/pricing"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Passer à Pro
            </a>
          )}
        </div>

        {workspace.planExpiresAt && (
          <p className="mt-4 text-sm text-gray-500">
            Renouvellement le{" "}
            {workspace.planExpiresAt.toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      {workspace.plan !== "STARTER" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Gérer l&apos;abonnement</h2>
          <p className="text-sm text-gray-500">
            Accédez au portail Stripe pour modifier ou annuler votre abonnement.
          </p>
          <button className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Gérer via Stripe
          </button>
        </div>
      )}
    </div>
  )
}
