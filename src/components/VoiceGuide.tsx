type VoiceGuideProps = {
  enabled: boolean
  speaking: boolean
  activeLabel: string | null
  onToggle: () => void
}

export function VoiceGuide({
  enabled,
  speaking,
  activeLabel,
  onToggle,
}: VoiceGuideProps) {
  return (
    <aside className={`voice-guide ${speaking ? 'is-speaking' : ''} ${enabled ? 'is-on' : ''}`}>
      <button
        type="button"
        className="voice-orb"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={enabled ? 'Mute voice guide' : 'Enable voice guide'}
      >
        <span className="voice-ring" />
        <span className="voice-ring delay" />
        <span className="voice-core" />
      </button>
      <div className="voice-copy">
        <p className="voice-title">{enabled ? 'Guide on' : 'Guide muted'}</p>
        <p className="voice-status">
          {enabled
            ? speaking
              ? `Speaking · ${activeLabel ?? '…'}`
              : activeLabel
                ? `Ready · ${activeLabel}`
                : 'Scroll to explore'
            : 'Tap to hear each project'}
        </p>
      </div>
    </aside>
  )
}
