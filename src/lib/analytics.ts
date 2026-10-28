type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>

const KEY = 'solonaras-analytics-v1'

function readQueue(): Array<{ t: number; name: string; data?: AnalyticsPayload }> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as Array<{
      t: number
      name: string
      data?: AnalyticsPayload
    }>
  } catch {
    return []
  }
}

/** Lightweight local analytics — cluster opens, chips, compare, etc. */
export function track(name: string, data?: AnalyticsPayload) {
  try {
    const row = { t: Date.now(), name, data }
    const queue = readQueue().slice(-199)
    queue.push(row)
    localStorage.setItem(KEY, JSON.stringify(queue))
    if (import.meta.env.DEV) {
      console.debug('[analytics]', name, data ?? {})
    }
    const endpoint = import.meta.env.VITE_ANALYTICS_URL as string | undefined
    if (endpoint) {
      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row),
        keepalive: true,
      }).catch(() => undefined)
    }
  } catch {
    /* ignore */
  }
}

export function getAnalyticsSnapshot() {
  return readQueue()
}
