'use client'

import { useEffect, useState } from 'react'
import { CommandPalette } from './command-palette'

const MONO = 'var(--font-mono, "JetBrains Mono", monospace)'

export function CmdProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {children}

      {/* Floating ⌘K trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '8px 13px',
          background: 'var(--bg-2)',
          border: '1px solid var(--border-2)',
          borderRadius: 4,
          fontFamily: MONO,
          fontSize: 11,
          color: 'var(--muted)',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          transition: 'border-color .12s, color .12s, transform .1s',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--fg)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-2)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)'
        }}
        onMouseDown={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.96)'
        }}
        onMouseUp={e => {
          ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
        }}
      >
        <span style={{ color: 'var(--accent)', fontSize: 13, lineHeight: 1 }}>❯_</span>
        <span>search</span>
        <kbd
          className="t2-key"
          style={{ fontFamily: MONO, pointerEvents: 'none' }}
        >
          ⌘K
        </kbd>
      </button>

      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  )
}
