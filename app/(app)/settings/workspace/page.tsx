"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateWorkspaceSchema, type UpdateWorkspaceInput } from "@/lib/validations/workspace"
import { updateWorkspaceAction } from "@/app/actions/workspace"

// This would normally receive workspace data as props from a server component wrapper
export default function WorkspaceSettingsPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
  })

  const onSubmit = async (data: UpdateWorkspaceInput) => {
    setError(null)
    setSuccess(false)
    try {
      await updateWorkspaceAction(data)
      setSuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du workspace</h1>
        <p className="text-sm text-gray-500">
          Ces informations apparaissent sur vos factures et contrats
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom commercial</label>
            <input
              {...register("name")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut juridique</label>
            <select
              {...register("legalStatus")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="AUTO_ENTREPRENEUR">Auto-entrepreneur</option>
              <option value="SASU">SASU</option>
              <option value="EURL">EURL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SIRET</label>
            <input
              {...register("siret")}
              maxLength={14}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.siret && (
              <p className="mt-1 text-xs text-red-600">{errors.siret.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email professionnel
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              {...register("phone")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              {...register("address")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Code postal</label>
            <input
              {...register("postalCode")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              {...register("city")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {success && (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            Paramètres enregistrés
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  )
}
