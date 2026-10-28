import { apiUrl } from './api'

/** Speak via assistant TTS, with browser speechSynthesis fallback. */
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

  try {
    const res = await fetch(apiUrl('/api/tts'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
      signal: opts.signal,
    })
    if (res.ok) {
      const blob = await res.blob()
      if (blob.size) {
        const url = URL.createObjectURL(blob)
        opts.audioRef?.current?.pause()
        const audio = new Audio(url)
        if (opts.audioRef) opts.audioRef.current = audio
        await audio.play().catch(() => undefined)
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
        return
      }
    }
  } catch {
    /* fall through */
  }

  if (opts.signal?.aborted) return
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
