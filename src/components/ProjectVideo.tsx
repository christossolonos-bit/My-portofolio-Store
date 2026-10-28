import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  bindMediaGestureCapture,
  hasMediaGesture,
  noteMediaGesture,
  playWithSoundFallback,
} from '../lib/media-audio'

type ProjectVideoProps = {
  youtubeId?: string
  videoSrc?: string
  posterSrc?: string
  title: string
  accent: string
  active: boolean
}

export function ProjectVideo({
  youtubeId,
  videoSrc,
  posterSrc,
  title,
  accent,
  active,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const isLocal = Boolean(videoSrc)
  const thumb = isLocal
    ? (posterSrc ?? undefined)
    : youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : undefined

  useEffect(() => bindMediaGestureCapture(), [])

  // Start when the aisle is in view; stop when leaving
  useEffect(() => {
    if (!active) {
      setPlaying(false)
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      return
    }
    setPlaying(true)
  }, [active])

  // Prefer unmuted playback as soon as the element is in the DOM
  useLayoutEffect(() => {
    if (!active || !playing || !isLocal) return
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const applyUnmute = () => {
      if (cancelled) return
      video.muted = false
      video.volume = 1
      void video.play().catch(() => undefined)
    }

    void playWithSoundFallback(video).then((mode) => {
      if (cancelled) return
      if (mode === 'unmuted') return

      // Policy blocked sound — keep picture, unmute on the next user gesture
      const unlock = () => {
        noteMediaGesture()
        applyUnmute()
      }
      window.addEventListener('pointerdown', unlock, { capture: true })
      window.addEventListener('keydown', unlock, { capture: true })
      window.addEventListener('solonaras-media-gesture', unlock)
      // If they already clicked earlier this session, retry immediately
      if (hasMediaGesture()) {
        requestAnimationFrame(applyUnmute)
      }
      ;(video as HTMLVideoElement & { __unlock?: () => void }).__unlock = () => {
        window.removeEventListener('pointerdown', unlock, { capture: true })
        window.removeEventListener('keydown', unlock, { capture: true })
        window.removeEventListener('solonaras-media-gesture', unlock)
      }
    })

    return () => {
      cancelled = true
      const unlock = (video as HTMLVideoElement & { __unlock?: () => void }).__unlock
      unlock?.()
    }
  }, [active, playing, isLocal, videoSrc])

  const startLocal = () => {
    noteMediaGesture()
    setPlaying(true)
    requestAnimationFrame(() => {
      const video = videoRef.current
      if (!video) return
      video.muted = false
      video.volume = 1
      void video.play().catch(() => undefined)
    })
  }

  const startYoutube = () => {
    noteMediaGesture()
    setPlaying(true)
  }

  const embed =
    youtubeId && playing
      ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`
      : null

  return (
    <div
      className={`project-video ${active ? 'is-active' : ''} ${playing ? 'is-playing' : ''}`}
      style={{ ['--accent' as string]: accent }}
    >
      {isLocal ? (
        playing ? (
          <video
            ref={videoRef}
            className="project-video-el"
            src={videoSrc}
            poster={posterSrc}
            controls
            playsInline
            autoPlay
            loop
            preload="auto"
            aria-label={title}
          />
        ) : (
          <>
            {thumb && (
              <img className="project-video-el" src={thumb} alt="" loading="lazy" />
            )}
            <button type="button" className="project-video-start" onClick={startLocal}>
              Play tour
            </button>
          </>
        )
      ) : playing && embed ? (
        <iframe
          className="project-video-el"
          src={embed}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <>
          {thumb && (
            <img className="project-video-el" src={thumb} alt="" loading="lazy" />
          )}
          <button type="button" className="project-video-start" onClick={startYoutube}>
            Play video
          </button>
        </>
      )}
      <div className="project-video-fade" />
      {!playing && (
        <div className="project-video-play" aria-hidden="true">
          <span />
        </div>
      )}
    </div>
  )
}
