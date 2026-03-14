import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Tarifs" }

const plans = [
  {
    name: "Starter",
    price: "Gratuit",
    period: "",
    description: "Pour découvrir FreelanceOS sans engagement.",
    features: ["3 clients", "5 factures / mois", "PDF basique", "Support par email"],
    cta: "Commencer gratuitement",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "29 €",
    period: "/ mois",
    description: "Pour les freelances qui pilotent leur activité au quotidien.",
    features: [
      "Clients illimités",
      "Factures illimitées",
      "Devis et contrats",
      "Relances automatiques",
      "Calendrier fiscal complet",
      "Support prioritaire",
    ],
    cta: "Essayer 14 jours",
    href: "/sign-up?plan=pro",
    highlighted: true,
  },
  {
    name: "Expert",
    price: "79 €",
    period: "/ mois",
    description: "Pour les SASU et EURL avec des besoins avancés.",
    features: [
      "Tout Pro inclus",
      "Multi-statuts juridiques",
      "Accès API",
      "Comptabilité avancée",
      "Support dédié",
    ],
    cta: "Essayer 14 jours",
    href: "/sign-up?plan=expert",
    highlighted: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}>

      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded" style={{ backgroundColor: "var(--gold)" }} />
          <span className="font-display text-xl font-medium tracking-wide" style={{ color: "#F8F7F4" }}>
            FreelanceOS
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/sign-in" className="text-sm transition-colors" style={{ color: "rgba(248,247,244,0.6)" }}>
            Connexion
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="animate-fade-in mx-auto max-w-6xl px-8 pb-20 pt-16 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
          Tarifs
        </p>
        <h1 className="font-display mb-4 text-5xl font-light leading-tight md:text-6xl" style={{ color: "#F8F7F4" }}>
          Simple, transparent,
          <br />
          <span className="italic" style={{ color: "var(--gold)" }}>sans surprise.</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg" style={{ color: "rgba(248,247,244,0.6)" }}>
          14 jours d&apos;essai gratuit sur les plans Pro et Expert. Aucune carte bancaire requise.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-8 pb-28">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className="animate-fade-in relative flex flex-col rounded-2xl p-8 transition-all duration-300"
              style={{
                backgroundColor: plan.highlighted
                  ? "#F8F7F4"
                  : "rgba(248,247,244,0.04)",
                border: plan.highlighted
                  ? "2px solid var(--gold)"
                  : "1px solid rgba(248,247,244,0.09)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-semibold"
                  style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
                >
                  Le plus populaire
                </div>
              )}

              <div className="mb-8">
                <p
                  className="mb-3 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: plan.highlighted ? "var(--gold)" : "rgba(248,247,244,0.45)" }}
                >
                  {plan.name}
                </p>
                <div className="mb-2 flex items-baseline gap-1.5">
                  <span
                    className="font-display text-5xl font-light"
                    style={{ color: plan.highlighted ? "var(--navy)" : "#F8F7F4" }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className="text-sm"
                      style={{ color: plan.highlighted ? "var(--ink-muted)" : "rgba(248,247,244,0.45)" }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: plan.highlighted ? "var(--ink-muted)" : "rgba(248,247,244,0.55)" }}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: plan.highlighted ? "var(--ink)" : "rgba(248,247,244,0.75)" }}
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs"
                      style={{
                        backgroundColor: plan.highlighted
                          ? "rgba(201,168,76,0.15)"
                          : "rgba(201,168,76,0.12)",
                        color: "var(--gold)",
                      }}
                    >
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className="block rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={
                  plan.highlighted
                    ? { backgroundColor: "var(--navy)", color: "#F8F7F4" }
                    : { backgroundColor: "var(--gold)", color: "var(--navy)" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <p className="mt-12 text-center text-sm" style={{ color: "rgba(248,247,244,0.4)" }}>
          Tous les prix sont HT. TVA applicable selon votre statut juridique.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t px-8 py-8" style={{ borderColor: "rgba(248,247,244,0.08)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-display text-sm" style={{ color: "rgba(248,247,244,0.4)" }}>
            © 2026 FreelanceOS
          </span>
          <div className="flex gap-6">
            {["CGU", "Confidentialité"].map(link => (
              <Link key={link} href="#" className="text-xs" style={{ color: "rgba(248,247,244,0.35)" }}>
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
