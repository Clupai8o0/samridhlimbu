'use client'

import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

export type TocItem = { id: string; text: string }

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

const subscribeMq = (callback: () => void) => {
  const mq = window.matchMedia('(min-width: 1100px)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}
const getMqSnapshot = () => window.matchMedia('(min-width: 1100px)').matches
const getMqServerSnapshot = () => false

const subscribeMounted = () => () => {}
const getMountedSnapshot = () => true
const getMountedServerSnapshot = () => false

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null)
  const isDesktop = useSyncExternalStore(subscribeMq, getMqSnapshot, getMqServerSnapshot)
  const [mobileOpen, setMobileOpen] = useState(false)
  const mounted = useSyncExternalStore(subscribeMounted, getMountedSnapshot, getMountedServerSnapshot)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (items.length === 0) return

    const heights = items.map((it) => document.getElementById(it.id)).filter(Boolean) as HTMLElement[]
    if (heights.length === 0) return

    const update = () => {
      const scrollY = window.scrollY + 120
      let current = items[0]?.id ?? null
      for (const el of heights) {
        if (el.offsetTop <= scrollY) current = el.id
        else break
      }
      setActive(current)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items])

  if (items.length === 0 || !mounted) return null

  const linkStyle = (isActive: boolean): CSSProperties => ({
    display: 'block',
    padding: '5px 12px',
    fontFamily: MONO,
    fontSize: 11,
    color: isActive ? 'var(--fg)' : 'var(--muted-2)',
    background: isActive ? 'rgba(99,102,241,0.06)' : 'transparent',
    fontWeight: isActive ? 500 : 400,
    textDecoration: 'none',
    borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
    lineHeight: 1.5,
    transition: 'color 140ms, border-color 140ms, background 140ms',
  })

  const labelStyle: CSSProperties = {
    fontFamily: MONO,
    fontSize: 10,
    color: 'var(--muted-2)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 10,
    paddingLeft: 12,
  }

  if (isDesktop) {
    return createPortal(
      <aside
        aria-label="Table of contents"
        style={{
          position: 'fixed',
          top: 120,
          right: 'max(24px, calc(50vw - 632px))',
          width: 220,
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto',
          zIndex: 30,
        }}
      >
        <div style={labelStyle}>❯ on this page</div>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} style={linkStyle(active === it.id)}>
              {it.text}
            </a>
          ))}
        </nav>
      </aside>,
      document.body,
    )
  }

  // Mobile: small fixed floating icon-button, stacked above the ⌘K palette
  // button at bottom-right so they don't overlap.
  return createPortal(
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close table of contents"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            zIndex: 40,
          }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          right: 24,
          bottom: 76,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        {mobileOpen && (
          <div
            role="dialog"
            aria-label="Table of contents"
            style={{
              width: 'min(320px, calc(100vw - 48px))',
              maxHeight: 'min(60vh, 480px)',
              overflowY: 'auto',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '10px 0',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            }}
          >
            <div style={labelStyle}>❯ on this page</div>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              {items.map((it) => (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  onClick={() => setMobileOpen(false)}
                  style={{ ...linkStyle(active === it.id), padding: '8px 14px', fontSize: 12 }}
                >
                  {it.text}
                </a>
              ))}
            </nav>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close table of contents' : 'Open table of contents'}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-2)',
            border: '1px solid var(--border-2)',
            borderRadius: 4,
            cursor: 'pointer',
            fontFamily: MONO,
            fontSize: 14,
            color: 'var(--fg)',
            lineHeight: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <span style={{ color: mobileOpen ? 'var(--fg-dim)' : 'var(--accent)' }}>
            {mobileOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>
    </>,
    document.body,
  )
}
