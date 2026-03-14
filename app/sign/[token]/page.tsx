"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { signContractAction } from "@/app/actions/contract"

export default function SignContractPage() {
  const params = useParams()
  const token = params.token as string
  const [signerName, setSignerName] = useState("")
  const [signed, setSigned] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSign = async () => {
    if (!signerName.trim()) {
      setError("Veuillez saisir votre nom complet")
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      await signContractAction(token, signerName)
      setSigned(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (signed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Contrat signé</h1>
          <p className="mt-2 text-sm text-gray-600">
            Votre signature a été enregistrée. Vous recevrez une copie par email.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Signature de contrat</h1>
          <p className="mt-2 text-sm text-gray-500">
            Veuillez lire attentivement le contrat avant de signer.
          </p>

          <div className="mt-6 rounded-lg bg-gray-50 p-6">
            <p className="text-sm text-gray-500">Chargement du contrat...</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Votre nom complet *
              </label>
              <input
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                placeholder="Jean Dupont"
              />
            </div>

            <p className="text-xs text-gray-500">
              En signant, vous acceptez les termes du contrat. Votre adresse IP sera
              enregistrée comme preuve de signature.
            </p>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <button
              onClick={handleSign}
              disabled={isSubmitting || !signerName.trim()}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Signature en cours..." : "Signer le contrat"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
