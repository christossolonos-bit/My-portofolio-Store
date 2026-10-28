/** Public site config — set via Vite env where noted. */

export const DISCORD_INVITE =
  (import.meta.env.VITE_DISCORD_INVITE as string | undefined) ||
  'https://discord.gg/reZX2sqQk'

/** Optional webhook after FormSubmit (e.g. Zapier / Discord webhook proxy). */
export const CONTACT_WEBHOOK_URL =
  (import.meta.env.VITE_CONTACT_WEBHOOK_URL as string | undefined)?.trim() || ''

export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')
