import { getEnv } from "@/lib/env"
import { json, optionsOk } from "@/lib/http"
import { getCheckoutProduct } from "@/lib/stripe-catalog"
import { checkoutReturnUrls, getStripe, isStripeConfigured } from "@/lib/stripe"

export async function OPTIONS() {
  return optionsOk()
}

/** Create a Stripe Checkout Session for a Solonaras Store build. */
export async function POST(req: Request) {
  try {
    if (!isStripeConfigured()) {
      return json(
        {
          error:
            "Stripe is not connected yet. Add STRIPE_SECRET_KEY to the assistant .env (sk_test_… or sk_live_…).",
          configured: false,
        },
        503,
      )
    }

    const body = (await req.json()) as {
      projectId?: string
      customerEmail?: string
    }
    const projectId = (body.projectId || "").trim()
    if (!projectId) {
      return json({ error: "projectId is required" }, 400)
    }

    const product = getCheckoutProduct(projectId)
    if (!product) {
      return json({ error: `Unknown project: ${projectId}` }, 404)
    }

    const { successUrl, cancelUrl } = checkoutReturnUrls(projectId)
    const stripe = getStripe()
    const { siteBaseUrl } = getEnv()

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: body.customerEmail?.trim() || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: product.unitAmount,
            product_data: {
              name: product.name,
              description: product.description,
              metadata: {
                projectId: product.id,
                store: "solonaras",
              },
            },
          },
        },
      ],
      metadata: {
        projectId: product.id,
        projectName: product.name,
        store: "solonaras",
        siteBaseUrl,
      },
      payment_intent_data: {
        metadata: {
          projectId: product.id,
          projectName: product.name,
        },
      },
      allow_promotion_codes: true,
    })

    if (!session.url) {
      return json({ error: "Stripe did not return a checkout URL" }, 502)
    }

    return json({
      url: session.url,
      sessionId: session.id,
      projectId: product.id,
      amountEur: product.unitAmount / 100,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed"
    return json({ error: message }, 500)
  }
}

export async function GET() {
  return json({
    configured: isStripeConfigured(),
    currency: "eur",
    mode: "payment",
  })
}
