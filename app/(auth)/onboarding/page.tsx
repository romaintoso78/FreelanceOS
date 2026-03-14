"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/workspace"
import { completeOnboardingAction } from "@/app/actions/workspace"

export default function OnboardingPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { legalStatus: "AUTO_ENTREPRENEUR" },
  })

  const onSubmit = async (data: OnboardingInput) => {
    setError(null)
    try {
      await completeOnboardingAction(data)
      router.push("/dashboard")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
    }
  }

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Configurez votre profil</h1>
      <p className="mt-2 text-sm text-gray-600">
        Ces informations apparaîtront sur vos factures et contrats.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom commercial *
          </label>
          <input
            {...register("name")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Mon Activité Freelance"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Statut juridique *
          </label>
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
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="12345678901234"
            maxLength={14}
          />
          {errors.siret && (
            <p className="mt-1 text-xs text-red-600">{errors.siret.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Adresse</label>
          <input
            {...register("address")}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code postal
            </label>
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email professionnel
          </label>
          <input
            {...register("email")}
            type="email"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Enregistrement..." : "Commencer"}
        </button>
      </form>
    </div>
  )
}
