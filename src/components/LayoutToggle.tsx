import { useEffect, useState } from 'react'
import { track } from '../lib/analytics'

export const LAYOUT_KEY = 'solonaras-layout'
export type LayoutMode = 'phone' | 'desktop'

function prefersPhoneViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 720px)').matches
}

function readStored(): LayoutMode | null {
  try {
    const v = localStorage.getItem(LAYOUT_KEY)
    if (v === 'phone' || v === 'desktop') return v
  } catch {
    /* ignore */
  }
  return null
}

function applyLayoutClass(mode: LayoutMode) {
  document.documentElement.classList.toggle('is-phone-layout', mode === 'phone')
  document.documentElement.classList.toggle(
    'is-desktop-layout',
    mode === 'desktop',
  )
  document.documentElement.dataset.layout = mode
}

/** Resolve initial mode: stored preference, else viewport. */
export function resolveLayoutMode(): LayoutMode {
  return readStored() ?? (prefersPhoneViewport() ? 'phone' : 'desktop')
}

type LayoutToggleProps = {
  mode: LayoutMode
  onChange: (mode: LayoutMode) => void
}

export function LayoutToggle({ mode, onChange }: LayoutToggleProps) {
  const isPhone = mode === 'phone'
  const label = isPhone ? 'Switch to desktop layout' : 'Switch to phone layout'

  return (
    <button
      type="button"
      className={`layout-toggle ${isPhone ? 'is-phone' : 'is-desktop'}`}
      aria-pressed={isPhone}
      aria-label={label}
      title={label}
      onClick={() => {
        const next: LayoutMode = isPhone ? 'desktop' : 'phone'
        track('layout_toggle', { mode: next })
        onChange(next)
      }}
    >
      {isPhone ? <DesktopIcon /> : <PhoneIcon />}
      <span className="layout-toggle-label">
        {isPhone ? 'Desktop' : 'Phone'}
      </span>
    </button>
  )
}

/** Keeps html class + localStorage in sync with mode. */
export function useLayoutMode(): [LayoutMode, (mode: LayoutMode) => void] {
  const [mode, setMode] = useState<LayoutMode>(() => resolveLayoutMode())

  useEffect(() => {
    applyLayoutClass(mode)
    try {
      localStorage.setItem(LAYOUT_KEY, mode)
    } catch {
      /* ignore */
    }
  }, [mode])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)')
    const onChange = () => {
      // Only auto-follow viewport when user hasn't chosen explicitly this session
      // — we always persist, so only update if no stored preference.
      if (readStored()) return
      setMode(mq.matches ? 'phone' : 'desktop')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return [mode, setMode]
}

function PhoneIcon() {
  return (
    <svg
      className="layout-toggle-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="7"
        y="2"
        width="10"
        height="20"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="18.5" r="1" fill="currentColor" />
    </svg>
  )
}

function DesktopIcon() {
  return (
    <svg
      className="layout-toggle-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="4"
        width="20"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
