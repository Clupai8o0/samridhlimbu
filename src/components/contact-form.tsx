'use client'

import { useId, useState } from 'react'
import { sendContact } from '@/app/actions'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const ROW: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '76px minmax(0, 1fr)',
  alignItems: 'start',
}

const LABEL: React.CSSProperties = {
  fontFamily: MONO,
  fontSize: 'var(--text-xs)',
  lineHeight: '24px',
  color: 'var(--accent)',
  padding: '12px 0 12px 14px',
  cursor: 'pointer',
}

// The global :focus-visible ring draws on the field itself; the negative
// offset keeps it inside the row's hairline border.
const FIELD: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: 2,
  outlineOffset: -2,
  padding: '12px 14px 12px 4px',
  fontFamily: SANS,
  fontSize: 'var(--text-base)',
  lineHeight: '24px',
  color: 'var(--fg)',
  caretColor: 'var(--accent)',
}

export function ContactForm() {
  const id = useId()
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus]   = useState<Status>('idle')
  const [errMsg, setErrMsg]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') {
      return
    }

    setStatus('sending')
    setErrMsg('')

    let result: Awaited<ReturnType<typeof sendContact>>
    try {
      result = await sendContact({ name, email, message })
    } catch {
      result = { ok: false, error: 'send failed, try samridh@samridhlimbu.com' }
    }

    if (result.ok) {
      setStatus('sent')
      setName(''); setEmail(''); setMessage('')
    } else {
      setStatus('error')
      setErrMsg(result.error)
    }
  }

  const isSent    = status === 'sent'
  const isSending = status === 'sending'

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 0 }}>

      <div style={{ border: '1px solid var(--border-2)', borderRadius: 2 }}>

        <div style={{ ...ROW, borderBottom: '1px solid var(--border)' }}>
          <label htmlFor={`${id}-name`} style={LABEL}>--name</label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="your name"
            required
            disabled={isSent}
            className="t2-contact-input"
            style={FIELD}
          />
        </div>

        <div style={{ ...ROW, borderBottom: '1px solid var(--border)' }}>
          <label htmlFor={`${id}-email`} style={LABEL}>--email</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isSent}
            className="t2-contact-input"
            style={FIELD}
          />
        </div>

        <div style={ROW}>
          <label htmlFor={`${id}-message`} style={LABEL}>--msg</label>
          <textarea
            id={`${id}-message`}
            name="message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="what's on your mind?"
            required
            rows={5}
            disabled={isSent}
            className="t2-contact-textarea"
            style={{ ...FIELD, resize: 'vertical', minHeight: 120 }}
          />
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', marginTop: 12, gap: 12,
      }}>
        <div id={`${id}-status`} aria-live="polite" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
          {isSent && (
            <span style={{ color: 'var(--term-green)' }}>
              ✓ sent. I&apos;ll get back to you soon.
            </span>
          )}
          {status === 'error' && (
            <span role="alert" style={{ color: '#f87171' }}>
              ✗ {errMsg}
            </span>
          )}
          {status === 'idle' && (
            <span style={{ color: 'var(--muted-2)' }}>
              all fields required
            </span>
          )}
          {isSending && (
            <span style={{ color: 'var(--muted-2)' }}>
              sending<span className="t2-cursor thin" aria-hidden="true" />
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSending || isSent}
          className="btn btn-primary"
          style={{
            fontFamily: MONO, fontSize: 'var(--text-xs)',
            height: 40, padding: '0 16px',
            opacity: isSending ? 0.6 : 1,
            cursor: isSending || isSent ? 'default' : 'pointer',
            flexShrink: 0,
          }}
        >
          {isSent ? '✓ sent' : isSending ? 'sending…' : '$ send →'}
        </button>
      </div>
    </form>
  )
}
