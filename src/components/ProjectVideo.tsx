import { useEffect, useRef, useState } from 'react'

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
  const [muted, setMuted] = useState(false)
  const isLocal = Boolean(videoSrc)
  const thumb = isLocal
    ? (posterSrc ?? undefined)
    : youtubeId
      ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
      : undefined

  // Start when the aisle is in view; stop when leaving
  useEffect(() => {
    if (!active) {
      setPlaying(false)
      setMuted(false)
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      return
    }
    setPlaying(true)
    setMuted(false)
  }, [active])

  // Play unmuted once the local <video> is mounted; fall back to muted if blocked
  useEffect(() => {
    if (!active || !playing || !isLocal) return
    const video = videoRef.current
    if (!video) return
    video.muted = muted
    void video.play().catch(() => {
      if (!muted) {
        video.muted = true
        setMuted(true)
        void video.play().catch(() => undefined)
      }
    })
  }, [active, playing, isLocal, muted])

  const startLocal = () => {
    setPlaying(true)
    setMuted(false)
    requestAnimationFrame(() => {
      const video = videoRef.current
      if (!video) return
      video.muted = false
      void video.play().catch(() => {
        video.muted = true
        setMuted(true)
        void video.play().catch(() => undefined)
      })
    })
  }

  const startYoutube = () => {
    setMuted(false)
    setPlaying(true)
  }

  const unmuteLocal = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    setMuted(false)
    void video.play().catch(() => undefined)
  }

  const embed =
    youtubeId && playing
      ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${muted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1`
      : null

  return (
    <div
      className={`project-video ${active ? 'is-active' : ''} ${playing ? 'is-playing' : ''}`}
      style={{ ['--accent' as string]: accent }}
    >
      {isLocal ? (
        playing ? (
          <>
            <video
              ref={videoRef}
              className="project-video-el"
              src={videoSrc}
              poster={posterSrc}
              controls
              playsInline
              muted={muted}
              autoPlay
              loop
              preload="metadata"
              aria-label={title}
            />
            {muted && (
              <button
                type="button"
                className="project-video-unmute"
                onClick={unmuteLocal}
              >
                Unmute
              </button>
            )}
          </>
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
