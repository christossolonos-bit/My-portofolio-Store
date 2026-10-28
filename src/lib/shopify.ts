/**
 * Shopify links (Option 1) — portfolio stays here; Shopify for product pages / later checkout.
 *
 * Product page: https://{shop}/products/{handle}
 * Cart (optional): https://{shop}/cart/{variantId}:1
 */

import { projects } from '../data/projects'

export const SHOPIFY_STORE =
  (import.meta.env.VITE_SHOPIFY_STORE as string | undefined)
    ?.trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '') || 'christossolonos.myshopify.com'

export const SHOPIFY_STORE_URL = `https://${SHOPIFY_STORE}`

function parseJsonMap(raw: string | undefined): Record<string, string> {
  if (!raw?.trim()) return {}
  try {
    const parsed = JSON.parse(raw) as Record<string, string>
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, String(v).trim()]),
    )
  } catch {
    console.warn('[shopify] invalid JSON map in env')
    return {}
  }
}

const ENV_HANDLES = parseJsonMap(
  import.meta.env.VITE_SHOPIFY_HANDLES as string | undefined,
)
const ENV_VARIANTS = parseJsonMap(
  import.meta.env.VITE_SHOPIFY_VARIANTS as string | undefined,
)

/**
 * Product handles for /products/{handle}.
 * Defaults match shopify/products-import.csv (handle = project id).
 * Override with VITE_SHOPIFY_HANDLES JSON if your Shopify handles differ.
 */
export const SHOPIFY_HANDLES: Record<string, string> = {
  'luna-agent': 'luna-agent',
  'luna-gaida': 'luna-gaida',
  'luna-minecraft': 'luna-minecraft',
  'luna-streamer': 'luna-streamer',
  'luna-vision': 'luna-vision',
  'dj-agent': 'dj-agent',
  fluffy: 'fluffy',
  'singing-sdk': 'singing-sdk',
  lunariko: 'lunariko',
  choko: 'choko',
  'book-editor': 'book-editor',
  'client-work': 'client-work',
  ...ENV_HANDLES,
}

export const SHOPIFY_VARIANT_IDS: Record<string, string> = {
  'luna-agent': '',
  'luna-gaida': '',
  'luna-minecraft': '',
  'luna-streamer': '',
  'luna-vision': '',
  'dj-agent': '',
  fluffy: '',
  'singing-sdk': '',
  lunariko: '',
  choko: '',
  'book-editor': '',
  'client-work': '',
  ...ENV_VARIANTS,
}

export function isShopifyConfigured(): boolean {
  return Boolean(SHOPIFY_STORE)
}

export function getShopifyHandle(projectId: string): string | null {
  const handle = (SHOPIFY_HANDLES[projectId] || '').trim()
  return handle || null
}

export function getShopifyVariantId(projectId: string): string | null {
  const id = (SHOPIFY_VARIANT_IDS[projectId] || '').trim()
  return id || null
}

/** Product page, or store home if this build has no handle yet. */
export function shopifyProductUrl(projectId: string): string {
  const handle = getShopifyHandle(projectId)
  if (handle) return `${SHOPIFY_STORE_URL}/products/${handle}`
  return SHOPIFY_STORE_URL
}

export function canBuyOnShopify(projectId: string): boolean {
  return isShopifyConfigured() && Boolean(getShopifyVariantId(projectId))
}

export function shopifyCheckoutUrl(projectId: string): string | null {
  const variantId = getShopifyVariantId(projectId)
  if (!SHOPIFY_STORE || !variantId) return null
  return `https://${SHOPIFY_STORE}/cart/${variantId}:1`
}

export function shopifyProductsReadyCount(): number {
  return projects.filter((p) => canBuyOnShopify(p.id)).length
}
