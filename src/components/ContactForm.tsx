import { useEffect, useState, type FormEvent } from 'react'
import { track } from '../lib/analytics'
import { CONTACT_WEBHOOK_URL } from '../lib/site-config'

const CONTACT_EMAIL = 'christossolonos@gmail.com'
const SUBMIT_URL = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`

type Status = 'idle' | 'sending' | 'sent' | 'error'

type ContactFormProps = {
  /** Prefills the idea field when cluster/project selection changes */
  ideaPrefill?: string
}

export function ContactForm({ ideaPrefill = '' }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [idea, setIdea] = useState(ideaPrefill)

  useEffect(() => {
    if (!ideaPrefill) return
    setIdea(ideaPrefill)
    setStatus((s) => (s === 'sent' ? 'idle' : s))
  }, [ideaPrefill])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Honeypot — bots fill this; humans never see it.
    if (String(data.get('_gotcha') || '').trim()) return

    setStatus('sending')
    setError('')

    const ideaText = String(data.get('idea') || '').trim()
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      idea: ideaText,
      interest: ideaPrefill.slice(0, 120),
      _subject: ideaPrefill
        ? `Solonaras portfolio — ${ideaPrefill.split('\n')[0]}`
        : 'Solonaras portfolio — inquiry',
      _template: 'table',
      _captcha: false,
      _replyto: String(data.get('email') || '').trim(),
    }

    try {
      const res = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Could not send right now. Try again in a moment.')

      track('contact_submit', { hasPrefill: Boolean(ideaPrefill) })

      if (CONTACT_WEBHOOK_URL) {
        void fetch(CONTACT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'solonaras-store',
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            idea: payload.idea,
            interest: payload.interest,
          }),
          keepalive: true,
        }).catch(() => undefined)
      }

      form.reset()
      setIdea('')
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-success" role="status">
        <p className="contact-success-title">Idea received</p>
        <p>
          Thanks — I’ll reply to the email you left. Prefer a faster ping? Use the
          socials above.
        </p>
        <button type="button" className="ghost-link" onClick={() => setStatus('idle')}>
          Send another idea
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate={false}>
      <div className="contact-form-head">
        <h3>Send me your idea</h3>
        <p>Name, email, phone, and what you want built — lands in my inbox.</p>
        {ideaPrefill ? (
          <p className="contact-prefill-note">Idea field prefilled from your current selection.</p>
        ) : null}
      </div>

      <div className="contact-grid">
        <label className="contact-field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required placeholder="Your name" />
        </label>
        <label className="contact-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@email.com"
          />
        </label>
        <label className="contact-field contact-field-full">
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+357 ..."
          />
        </label>
        <label className="contact-field contact-field-full">
          <span>Your idea</span>
          <textarea
            name="idea"
            required
            rows={5}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="What do you want built? Companion, site, voice system, something new…"
          />
        </label>
      </div>

      {/* Honeypot */}
      <input
        className="contact-honeypot"
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="contact-actions">
        <button className="cta" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send idea'}
        </button>
        {status === 'error' && <p className="contact-error">{error}</p>}
      </div>
    </form>
  )
}
