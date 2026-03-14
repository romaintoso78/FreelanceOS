import type { Metadata } from "next"
import Link from "next/link"
import { requireWorkspace } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatAmount } from "@/lib/utils"

export const metadata: Metadata = { title: "Missions" }

const STATUS_LABELS: Record<string, string> = {
  PROSPECT: "Prospect",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  LOST: "Perdue",
}

const STATUS_CLASSES: Record<string, string> = {
  PROSPECT: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  LOST: "bg-gray-100 text-gray-500",
}

export default async function MissionsPage() {
  const workspace = await requireWorkspace()

  const missions = (await prisma.mission.findMany({
    where: { workspaceId: workspace.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
  })).map(m => ({
    ...m,
    dailyRate: m.dailyRate ? Number(m.dailyRate) : null,
  }))

  const byStatus = {
    PROSPECT: missions.filter((m) => m.status === "PROSPECT"),
    IN_PROGRESS: missions.filter((m) => m.status === "IN_PROGRESS"),
    COMPLETED: missions.filter((m) => m.status === "COMPLETED"),
    LOST: missions.filter((m) => m.status === "LOST"),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
        <p className="text-sm text-gray-500">{missions.length} mission(s)</p>
      </div>

      {missions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">Aucune mission pour le moment</p>
          <p className="mt-1 text-xs text-gray-400">
            Les missions sont créées depuis les fiches clients
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(["PROSPECT", "IN_PROGRESS", "COMPLETED", "LOST"] as const).map((status) => (
            <div key={status}>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}
                >
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs text-gray-400">{byStatus[status].length}</span>
              </div>
              <div className="space-y-2">
                {byStatus[status].map((mission) => (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="block rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm"
                  >
                    <p className="text-sm font-medium text-gray-900">{mission.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{mission.client.name}</p>
                    {mission.dailyRate && (
                      <p className="mt-1 text-xs text-gray-400">
                        TJM : {formatAmount(Number(mission.dailyRate))}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
