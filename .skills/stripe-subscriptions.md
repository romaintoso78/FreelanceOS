# Stripe Subscriptions — FreelanceOS

## Plans

| Plan | Prix | Features |
|------|------|---------|
| STARTER | Gratuit | 3 clients, 5 factures/mois |
| PRO | 29€/mois | Illimité, contrats, relances |
| EXPERT | 79€/mois | Tout PRO + API |

## Checkout Session

```typescript
const session = await stripe.checkout.sessions.create({
  customer: workspace.stripeCustomerId ?? undefined,
  mode: "subscription",
  payment_method_types: ["card"],
  line_items: [{ price: STRIPE_PRICES.PRO_MONTHLY, quantity: 1 }],
  metadata: { workspaceId: workspace.id },
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
})
```

## Webhooks à gérer

- `checkout.session.completed` → activer le plan
- `customer.subscription.updated` → sync statut
- `customer.subscription.deleted` → downgrade vers STARTER

## Feature gating

```typescript
// Vérifier le plan avant une action premium
const workspace = await requireWorkspace()
if (workspace.plan === "STARTER" && clientCount >= 3) {
  throw new Error("Limite atteinte sur le plan Starter. Passez à Pro.")
}
```

## Portal Client

```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: workspace.stripeCustomerId!,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
})
redirect(session.url)
```
