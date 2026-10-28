import { useEffect, useRef, useState } from 'react'
import { TOUR_DONE_KEY, WELCOME_TOUR } from '../data/welcome-tour'
import { MUTE_KEY } from './SolonarasGuide'
import { track } from '../lib/analytics'
import { speakText } from '../lib/speak'
import { openCluster } from '../lib/store-events'

type WelcomeTourProps = {
  muted: boolean
  onOpenGuide: () => void
}

export function WelcomeTour({ muted, onOpenGuide }: WelcomeTourProps) {
  const [visible, setVisible] = useState(false)
  const [running, setRunning] = useState(false)
  const [stepIndex, setStepIndex] = useState(-1)
  const abortRef = useRef<AbortController | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(TOUR_DONE_KEY) === '1') return
    } catch {
      /* show anyway */
    }
    const t = window.setTimeout(() => setVisible(true), 900)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      audioRef.current?.pause()
    }
  }, [])

  const stop = (markDone: boolean) => {
    abortRef.current?.abort()
    abortRef.current = null
    audioRef.current?.pause()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setRunning(false)
    setStepIndex(-1)
    setVisible(false)
    if (markDone) {
      try {
        localStorage.setItem(TOUR_DONE_KEY, '1')
      } catch {
        /* ignore */
      }
    }
  }

  const start = async () => {
    if (running) return
    track('welcome_tour_start')
    setRunning(true)
    setVisible(true)
    onOpenGuide()

    let liveMuted = muted
    try {
      liveMuted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      /* keep prop */
    }

    window.dispatchEvent(
      new CustomEvent('solonaras-tour-message', {
        detail: {
          text: "I'll give you a quick tour of the portfolio — clusters, builds, and how to reach Christos.",
        },
      }),
    )

    const ac = new AbortController()
    abortRef.current = ac

    for (let i = 0; i < WELCOME_TOUR.length; i++) {
      if (ac.signal.aborted) return
      const step = WELCOME_TOUR[i]!
      setStepIndex(i)

      if (step.openCluster) openCluster(step.openCluster)
      if (step.scrollTo) {
        document
          .getElementById(step.scrollTo)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        await wait(700, ac.signal)
      }

      window.dispatchEvent(
        new CustomEvent('solonaras-tour-message', {
          detail: { text: step.text },
        }),
      )

      await speakText(step.text, {
        muted: liveMuted,
        language: 'en',
        audioRef,
        signal: ac.signal,
      })
      await wait(350, ac.signal)
    }

    if (!ac.signal.aborted) {
      track('welcome_tour_complete')
      window.dispatchEvent(new Event('solonaras-tour-ended'))
      stop(true)
      document.getElementById('clusters')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  // Allow Hero / guide to restart the tour
  useEffect(() => {
    const restart = () => {
      try {
        localStorage.removeItem(TOUR_DONE_KEY)
      } catch {
        /* ignore */
      }
      setVisible(true)
      void start()
    }
    window.addEventListener('solonaras-start-welcome-tour', restart)
    return () =>
      window.removeEventListener('solonaras-start-welcome-tour', restart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, running])

  if (!visible && !running) return null

  return (
    <div className={`welcome-tour ${running ? 'is-running' : ''}`}>
      {!running ? (
        <>
          <div className="welcome-tour-copy">
            <p className="welcome-tour-eyebrow">Voice tour</p>
            <p className="welcome-tour-title">New here? I’ll show you around.</p>
            <p className="welcome-tour-sub">
              A short spoken walkthrough of clusters, the guide, and how to get
              in touch — about a minute.
            </p>
          </div>
          <div className="welcome-tour-actions">
            <button type="button" className="cta" onClick={() => void start()}>
              Start welcome tour
            </button>
            <button
              type="button"
              className="cta cta-secondary"
              onClick={() => {
                track('welcome_tour_skip')
                stop(true)
              }}
            >
              Skip for now
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="welcome-tour-copy">
            <p className="welcome-tour-eyebrow">
              Tour · {Math.max(1, stepIndex + 1)} / {WELCOME_TOUR.length}
            </p>
            <p className="welcome-tour-title">Showing you the store…</p>
            <p className="welcome-tour-sub">
              {stepIndex >= 0
                ? WELCOME_TOUR[stepIndex]?.text
                : 'Starting…'}
            </p>
          </div>
          <div className="welcome-tour-actions">
            <button
              type="button"
              className="cta cta-secondary"
              onClick={() => {
                track('welcome_tour_stop')
                stop(true)
              }}
            >
              Stop tour
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal?.aborted) {
      resolve()
      return
    }
    const id = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(id)
      resolve()
    })
  })
}
