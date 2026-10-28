/** Sticky flag: user has gestured on this page — prefer unmuted aisle video. */
let gestured = false

export function hasMediaGesture() {
  return gestured
}

export function noteMediaGesture() {
  if (gestured) return
  gestured = true
  window.dispatchEvent(new Event('solonaras-media-gesture'))
}

/** Call from click/tap handlers (tour start, cluster open) before awaits. */
export function noteMediaGestureFromEvent() {
  noteMediaGesture()
}

export function bindMediaGestureCapture() {
  const mark = () => noteMediaGesture()
  window.addEventListener('pointerdown', mark, { capture: true })
  window.addEventListener('keydown', mark, { capture: true })
  return () => {
    window.removeEventListener('pointerdown', mark, { capture: true })
    window.removeEventListener('keydown', mark, { capture: true })
  }
}

export function playUnmuted(video: HTMLVideoElement): Promise<void> {
  video.muted = false
  video.volume = 1
  return video.play().then(() => undefined)
}

export function playWithSoundFallback(video: HTMLVideoElement): Promise<'unmuted' | 'muted'> {
  video.defaultMuted = false
  video.muted = false
  video.volume = 1
  return video
    .play()
    .then(() => 'unmuted' as const)
    .catch(async () => {
      video.muted = true
      await video.play().catch(() => undefined)
      return 'muted' as const
    })
}
