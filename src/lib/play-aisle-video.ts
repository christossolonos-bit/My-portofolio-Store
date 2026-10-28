/** Play the active aisle video unmuted inside a user-gesture call stack. */
export function playActiveAisleUnmuted() {
  const video = document.querySelector(
    '.project-video.is-active video.project-video-el',
  ) as HTMLVideoElement | null
  if (!video) return
  video.muted = false
  video.volume = 1
  void video.play().catch(() => undefined)
}
