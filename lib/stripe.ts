import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
})

export const STRIPE_PRICES = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  EXPERT_MONTHLY: process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID!,
  EXPERT_YEARLY: process.env.STRIPE_EXPERT_YEARLY_PRICE_ID!,
}
