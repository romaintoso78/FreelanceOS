import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response("Invalid signature", { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        )
        const workspaceId = session.metadata?.workspaceId
        if (!workspaceId) break

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          create: {
            workspaceId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id ?? "",
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
          update: {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        })

        // Determine plan from price
        const priceId = subscription.items.data[0]?.price.id
        const plan = priceId === process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID ||
          priceId === process.env.STRIPE_EXPERT_YEARLY_PRICE_ID
          ? "EXPERT"
          : "PRO"

        await prisma.workspace.update({
          where: { id: workspaceId },
          data: {
            plan,
            stripeCustomerId: session.customer as string,
            planExpiresAt: new Date(subscription.current_period_end * 1000),
          },
        })
      }
      break
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const dbSub = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      })
      if (!dbSub) break

      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      })

      if (event.type === "customer.subscription.deleted") {
        await prisma.workspace.update({
          where: { id: dbSub.workspaceId },
          data: { plan: "STARTER", planExpiresAt: null },
        })
      }
      break
    }
  }

  return new Response("OK", { status: 200 })
}
