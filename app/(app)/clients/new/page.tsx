"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientSchema, type CreateClientInput } from "@/lib/validations/client"
import { createClientAction } from "@/app/actions/client"

export default function NewClientPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: { country: "FR" },
  })

  const onSubmit = async (data: CreateClientInput) => {
    setError(null)
    try {
      const client = await createClientAction(data)
      router.push(`/clients/${client.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau client</h1>
        <p className="text-sm text-gray-500">Ajoutez un client à votre base</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Nom / Raison sociale *
            </label>
            <input
              {...register("name")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            )}
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
              N° TVA intracommunautaire
            </label>
            <input
              {...register("vatNumber")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Création..." : "Créer le client"}
          </button>
        </div>
      </form>
    </div>
  )
}
