import { useEffect, useRef, useState } from 'react'
import { PERSONAS, type Persona } from '../data/personas'
import { track } from '../lib/analytics'
import { noteMediaGestureFromEvent } from '../lib/media-audio'
import { speakText } from '../lib/speak'
import { MUTE_KEY } from './SolonarasGuide'

type PersonaStripProps = {
  onMeet: (persona: Persona) => void
}

export function PersonaStrip({ onMeet }: PersonaStripProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      audioRef.current?.pause()
    }
  }, [])

  const meet = async (persona: Persona) => {
    noteMediaGestureFromEvent()
    track('persona_tap', { personaId: persona.id })
    setActiveId(persona.id)
    onMeet(persona)

    abortRef.current?.abort()
    audioRef.current?.pause()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()

    let muted = false
    try {
      muted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      /* ignore */
    }

    const ac = new AbortController()
    abortRef.current = ac
    setSpeaking(true)
    await speakText(persona.line, {
      muted,
      language: 'en',
      audioRef,
      signal: ac.signal,
    })
    if (!ac.signal.aborted) setSpeaking(false)
  }

  const active = PERSONAS.find((p) => p.id === activeId) ?? null

  return (
    <section className="persona-strip" id="personas" aria-label="Meet the cast">
      <div className="persona-strip-head">
        <p className="eyebrow">Meet the cast</p>
        <h2 className="persona-strip-title">Tap a persona</h2>
        <p className="persona-strip-lead">Hear a line. Jump into the build.</p>
      </div>

      <div className="persona-strip-row" role="list">
        {PERSONAS.map((persona) => {
          const selected = persona.id === activeId
          return (
            <button
              key={persona.id}
              type="button"
              role="listitem"
              className={`persona-chip ${selected ? 'is-active' : ''}`}
              style={{ ['--persona-accent' as string]: persona.accent }}
              aria-pressed={selected}
              onClick={() => void meet(persona)}
            >
              <span className="persona-chip-name">{persona.name}</span>
              <span className="persona-chip-role">{persona.role}</span>
            </button>
          )
        })}
      </div>

      <p className="persona-strip-line" aria-live="polite">
        {speaking && active
          ? active.line
          : active
            ? active.line
            : 'Luna, Viktor, or Himari. One tap.'}
      </p>
    </section>
  )
}
