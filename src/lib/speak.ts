import { apiUrl } from './api'

/** Speak via assistant Fish/Edge TTS. Browser speechSynthesis only if the API is unreachable. */
export async function speakText(
  text: string,
  opts: {
    muted?: boolean
    language?: 'en' | 'el'
    audioRef?: { current: HTMLAudioElement | null }
    signal?: AbortSignal
  } = {},
): Promise<void> {
  if (opts.muted || !text.trim()) return
  if (opts.signal?.aborted) return

  const language = opts.language ?? 'en'

  const played = await playAssistantTts(text, language, opts)
  if (played || opts.signal?.aborted) return

  // Last resort only when the guide API is down — not the preferred voice.
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 0.96
  utter.lang = language === 'el' ? 'el-GR' : 'en-US'
  const prefix = language === 'el' ? 'el' : 'en'
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang.toLowerCase().startsWith(prefix))
  if (voice) utter.voice = voice
  await new Promise<void>((resolve) => {
    utter.onend = () => resolve()
    utter.onerror = () => resolve()
    opts.signal?.addEventListener('abort', () => {
      window.speechSynthesis.cancel()
      resolve()
    })
    window.speechSynthesis.speak(utter)
  })
}

async function playAssistantTts(
  text: string,
  language: 'en' | 'el',
  opts: {
    audioRef?: { current: HTMLAudioElement | null }
    signal?: AbortSignal
  },
): Promise<boolean> {
  try {
    const res = await fetch(apiUrl('/api/tts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
      signal: opts.signal,
    })
    if (!res.ok) return false

    const type = (res.headers.get('content-type') || '').toLowerCase()
    // SPA/static hosts often return index.html with 200 — never treat that as TTS.
    if (!type.includes('audio')) return false

    const blob = await res.blob()
    if (!blob.size) return false

    const url = URL.createObjectURL(blob)
    opts.audioRef?.current?.pause()
    const audio = new Audio(url)
    if (opts.audioRef) opts.audioRef.current = audio

    try {
      await audio.play()
    } catch {
      URL.revokeObjectURL(url)
      return false
    }

    await new Promise<void>((resolve) => {
      const done = () => {
        URL.revokeObjectURL(url)
        resolve()
      }
      audio.onended = done
      audio.onerror = done
      opts.signal?.addEventListener('abort', () => {
        audio.pause()
        done()
      })
    })
    return true
  } catch {
    return false
  }
}
