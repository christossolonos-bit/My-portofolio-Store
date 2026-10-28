/**
 * Local `npm run dev` proxies `/api` → assistant on :3000.
 * On Railway/static host, set VITE_ASSISTANT_URL to the public assistant service.
 */
export function apiUrl(path: string): string {
  const base = (import.meta.env.VITE_ASSISTANT_URL as string | undefined)?.replace(
    /\/$/,
    '',
  )
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}
