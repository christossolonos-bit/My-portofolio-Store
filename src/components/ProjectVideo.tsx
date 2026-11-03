import { useEffect, useRef, useState } from 'react'
import {
  bindMediaGestureCapture,
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
  const [touring, setTouring] = useState(() => tourIsRunning())
  const [userStarted, setUserStarted] = useState(false)
  const isLocal = Boolean(videoSrc)
  const thumb = isLocal
    ? (posterSrc ?? undefined)
    : youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : undefined

  // Play only after the visitor chooses this project — never during the welcome tour
  const shouldPlay = active && !touring && userStarted

  useEffect(() => bindMediaGestureCapture(), [])

  useEffect(() => {
    const pause = () => {
      setTouring(true)
      setUserStarted(false)
      videoRef.current?.pause()
    }
    const ended = () => setTouring(tourIsRunning())
    window.addEventListener('solonaras-tour-pause-videos', pause)
    window.addEventListener('solonaras-tour-ended', ended)
    return () => {
      window.removeEventListener('solonaras-tour-pause-videos', pause)
      window.removeEventListener('solonaras-tour-ended', ended)
    }
  }, [])

  // Choosing a project (tile / shelf) starts the video; leaving resets
  useEffect(() => {
    if (!active) {
      setUserStarted(false)
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      return
    }
    if (tourIsRunning()) {
      setTouring(true)
      setUserStarted(false)
      return
    }
    setTouring(false)
    setUserStarted(true)
  }, [active])

  useEffect(() => {
    if (!isLocal) return
    const video = videoRef.current
    if (!video) return

    if (!shouldPlay) {
      video.pause()
      if (!active) video.currentTime = 0
      return
    }

    let cancelled = false
    void playWithSoundFallback(video).then((mode) => {
      if (cancelled || !shouldPlay) {
        video.pause()
        return
      }
      if (mode === 'muted') {
        const unlock = () => {
          noteMediaGesture()
          video.muted = false
          void video.play().catch(() => undefined)
        }
        window.addEventListener('pointerdown', unlock, {
          once: true,
          capture: true,
        })
      }
    })

    return () => {
      cancelled = true
      video.pause()
    }
  }, [shouldPlay, active, isLocal, videoSrc])

  const startLocal = () => {
    noteMediaGesture()
    if (tourIsRunning()) return
    setTouring(false)
    setUserStarted(true)
    requestAnimationFrame(() => {
      const video = videoRef.current
      if (!video) return
      video.muted = false
      void video.play().catch(() => undefined)
    })
  }

  const startYoutube = () => {
    noteMediaGesture()
    if (tourIsRunning()) return
    setTouring(false)
    setUserStarted(true)
  }

  const embed =
    youtubeId && shouldPlay
      ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`
      : null

  return (
    <div
      className={`project-video ${active ? 'is-active' : ''} ${shouldPlay ? 'is-playing' : ''}`}
      style={{ ['--accent' as string]: accent }}
    >
      {isLocal ? (
        active ? (
          <>
            <video
              ref={videoRef}
              className="project-video-el"
              src={videoSrc}
              poster={posterSrc}
              controls
              playsInline
              loop
              preload="metadata"
              aria-label={title}
            />
            {!shouldPlay && (
              <button
                type="button"
                className="project-video-start"
                onClick={startLocal}
              >
                Play tour
              </button>
            )}
          </>
        ) : (
          <>
            {thumb && (
              <img className="project-video-el" src={thumb} alt="" loading="lazy" />
            )}
          </>
        )
      ) : embed ? (
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
          {active && !shouldPlay && (
            <button type="button" className="project-video-start" onClick={startYoutube}>
              Play video
            </button>
          )}
        </>
      )}
      <div className="project-video-fade" />
      {!shouldPlay && (
        <div className="project-video-play" aria-hidden="true">
          <span />
        </div>
      )}
    </div>
  )
}
