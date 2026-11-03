import { noteMediaGesture } from './media-audio'
import { speakText } from './speak'

/** Same key as SolonarasGuide mute toggle */
const MUTE_KEY = 'solonaras-guide-muted'

let abort: AbortController | null = null
let audio: HTMLAudioElement | null = null
let currentId: string | null = null

export function stopProjectNarration() {
  abort?.abort()
  abort = null
  audio?.pause()
  audio = null
  currentId = null
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}

function guideMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

function tourIsRunning() {
  return document.documentElement.classList.contains('is-touring')
}

/** Speak a project's narration (Fish TTS). Replaces any in-flight line. */
export async function speakProjectNarration(
  project: { id: string; narration: string },
) {
  const text = project.narration?.trim()
  if (!text || tourIsRunning()) return

  noteMediaGesture()
  stopProjectNarration()
  currentId = project.id
  const ac = new AbortController()
  abort = ac
  const audioRef = { current: null as HTMLAudioElement | null }

  try {
    await speakText(text, {
      muted: guideMuted(),
      language: 'en',
      audioRef,
      signal: ac.signal,
    })
  } finally {
    if (audioRef.current) audio = audioRef.current
    if (currentId === project.id) currentId = null
  }
}

export function isNarratingProject(projectId: string) {
  return currentId === projectId
}

export function prefersHover() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}
