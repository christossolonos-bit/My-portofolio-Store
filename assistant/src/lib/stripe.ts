import Stripe from "stripe"
import { getEnv } from "./env"

let stripeClient: Stripe | null = null

export function getStripeSecretKey(): string {
  return (process.env.STRIPE_SECRET_KEY || "").trim()
}

export function isStripeConfigured(): boolean {
  return getStripeSecretKey().startsWith("sk_")
}

export function getStripe(): Stripe {
  const key = getStripeSecretKey()
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key)
  }
  return stripeClient
}

export function checkoutReturnUrls(projectId?: string) {
  const { siteBaseUrl } = getEnv()
  const base = siteBaseUrl.replace(/\/$/, "")
  const projectQs = projectId
    ? `&project=${encodeURIComponent(projectId)}`
    : ""
  return {
    successUrl: `${base}/?checkout=success${projectQs}#outro`,
    cancelUrl: `${base}/?checkout=cancel${projectId ? `#${projectId}` : "#clusters"}`,
  }
}
