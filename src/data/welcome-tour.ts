export type TourStep = {
  id: string
  /** Optional scroll target */
  scrollTo?: string
  /** Optional cluster to open */
  openCluster?: string
  text: string
}

/** Spoken orientation — not per-project narration. */
export const WELCOME_TOUR: TourStep[] = [
  {
    id: 'hello',
    scrollTo: 'hero',
    text: "Welcome to Solonaras Store — Christos Solonos's portfolio of AI companions, voice systems, live builds, and custom work.",
  },
  {
    id: 'clusters',
    scrollTo: 'clusters',
    text: 'Everything is grouped into four clusters: Companions, Voice and Stage, Live and Games, and Author and Web. Open a cluster to see the builds and watch a short tour video.',
  },
  {
    id: 'companions',
    openCluster: 'companions',
    scrollTo: 'cluster-companions',
    text: "Here's Companions — full agents, multi-persona casts, character agents, and desktop presence. Tap another cluster anytime from the cards above.",
  },
  {
    id: 'guide',
    text: "I'm your Solonaras guide. Ask me about prices, timelines, what's included, or how to contact Christos. You can type or use the mic.",
  },
  {
    id: 'contact',
    scrollTo: 'outro',
    text: 'When you want to hire him, use the contact form here, or Discord for a live call. Linked builds can also be bought on Shopify with card checkout. Enjoy exploring the store.',
  },
]

export const TOUR_DONE_KEY = 'solonaras-welcome-tour-done-v1'
