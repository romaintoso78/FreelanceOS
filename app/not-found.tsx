import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-2 text-lg text-gray-600">Page introuvable</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
