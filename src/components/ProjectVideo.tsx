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

function tourIsRunning() {
  return document.documentElement.classList.contains('is-touring')
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

  // Start when the aisle is in view; stop when leaving. Stay paused during the voice tour.
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
    if (tourIsRunning()) {
      setPlaying(true)
      requestAnimationFrame(() => videoRef.current?.pause())
      return
    }
    setPlaying(true)
  }, [active])

  useEffect(() => {
    const onTourPause = () => {
      videoRef.current?.pause()
    }
    const onTourEnded = () => {
      if (!active || !isLocal) return
      const video = videoRef.current
      if (!video) return
      void playWithSoundFallback(video)
    }
    window.addEventListener('solonaras-tour-pause-videos', onTourPause)
    window.addEventListener('solonaras-tour-ended', onTourEnded)
    return () => {
      window.removeEventListener('solonaras-tour-pause-videos', onTourPause)
      window.removeEventListener('solonaras-tour-ended', onTourEnded)
    }
  }, [active, isLocal])

  // Prefer unmuted playback once mounted — skip while the welcome tour is talking
  useLayoutEffect(() => {
    if (!active || !playing || !isLocal) return
    const video = videoRef.current
    if (!video) return
    if (tourIsRunning()) {
      video.pause()
      return
    }

    let cancelled = false

    const applyUnmute = () => {
      if (cancelled || tourIsRunning()) return
      video.muted = false
      video.volume = 1
      void video.play().catch(() => undefined)
    }

    void playWithSoundFallback(video).then((mode) => {
      if (cancelled || tourIsRunning()) {
        video.pause()
        return
      }
      if (mode === 'unmuted') return

      const unlock = () => {
        noteMediaGesture()
        applyUnmute()
      }
      window.addEventListener('pointerdown', unlock, { capture: true })
      window.addEventListener('keydown', unlock, { capture: true })
      window.addEventListener('solonaras-media-gesture', unlock)
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
      if (tourIsRunning()) {
        video.pause()
        return
      }
      video.muted = false
      video.volume = 1
      void video.play().catch(() => undefined)
    })
  }

  const startYoutube = () => {
    noteMediaGesture()
    if (tourIsRunning()) return
    setPlaying(true)
  }

  const embed =
    youtubeId && playing && !tourIsRunning()
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
            autoPlay={!tourIsRunning()}
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
