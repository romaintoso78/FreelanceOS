# FreelanceOS — Mémoire permanente Claude

## Contexte projet
Application SaaS de gestion pour freelances français : facturation légale, CRM, contrats, suivi fiscal.
Stack : Next.js 15 App Router, TypeScript strict, Prisma + PostgreSQL (Supabase), Clerk auth, Stripe, Resend, @react-pdf/renderer.

## Conventions de code

### Architecture
- **Server Components par défaut**, Client Components uniquement si interactivité nécessaire
- `"use client"` uniquement si : hooks React, event handlers, browser APIs
- Server Actions dans `app/actions/` pour toutes les mutations
- API Routes dans `app/api/` pour : webhooks, PDF streaming, endpoints externes
- Jamais de fetch direct depuis les composants — utiliser les helpers `lib/api/`

### Sécurité multi-tenant (CRITIQUE)
- **Toujours** récupérer `workspaceId` depuis `getWorkspaceFromAuth()` — jamais depuis le client
- **Toujours** filtrer par `workspaceId` dans chaque query Prisma
- Pattern obligatoire dans chaque Server Action :
```typescript
const workspace = await getWorkspaceFromAuth()
if (!workspace) throw new Error("Unauthorized")
// Toutes les queries avec workspaceId: workspace.id
```

### Prisma
- Singleton `lib/prisma.ts` — ne jamais créer de nouveau PrismaClient
- Transactions pour les opérations qui modifient plusieurs tables
- Numérotation factures : transaction avec `SELECT FOR UPDATE` anti-race-condition
- Soft delete avec `deletedAt` — ne jamais supprimer physiquement clients/factures

### TypeScript
- `strict: true` — pas de `any`, pas de `as unknown`
- Types dérivés de Prisma dans `types/` — ne pas redéfinir ce qui existe
- Zod pour toute validation : formulaires (react-hook-form) + Server Actions + API routes

### UI/UX
- shadcn/ui uniquement — pas de composants UI tiers supplémentaires
- Format monétaire FR : `Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })`
- Dates : `date-fns` avec locale `fr`
- Toujours afficher des empty states avec CTA sur les pages vides
- Loading skeletons sur toutes les listes/cartes de données

### Emails
- react-email + Resend uniquement
- Templates dans `lib/email/templates/`
- Toujours envoyer depuis `noreply@freelanceos.fr`

### PDF
- @react-pdf/renderer uniquement (serverless-compatible)
- Templates dans `lib/pdf/`
- Streaming via API Route `/api/invoices/[id]/pdf`

## Règles métier critiques

### Facturation légale française (Article L441-9 Code de commerce)
Mentions obligatoires sur chaque facture :
- Date d'émission
- Numéro de facture (séquentiel, sans trou, format YYYY-NNN)
- Nom et adresse du prestataire + SIRET
- Nom et adresse du client
- Description précise des prestations
- Prix HT par ligne
- Taux TVA applicable (ou mention exonération AE art. 293B CGI)
- Total HT, montant TVA, Total TTC
- Date d'échéance
- Pénalités de retard (3x taux légal minimum)
- Indemnité forfaitaire recouvrement (40€)

### Auto-entrepreneur (AE)
- Exonération TVA sous 37 500€ CA (services) → mention "TVA non applicable, art. 293B du CGI"
- Alerte dashboard à 80% du seuil (30 000€) et 95% (35 625€)
- Cotisations URSSAF : 22% du CA brut
- Déclaration mensuelle ou trimestrielle

### SASU/EURL
- TVA au réel (taux 20% standard services)
- IS : 15% jusqu'à 42 500€ de bénéfice, 25% au-delà
- CFE annuelle (montant variable par commune)

### Numérotation sans trou
- Factures : `YYYY-NNN` (ex: 2024-001, 2024-002)
- Devis : `DEV-YYYY-NNN`
- Transaction Prisma avec SELECT FOR UPDATE obligatoire

### Contrats — Sécurité signature
- Token = cuid() (jamais prévisible)
- Usage unique (invalidé après signature)
- Expiration 30 jours par défaut
- Logger IP + User-Agent obligatoire

## Checklist avant chaque PR

- [ ] `workspaceId` récupéré depuis `getWorkspaceFromAuth()` dans chaque Server Action
- [ ] Chaque query Prisma filtre par `workspaceId`
- [ ] Validation Zod sur tous les inputs (formulaires ET Server Actions)
- [ ] Pas de `console.log` en production (utiliser Sentry pour les erreurs)
- [ ] Types stricts — aucun `any`
- [ ] Mentions légales complètes dans les templates PDF
- [ ] Tests unitaires pour les calculs (URSSAF, numérotation, calendrier fiscal)

## Variables d'environnement requises

```env
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# DB
DATABASE_URL=              # Supabase connection pooling (PgBouncer)
DIRECT_URL=               # Supabase direct connection (pour migrations)

# Storage
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=
FROM_EMAIL=noreply@freelanceos.fr

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# App
NEXT_PUBLIC_APP_URL=https://freelanceos.fr
```

## Commandes utiles

```bash
npm run dev          # Dev server
npm run build        # Build production
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run test         # Vitest
npm run test:watch   # Vitest watch mode

# Prisma
npx prisma generate   # Regénérer le client
npx prisma migrate dev --name "nom-migration"
npx prisma studio     # UI base de données
npx prisma db push    # Push schéma sans migration (dev rapide)
```
