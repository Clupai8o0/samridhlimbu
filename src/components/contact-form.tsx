'use client'

import { useState, useRef } from 'react'
import { sendContact } from '@/app/actions'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus]   = useState<Status>('idle')
  const [errMsg, setErrMsg]   = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') return

    setStatus('sending')
    setErrMsg('')

    const result = await sendContact({ name, email, message })

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
    <form ref={formRef} onSubmit={handleSubmit} style={{ marginTop: 0 }}>

      {/* Input rows */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 2 }}>

        {/* name */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', flexShrink: 0, width: 56 }}>
            --name
          </span>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="your name"
            required
            disabled={isSent}
            className="t2-contact-input"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: MONO, fontSize: 12, color: 'var(--fg)',
              caretColor: 'var(--accent)',
            }}
          />
        </div>

        {/* email */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderBottom: '1px solid var(--border)',
        }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', flexShrink: 0, width: 56 }}>
            --email
          </span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isSent}
            className="t2-contact-input"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: MONO, fontSize: 12, color: 'var(--fg)',
              caretColor: 'var(--accent)',
            }}
          />
        </div>

        {/* message */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 14px',
        }}>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', flexShrink: 0, width: 56, paddingTop: 2 }}>
            --msg
          </span>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="what's on your mind?"
            required
            rows={4}
            disabled={isSent}
            className="t2-contact-textarea"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: MONO, fontSize: 12, color: 'var(--fg)',
              resize: 'none', lineHeight: 1.65,
              caretColor: 'var(--accent)',
            }}
          />
        </div>
      </div>

      {/* Footer row: status + submit */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 10, gap: 12,
      }}>
        {/* Status feedback */}
        <div style={{ fontFamily: MONO, fontSize: 10.5, lineHeight: 1.5 }}>
          {isSent && (
            <span style={{ color: 'var(--term-green)' }}>
              ✓ sent — i&apos;ll get back to you soon.
            </span>
          )}
          {status === 'error' && (
            <span style={{ color: '#ef4444' }}>
              ✗ {errMsg}
            </span>
          )}
          {status === 'idle' && (
            <span style={{ color: 'var(--muted-2)' }}>
              press enter or click send
            </span>
          )}
          {isSending && (
            <span style={{ color: 'var(--muted-2)' }}>
              sending<span className="t2-cursor thin" />
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSending || isSent}
          className="btn btn-primary"
          style={{
            fontFamily: MONO, fontSize: 10,
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
