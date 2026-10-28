import { useEffect, useRef, useState } from 'react'
import { apiUrl } from '../lib/api'
import { track } from '../lib/analytics'
import { speakText } from '../lib/speak'
import {
  ideaFromSelection,
  openCluster,
  openProject,
  requestBuild,
} from '../lib/store-events'

export const MUTE_KEY = 'solonaras-guide-muted'

type GuideWidget = {
  id: string
  label: string
  href: string
  handle?: string
}

type Msg = {
  role: 'user' | 'assistant'
  text: string
  widgets?: GuideWidget[]
  prompts?: string[]
}

type SolonarasGuideProps = {
  openSignal?: number
  selectedProjectName?: string | null
  selectedClusterName?: string | null
  selectedClusterId?: string | null
}

function detectLang(text: string): 'el' | 'en' {
  return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(text) ? 'el' : 'en'
}

const WELCOME =
  "Hi — I'm the Solonaras guide. What would you like to know? I can help with projects, prices, hiring Christos, or anything else about this store."

const SUGGESTIONS = [
  'What are the clusters?',
  'How much do projects cost?',
  'Show me Live & Games',
  'How do I contact Christos?',
  'How long does a build take?',
]

function applyNavigation(url: string) {
  const raw = url.startsWith('#') ? url.slice(1) : url.includes('#') ? url.split('#')[1]! : url
  if (!raw) return

  if (raw.startsWith('cluster-')) {
    openCluster(raw.slice('cluster-'.length))
    return
  }
  if (raw === 'clusters' || raw === 'outro' || raw === 'hero') {
    document.getElementById(raw)?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  openProject(raw)
}

export function SolonarasGuide({
  openSignal = 0,
  selectedProjectName = null,
  selectedClusterName = null,
  selectedClusterId = null,
}: SolonarasGuideProps) {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([])
  const [listening, setListening] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const welcomed = useRef(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const chunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, showSuggestions])

  const stopAudio = () => {
    audioRef.current?.pause()
    if (audioRef.current) audioRef.current.src = ''
    audioRef.current = null
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }

  useEffect(() => {
    if (openSignal > 0) setOpen(true)
  }, [openSignal])

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [muted])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        stopAudio()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Welcome once when opened — ask what they need (skip if voice tour is driving)
  useEffect(() => {
    if (!open || welcomed.current) return
    welcomed.current = true
    void (async () => {
      setBusy(true)
      setMessages([{ role: 'assistant', text: WELCOME, prompts: SUGGESTIONS }])
      setShowSuggestions(true)
      setStatus('Speaking…')
      await speakText(WELCOME, {
        muted,
        language: 'en',
        audioRef,
      })
      setStatus('')
      setBusy(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Voice tour lines appear in the guide transcript
  useEffect(() => {
    const onTour = (event: Event) => {
      const text = (event as CustomEvent<{ text?: string }>).detail?.text
      if (!text) return
      setOpen(true)
      welcomed.current = true
      setShowSuggestions(false)
      setMessages((prev) => [...prev, { role: 'assistant', text }])
      setStatus('Tour…')
    }
    const onTourEnd = () => {
      setStatus('')
      setShowSuggestions(true)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Tour done — ask me anything, or open a cluster to explore.',
          prompts: SUGGESTIONS,
        },
      ])
    }
    window.addEventListener('solonaras-tour-message', onTour)
    window.addEventListener('solonaras-tour-ended', onTourEnd)
    return () => {
      window.removeEventListener('solonaras-tour-message', onTour)
      window.removeEventListener('solonaras-tour-ended', onTourEnd)
    }
  }, [])

  const ask = async (question: string) => {
    const q = question.trim()
    if (!q || busy) return
    setInput('')
    setShowSuggestions(false)
    setMessages((prev) => [...prev, { role: 'user', text: q }])
    setBusy(true)
    stopAudio()
    setStatus('Thinking…')

    try {
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.text,
      }))
      const language = detectLang(q)
      const res = await fetch(apiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          currentUrl: window.location.href,
          language,
          clusterId: selectedClusterId,
          history,
        }),
      })
      const data = (await res.json()) as {
        answer?: string
        error?: string
        navigation?: { url?: string; label?: string } | null
        widgets?: GuideWidget[]
        suggestedPrompts?: string[]
      }
      if (!res.ok) throw new Error(data.error || 'Chat failed')

      const answer =
        data.answer ||
        'I do not have that yet — try the contact form at the end of the aisle.'
      const widgets = Array.isArray(data.widgets) ? data.widgets : undefined
      const prompts = Array.isArray(data.suggestedPrompts)
        ? data.suggestedPrompts
        : undefined
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: answer, widgets, prompts },
      ])
      if (prompts?.length) setShowSuggestions(true)
      setStatus('Speaking…')
      await speakText(answer, {
        muted,
        language,
        audioRef,
      })

      if (data.navigation?.url) {
        applyNavigation(data.navigation.url)
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'I could not reach the guide brain. Is the assistant API running?'
      setMessages((prev) => [...prev, { role: 'assistant', text: message }])
    } finally {
      setStatus('')
      setBusy(false)
    }
  }

  const openWidget = (href: string) => {
    if (href.startsWith('action:request-build')) {
      const parts = href.split(':')
      // action:request-build:projectId:Project Name
      const projectId = parts[2] || undefined
      const projectName = parts.slice(3).join(':') || selectedProjectName
      requestBuild({
        projectId,
        idea: ideaFromSelection({
          projectName: projectName || selectedProjectName,
          clusterName: selectedClusterName,
        }),
      })
      return
    }
    if (href.startsWith('action:open-cluster:')) {
      openCluster(href.slice('action:open-cluster:'.length))
      return
    }
    if (href.startsWith('action:open-project:')) {
      openProject(href.slice('action:open-project:'.length))
      return
    }
    if (href.startsWith('#')) {
      applyNavigation(href)
      return
    }
    if (href.startsWith('mailto:')) {
      window.location.href = href
      return
    }
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const toggleMic = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      return
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
      return
    }

    const SpeechRec =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRec) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition: any = new SpeechRec()
      recognitionRef.current = recognition
      recognition.lang = 'en-US'
      recognition.interimResults = true
      recognition.continuous = false
      let finalText = ''
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i]![0]?.transcript ?? ''
          if (event.results[i]!.isFinal) finalText += piece
          else interim += piece
        }
        setInput((finalText || interim).trim())
      }
      recognition.onerror = () => {
        recognitionRef.current = null
        setListening(false)
        setStatus('Did not catch that — try again')
      }
      recognition.onend = () => {
        recognitionRef.current = null
        setListening(false)
        const text = (finalText || input).trim()
        if (text) void ask(text)
      }
      setListening(true)
      setStatus('Listening… tap mic to stop')
      recognition.start()
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('Microphone not supported here')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunksRef.current = []
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        setListening(false)
        void (async () => {
          setStatus('Transcribing…')
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const form = new FormData()
          form.append('audio', blob, 'speech.webm')
          form.append('language', 'en')
          try {
            const res = await fetch(apiUrl('/api/stt'), { method: 'POST', body: form })
            const data = (await res.json()) as { text?: string; error?: string }
            if (!res.ok) throw new Error(data.error || 'STT failed')
            const text = (data.text || '').trim()
            if (text) await ask(text)
            else setStatus('Did not catch that — try again')
          } catch (err) {
            setStatus(err instanceof Error ? err.message : 'STT failed')
          }
        })()
      }
      recorder.start(250)
      setListening(true)
      setStatus('Listening… tap mic to stop')
    } catch {
      setStatus('Microphone permission denied')
    }
  }

  const lastPrompts =
    [...messages].reverse().find((m) => m.role === 'assistant' && m.prompts?.length)
      ?.prompts ?? SUGGESTIONS

  return (
    <div className={`sol-guide ${open ? 'is-open' : ''}`}>
      {!open && (
        <button
          type="button"
          className="sol-guide-fab"
          onClick={() => setOpen(true)}
          aria-label="Open Solonaras guide"
        >
          <span className="sol-guide-fab-core" />
          <span className="sol-guide-fab-label">Ask guide</span>
        </button>
      )}

      {open && (
        <section className="sol-guide-panel" aria-label="Solonaras guide">
          <header className="sol-guide-header">
            <div>
              <p className="sol-guide-title">Solonaras Guide</p>
              <p className="sol-guide-sub">Ask anything · projects · prices · hiring</p>
            </div>
            <div className="sol-guide-header-actions">
              <button
                type="button"
                className="sol-guide-icon"
                aria-pressed={muted}
                title={muted ? 'Unmute' : 'Mute'}
                onClick={() => {
                  const next = !muted
                  setMuted(next)
                  if (next) stopAudio()
                }}
              >
                {muted ? '🔇' : '🔊'}
              </button>
              <button
                type="button"
                className="sol-guide-icon"
                title="Minimize"
                onClick={() => setOpen(false)}
              >
                –
              </button>
            </div>
          </header>

          <div className="sol-guide-messages">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`sol-guide-msg ${m.role}`}>
                <p className="sol-guide-msg-text">{m.text}</p>
                {m.widgets && m.widgets.length > 0 ? (
                  <div className="sol-guide-widgets" role="list">
                    {m.widgets.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        role="listitem"
                        className={`sol-guide-widget sol-guide-widget--${w.id}`}
                        onClick={() => openWidget(w.href)}
                      >
                        <span className="sol-guide-widget-label">{w.label}</span>
                        {w.handle ? (
                          <span className="sol-guide-widget-handle">{w.handle}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
            {showSuggestions && !busy ? (
              <div className="sol-guide-suggestions" aria-label="Suggested questions">
                {lastPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="sol-guide-chip"
                    onClick={() => {
                      track('guide_chip', { prompt })
                      void ask(prompt)
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <div className="sol-guide-status">{status}</div>

          <form
            className="sol-guide-composer"
            onSubmit={(e) => {
              e.preventDefault()
              void ask(input)
            }}
          >
            <textarea
              className="sol-guide-input"
              rows={1}
              value={input}
              placeholder="Ask about Luna, prices, AuthorHub…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void ask(input)
                }
              }}
            />
            <button
              type="button"
              className={`sol-guide-mic ${listening ? 'is-recording' : ''}`}
              onClick={() => void toggleMic()}
              title="Speak"
            >
              🎤
            </button>
            <button type="submit" className="sol-guide-send" disabled={busy} title="Send">
              ➤
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
