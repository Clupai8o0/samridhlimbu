'use client'

import { useState } from 'react'

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid #2a2a2e',
        borderRadius: 4,
        cursor: 'pointer',
        padding: '5px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: copied ? '#4ade80' : '#71717a',
        transition: 'color .15s, border-color .15s, background .15s',
        lineHeight: 0,
      }}
      onMouseEnter={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.background = 'rgba(255,255,255,0.08)'
        btn.style.borderColor = '#3f3f46'
        if (!copied) btn.style.color = '#e5e5e7'
      }}
      onMouseLeave={e => {
        const btn = e.currentTarget as HTMLButtonElement
        btn.style.background = 'rgba(255,255,255,0.04)'
        btn.style.borderColor = '#2a2a2e'
        if (!copied) btn.style.color = '#71717a'
      }}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  )
}
