'use client'

import { useEffect } from 'react'
import { PageShell } from '@/components/page-shell'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageShell>
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{ height: 2, background: '#ef4444', marginBottom: 24 }} />
        <p style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>
          error: unhandled exception
        </p>
        <h1 style={{ fontFamily: MONO, fontSize: 52, fontWeight: 700, margin: '0 0 14px', color: 'var(--fg)' }}>
          oops<span style={{ color: '#ef4444' }}>.</span>
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 13, color: 'var(--fg-dim)', margin: '0 0 32px', lineHeight: 1.7 }}>
          Something went wrong. Try again or go back home.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={reset} className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 11, cursor: 'pointer' }}>
            retry
          </button>
          <a href="/" className="btn" style={{ fontFamily: MONO, fontSize: 11 }}>
            ← home
          </a>
        </div>
      </div>
    </PageShell>
  )
}
