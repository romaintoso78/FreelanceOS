"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createInvoiceSchema, type CreateInvoiceInput } from "@/lib/validations/invoice"
import { createInvoiceAction } from "@/app/actions/invoice"
import { formatAmount } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"

interface InvoiceFormProps {
  clients: { id: string; name: string }[]
  vatExempt?: boolean
}

export function InvoiceForm({ clients, vatExempt = false }: InvoiceFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      issueDate: new Date(today),
      dueDate: new Date(in30Days),
      vatExempt,
      items: [{ description: "", quantity: 1, unitPrice: 0, vatRate: vatExempt ? 0 : 20, position: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const items = watch("items")

  const subtotalHT = items.reduce((sum, item) => {
    return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
  }, 0)

  const vatTotal = vatExempt
    ? 0
    : items.reduce((sum, item) => {
        const ht = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
        return sum + ht * ((Number(item.vatRate) || 0) / 100)
      }, 0)

  const onSubmit = async (data: CreateInvoiceInput) => {
    setError(null)
    try {
      const invoice = await createInvoiceAction(data)
      router.push(`/invoices/${invoice.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">Informations générales</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Client *</label>
            <select
              {...register("clientId")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Sélectionner un client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="mt-1 text-xs text-red-600">{errors.clientId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date d&apos;émission *
            </label>
            <input
              type="date"
              {...register("issueDate")}
              defaultValue={today}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date d&apos;échéance *
            </label>
            <input
              type="date"
              {...register("dueDate")}
              defaultValue={in30Days}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Lignes de facturation</h2>
          <button
            type="button"
            onClick={() =>
              append({
                description: "",
                quantity: 1,
                unitPrice: 0,
                vatRate: vatExempt ? 0 : 20,
                position: fields.length,
              })
            }
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-4 w-4" />
            Ajouter une ligne
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3">
              <div className="flex-1">
                <input
                  {...register(`items.${index}.description`)}
                  placeholder="Description de la prestation"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  step="0.001"
                  {...register(`items.${index}.quantity`)}
                  placeholder="Qté"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="w-32">
                <input
                  type="number"
                  step="0.01"
                  {...register(`items.${index}.unitPrice`)}
                  placeholder="Prix HT"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              {!vatExempt && (
                <div className="w-20">
                  <select
                    {...register(`items.${index}.vatRate`)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value={0}>0%</option>
                    <option value={5.5}>5,5%</option>
                    <option value={10}>10%</option>
                    <option value={20}>20%</option>
                  </select>
                </div>
              )}
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Sous-total HT</span>
              <span>{formatAmount(subtotalHT)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">TVA</span>
              <span>{formatAmount(vatTotal)}</span>
            </div>
            {vatExempt && (
              <p className="text-xs text-gray-400">TVA non applicable, art. 293B du CGI</p>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
              <span>Total TTC</span>
              <span>{formatAmount(subtotalHT + vatTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <label className="block text-sm font-medium text-gray-700">Notes (optionnel)</label>
        <textarea
          {...register("notes")}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Conditions de paiement, informations complémentaires..."
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex justify-end gap-3">
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
          {isSubmitting ? "Création..." : "Créer la facture"}
        </button>
      </div>
    </form>
  )
}
