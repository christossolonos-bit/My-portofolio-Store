import { json, optionsOk } from "@/lib/http"
import { getStripe, isStripeConfigured } from "@/lib/stripe"
import type Stripe from "stripe"

export async function OPTIONS() {
  return optionsOk()
}

/**
 * Stripe webhook (optional). Set STRIPE_WEBHOOK_SECRET and point
 * Dashboard → Developers → Webhooks to /api/checkout/webhook
 * Event: checkout.session.completed
 */
export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return json({ error: "Stripe not configured" }, 503)
  }

  const secret = (process.env.STRIPE_WEBHOOK_SECRET || "").trim()
  const stripe = getStripe()
  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    if (secret) {
      const sig = req.headers.get("stripe-signature")
      if (!sig) return json({ error: "Missing stripe-signature" }, 400)
      event = stripe.webhooks.constructEvent(rawBody, sig, secret)
    } else {
      // Dev fallback without signature (do not use in production)
      event = JSON.parse(rawBody) as Stripe.Event
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid webhook"
    return json({ error: message }, 400)
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    console.info("[stripe] checkout.session.completed", {
      sessionId: session.id,
      projectId: session.metadata?.projectId,
      email: session.customer_details?.email || session.customer_email,
      amountTotal: session.amount_total,
      currency: session.currency,
    })
  }

  return json({ received: true })
}
