export type TourStep = {
  id: string
  /** Optional scroll target */
  scrollTo?: string
  /** Optional group to open */
  openCluster?: string
  text: string
}

/** Spoken orientation: short, show-first. */
export const WELCOME_TOUR: TourStep[] = [
  {
    id: 'hello',
    scrollTo: 'hero',
    text: "Welcome to Solonaras Portfolio, Christos Solonos's showcase. AI builds you can watch.",
  },
  {
    id: 'companions',
    openCluster: 'companions',
    scrollTo: 'cluster-companions',
    text: "Here's Companions. Tap a build to play its tour video. Other groups are above.",
  },
  {
    id: 'contact',
    scrollTo: 'outro',
    text: 'Hiring or collaborating? Send a note here, or Discord for a fast ping.',
  },
]

export const TOUR_DONE_KEY = 'solonaras-welcome-tour-done-v3'
