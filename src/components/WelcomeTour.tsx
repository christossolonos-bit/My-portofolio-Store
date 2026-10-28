import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { TOUR_DONE_KEY, WELCOME_TOUR } from '../data/welcome-tour'
import { MUTE_KEY } from './SolonarasGuide'
import { track } from '../lib/analytics'
import { noteMediaGestureFromEvent } from '../lib/media-audio'
import { pauseAllAisleVideos } from '../lib/play-aisle-video'
import { speakText } from '../lib/speak'
import { openCluster } from '../lib/store-events'

type WelcomeTourProps = {
  muted: boolean
}

export function WelcomeTour({ muted }: WelcomeTourProps) {
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
    document.documentElement.classList.remove('is-touring')
    window.dispatchEvent(new Event('solonaras-tour-ended'))
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
    noteMediaGestureFromEvent()
    track('welcome_tour_start')
    flushSync(() => {
      setRunning(true)
      setVisible(true)
    })
    document.documentElement.classList.add('is-touring')

    let liveMuted = muted
    try {
      liveMuted = localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      /* keep prop */
    }

    const ac = new AbortController()
    abortRef.current = ac

    for (let i = 0; i < WELCOME_TOUR.length; i++) {
      if (ac.signal.aborted) return
      const step = WELCOME_TOUR[i]!
      setStepIndex(i)

      if (step.openCluster) {
        openCluster(step.openCluster)
        await wait(120, ac.signal)
      }
      if (step.scrollTo) {
        document
          .getElementById(step.scrollTo)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        await wait(750, ac.signal)
      }

      // Keep aisle videos paused so Fish TTS is the only voice
      pauseAllAisleVideos()

      await speakText(step.text, {
        muted: liveMuted,
        language: 'en',
        audioRef,
        signal: ac.signal,
      })
      pauseAllAisleVideos()
      await wait(350, ac.signal)
    }

    if (!ac.signal.aborted) {
      track('welcome_tour_complete')
      stop(true)
      document.getElementById('clusters')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  // Allow Hero to restart the tour (chat stays closed)
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
              A short spoken walkthrough — I’ll scroll to each part while the
              guide stays closed. About a minute.
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
            <p className="welcome-tour-title">Showing the portfolio…</p>
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
