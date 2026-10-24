'use client'

import { useEffect, useState } from 'react'
import { CommandPalette } from './command-palette'

const MONO = 'var(--font-mono, "JetBrains Mono", monospace)'

/** Dispatch this on window to open the palette from anywhere (e.g. the mobile drawer). */
export const OPEN_CMD_EVENT = 't2:open-cmd'

export function openCommandPalette() {
  window.dispatchEvent(new Event(OPEN_CMD_EVENT))
}

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
    function handleOpen() {
      setOpen(true)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener(OPEN_CMD_EVENT, handleOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener(OPEN_CMD_EVENT, handleOpen)
    }
  }, [])

  return (
    <>
      {children}

      {/* Floating ⌘K trigger */}
      <button
        className="t2-cmd-fab"
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
          borderRadius: 2,
          fontFamily: MONO,
          fontSize: 12,
          color: 'var(--muted)',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
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

      {open && <CommandPalette open onClose={() => setOpen(false)} />}
    </>
  )
}
