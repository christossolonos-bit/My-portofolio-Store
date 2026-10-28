/** Play the active aisle video unmuted inside a user-gesture call stack. */
export function playActiveAisleUnmuted() {
  if (document.documentElement.classList.contains('is-touring')) return
  const video = document.querySelector(
    '.project-video.is-active video.project-video-el',
  ) as HTMLVideoElement | null
  if (!video) return
  video.muted = false
  video.volume = 1
  void video.play().catch(() => undefined)
}

/** Pause every aisle video — used while the welcome tour is speaking. */
export function pauseAllAisleVideos() {
  document
    .querySelectorAll<HTMLVideoElement>('.project-video video.project-video-el')
    .forEach((video) => {
      video.pause()
    })
  window.dispatchEvent(new Event('solonaras-tour-pause-videos'))
}
