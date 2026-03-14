import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FreelanceOS — Gestion freelance simplifiée",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--navy)", color: "#F8F7F4" }}>

      {/* Nav */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded" style={{ backgroundColor: "var(--gold)" }} />
          <span className="font-display text-xl font-medium tracking-wide" style={{ color: "#F8F7F4" }}>
            FreelanceOS
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/pricing" className="text-sm transition-colors hover:text-[#F8F7F4]" style={{ color: "rgba(248,247,244,0.6)" }}>
            Tarifs
          </Link>
          <Link href="/sign-in" className="text-sm transition-colors" style={{ color: "rgba(248,247,244,0.6)" }}>
            Connexion
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-8 pb-24 pt-20 md:pt-32">
        <div className="animate-fade-in max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{ borderColor: "rgba(201,168,76,0.3)", color: "var(--gold)" }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
            Pour les freelances français — AE, SASU, EURL
          </div>
          <h1 className="font-display mb-6 text-5xl font-light leading-[1.1] tracking-tight md:text-7xl"
            style={{ color: "#F8F7F4" }}>
            La gestion freelance
            <br />
            <span className="italic" style={{ color: "var(--gold)" }}>sans la paperasse.</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed" style={{ color: "rgba(248,247,244,0.65)" }}>
            Factures légales en un clic, suivi fiscal automatique, contrats électroniques
            et CRM clients — tout ce qu'il faut pour piloter votre activité.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
            >
              Démarrer gratuitement
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border px-8 py-4 text-sm font-medium transition-all hover:bg-white/5"
              style={{ borderColor: "rgba(248,247,244,0.2)", color: "#F8F7F4" }}
            >
              Voir les tarifs →
            </Link>
          </div>
        </div>

        {/* Dashboard preview placeholder */}
        <div className="animate-fade-in-2 mt-20 overflow-hidden rounded-2xl border"
          style={{ borderColor: "rgba(248,247,244,0.08)", backgroundColor: "rgba(248,247,244,0.03)" }}>
          <div className="flex items-center gap-2 border-b px-5 py-4"
            style={{ borderColor: "rgba(248,247,244,0.06)" }}>
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#28C840" }} />
            <span className="ml-4 text-xs" style={{ color: "rgba(248,247,244,0.3)" }}>
              FreelanceOS — Tableau de bord
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4 p-6">
            {[
              { label: "CA ce mois", value: "8 400 €", change: "+12%" },
              { label: "CA annuel", value: "67 200 €", change: "+8%" },
              { label: "Cotisations estimées", value: "14 784 €", change: "22% CA" },
              { label: "Factures en retard", value: "2", change: "3 720 €" },
            ].map((card, i) => (
              <div key={card.label} className="rounded-xl p-4 animate-fade-in"
                style={{
                  backgroundColor: "rgba(248,247,244,0.04)",
                  border: "1px solid rgba(248,247,244,0.06)",
                  animationDelay: `${0.3 + i * 0.1}s`
                }}>
                <p className="text-xs mb-2" style={{ color: "rgba(248,247,244,0.45)" }}>{card.label}</p>
                <p className="text-2xl font-semibold mb-1 font-display" style={{ color: "#F8F7F4" }}>{card.value}</p>
                <p className="text-xs" style={{ color: "var(--gold)" }}>{card.change}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 px-6 pb-6">
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(248,247,244,0.04)", border: "1px solid rgba(248,247,244,0.06)" }}>
              <p className="text-xs mb-3" style={{ color: "rgba(248,247,244,0.45)" }}>Factures récentes</p>
              {[
                { num: "2024-012", client: "Studio Kaolin", amount: "2 400 €", status: "Payée", color: "#22C55E" },
                { num: "2024-013", client: "Agence Lumière", amount: "4 800 €", status: "Envoyée", color: "#60A5FA" },
                { num: "2024-014", client: "Le Cabinet RH", amount: "1 200 €", status: "En retard", color: "#F87171" },
              ].map(inv => (
                <div key={inv.num} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(248,247,244,0.05)" }}>
                  <div>
                    <p className="text-xs font-medium" style={{ color: "#F8F7F4" }}>{inv.num}</p>
                    <p className="text-xs" style={{ color: "rgba(248,247,244,0.4)" }}>{inv.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: "#F8F7F4" }}>{inv.amount}</p>
                    <p className="text-xs" style={{ color: inv.color }}>{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(248,247,244,0.04)", border: "1px solid rgba(248,247,244,0.06)" }}>
              <p className="text-xs mb-3" style={{ color: "rgba(248,247,244,0.45)" }}>Prochaines échéances fiscales</p>
              {[
                { label: "Déclaration URSSAF", date: "31 mars", days: "17 jours" },
                { label: "TVA trimestrielle", date: "20 avril", days: "37 jours" },
                { label: "CFE annuelle", date: "15 déc.", days: "276 jours" },
              ].map(ev => (
                <div key={ev.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(248,247,244,0.05)" }}>
                  <p className="text-xs" style={{ color: "rgba(248,247,244,0.7)" }}>{ev.label}</p>
                  <div className="text-right">
                    <p className="text-xs font-medium" style={{ color: "#F8F7F4" }}>{ev.date}</p>
                    <p className="text-xs" style={{ color: "var(--gold)" }}>{ev.days}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t" style={{ borderColor: "rgba(248,247,244,0.08)", backgroundColor: "rgba(0,0,0,0.2)" }}>
        <div className="mx-auto max-w-6xl px-8 py-24">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--gold)" }}>
            Fonctionnalités
          </p>
          <h2 className="font-display mb-16 text-4xl font-light md:text-5xl" style={{ color: "#F8F7F4" }}>
            Tout ce dont vous avez besoin,
            <br />
            <span className="italic">rien de superflu.</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: "◈",
                title: "Facturation légale",
                desc: "Factures conformes à l'article L441-9 du Code de commerce. Numérotation séquentielle, mentions TVA automatiques, PDF professionnel.",
              },
              {
                icon: "◉",
                title: "Suivi fiscal intelligent",
                desc: "Calendrier des échéances URSSAF, TVA et IS adapté à votre statut. Alertes J-15 avant chaque deadline.",
              },
              {
                icon: "◎",
                title: "Contrats électroniques",
                desc: "Créez, envoyez et faites signer vos contrats en ligne. Signature sécurisée avec preuve IP et horodatage.",
              },
              {
                icon: "◇",
                title: "CRM clients",
                desc: "Suivez vos clients, missions et pipeline. Historique complet des factures et contrats par client.",
              },
              {
                icon: "◆",
                title: "Devis convertibles",
                desc: "Créez des devis professionnels, envoyez-les, et convertissez-les en factures en un clic.",
              },
              {
                icon: "○",
                title: "Dashboard financier",
                desc: "CA mensuel, YTD, estimation des cotisations URSSAF, alertes seuil TVA pour les auto-entrepreneurs.",
              },
            ].map((f, i) => (
              <div key={f.title}
                className="rounded-xl p-6 transition-all duration-200 hover:bg-white/5 animate-fade-in"
                style={{
                  border: "1px solid rgba(248,247,244,0.07)",
                  animationDelay: `${i * 0.08}s`
                }}>
                <span className="mb-4 block text-2xl" style={{ color: "var(--gold)" }}>{f.icon}</span>
                <h3 className="font-display mb-2 text-lg font-medium" style={{ color: "#F8F7F4" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(248,247,244,0.55)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-8 py-24 text-center">
        <h2 className="font-display mb-4 text-4xl font-light italic md:text-5xl" style={{ color: "#F8F7F4" }}>
          Prêt à simplifier votre gestion ?
        </h2>
        <p className="mb-8 text-lg" style={{ color: "rgba(248,247,244,0.55)" }}>
          Rejoignez les freelances qui pilotent leur activité sans stress.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center rounded-xl px-10 py-4 text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: "var(--gold)", color: "var(--navy)" }}
        >
          Commencer gratuitement — 14 jours d&apos;essai
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-8 py-8" style={{ borderColor: "rgba(248,247,244,0.08)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="font-display text-sm" style={{ color: "rgba(248,247,244,0.4)" }}>
            © 2026 FreelanceOS
          </span>
          <div className="flex gap-6">
            {["Tarifs", "CGU", "Confidentialité"].map(link => (
              <Link key={link} href="#"
                className="text-xs transition-colors"
                style={{ color: "rgba(248,247,244,0.35)" }}>
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
