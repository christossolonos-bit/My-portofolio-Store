/** Checkout catalog — mirrors Solonaras Store starting prices (EUR). */

export type CheckoutProduct = {
  id: string
  name: string
  description: string
  /** Amount in euro cents */
  unitAmount: number
}

export const CHECKOUT_PRODUCTS: CheckoutProduct[] = [
  {
    id: "luna-agent",
    name: "Luna Agent 5.0",
    description: "Full companion stack · scoped build (starting price)",
    unitAmount: 450_000,
  },
  {
    id: "luna-gaida",
    name: "Luna Gaida",
    description: "Voice presence · Discord / live talk-back (starting price)",
    unitAmount: 180_000,
  },
  {
    id: "luna-minecraft",
    name: "Luna Minecraft",
    description: "In-game agent · chat + actions (starting price)",
    unitAmount: 220_000,
  },
  {
    id: "luna-streamer",
    name: "Luna Streamer",
    description: "Broadcast-ready companion (starting price)",
    unitAmount: 280_000,
  },
  {
    id: "luna-vision",
    name: "Luna Vision Co-host",
    description: "Screen-aware co-host · vision + voice (starting price)",
    unitAmount: 320_000,
  },
  {
    id: "dj-agent",
    name: "DJ Agent",
    description: "Music / performance agent (starting price)",
    unitAmount: 200_000,
  },
  {
    id: "fluffy",
    name: "Desktop Companion",
    description: "Desktop shell + companion UI (starting price)",
    unitAmount: 150_000,
  },
  {
    id: "singing-sdk",
    name: "Singing Avatar SDK",
    description: "Avatar singing toolkit (starting price)",
    unitAmount: 160_000,
  },
  {
    id: "lunariko",
    name: "Multi-persona Companions",
    description: "Two+ personas · shared system (starting price)",
    unitAmount: 350_000,
  },
  {
    id: "choko",
    name: "Character Agents",
    description: "Personality pack + agent voice (starting price)",
    unitAmount: 140_000,
  },
  {
    id: "book-editor",
    name: "AuthorHub",
    description: "Manuscript workspace · export pipeline (starting price)",
    unitAmount: 240_000,
  },
  {
    id: "client-work",
    name: "Custom Websites",
    description: "Landing / brand site · custom scope (starting price)",
    unitAmount: 90_000,
  },
]

export function getCheckoutProduct(id: string): CheckoutProduct | undefined {
  return CHECKOUT_PRODUCTS.find((p) => p.id === id)
}
