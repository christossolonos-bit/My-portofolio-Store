import { useCallback, useEffect, useRef, useState } from 'react'

type Options = {
  enabled: boolean
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const preferred = voices.find(
    (v) =>
      /en(-|_)?(US|GB|AU)?/i.test(v.lang) &&
      /female|samantha|google uk english female|microsoft aria|zira|jenny/i.test(
        v.name,
      ),
  )
  const english = voices.find((v) => v.lang.toLowerCase().startsWith('en'))
  return preferred ?? english ?? voices[0]
}

export function useVoiceGuide({ enabled }: Options) {
  const [speaking, setSpeaking] = useState(false)
  const [ready, setReady] = useState(false)
  const lastSpokenId = useRef<string | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    const load = () => {
      voiceRef.current = pickVoice()
      setReady(true)
    }

    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [])

  const stop = useCallback(() => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [])

  const speak = useCallback(
    (id: string, text: string, force = false) => {
      if (!enabled || !('speechSynthesis' in window)) return
      if (!force && lastSpokenId.current === id) return

      window.speechSynthesis.cancel()
      lastSpokenId.current = id

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.96
      utterance.pitch = 1.05
      utterance.volume = 1
      if (voiceRef.current) utterance.voice = voiceRef.current

      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [enabled],
  )

  useEffect(() => {
    if (!enabled) stop()
  }, [enabled, stop])

  return { speak, stop, speaking, ready, lastSpokenId }
}
