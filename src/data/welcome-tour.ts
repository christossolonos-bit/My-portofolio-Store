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
    text: "Welcome to Solonaras — Christos Solonos's portfolio of AI companions, voice systems, live builds, and custom work.",
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
    text: "I'm your Solonaras guide. Ask about any build, what's included, timelines, or how to contact Christos for recruiting or collaboration. You can type or use the mic.",
  },
  {
    id: 'contact',
    scrollTo: 'outro',
    text: 'If you want to recruit or work with Christos, use the contact form here or Discord for a live chat. Enjoy exploring the portfolio.',
  },
]

export const TOUR_DONE_KEY = 'solonaras-welcome-tour-done-v1'
