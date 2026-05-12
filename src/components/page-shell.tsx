'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PageAnimations } from '@/components/page-animations'

const SECTIONS = [
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' },
  { href: '/resume', label: 'resume' },
]

const MONO = 'var(--font-mono, "JetBrains Mono", monospace)'

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const current = SECTIONS.find(s => pathname?.startsWith(s.href))
  const others = SECTIONS.filter(s => !pathname?.startsWith(s.href))

  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="t2-nav" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        fontFamily: MONO,
        fontSize: 12,
        position: 'relative',
        zIndex: 20,
      }}>
        {/* Left: path breadcrumb */}
        <Link
          href={current?.href ?? '/'}
          style={{ color: 'var(--muted-2)', textDecoration: 'none', fontWeight: 400 }}
          onClick={() => setMenuOpen(false)}
        >
          ~/samridhlimbu
          {current && (
            <>
              <span>/</span>
              <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{current.label}</span>
            </>
          )}
        </Link>

        {/* Desktop links */}
        <div className="t2-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {others.map(s => (
            <Link
              key={s.href}
              href={s.href}
              className="t2-nav-item"
            >
              {s.label}
            </Link>
          ))}
          <kbd
            className="t2-key"
            style={{ color: 'var(--muted-2)', fontSize: 10, fontFamily: MONO, cursor: 'pointer' }}
          >
            ⌘K
          </kbd>
          <Link
            href="/"
            style={{ color: !current ? 'var(--fg)' : 'var(--muted-2)', textDecoration: 'none', transition: 'color .12s' }}
          >
            /
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="t2-nav-ham"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle navigation"
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 3,
            padding: '5px 9px',
            color: menuOpen ? 'var(--fg)' : 'var(--muted-2)',
            fontFamily: MONO,
            fontSize: 14,
            cursor: 'pointer',
            lineHeight: 1,
            transition: 'color .12s, border-color .12s',
          }}
        >
          {menuOpen ? '✕' : '≡'}
        </button>
      </nav>

      {/* Mobile drawer — only in DOM when open, CSS hides on desktop */}
      {menuOpen && (
        <div
          className="t2-nav-drawer"
          style={{
            display: 'none',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            zIndex: 15,
          }}
        >
          {SECTIONS.map(s => {
            const isActive = pathname?.startsWith(s.href)
            return (
              <Link
                key={s.href}
                href={s.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 20px',
                  fontFamily: MONO,
                  fontSize: 12,
                  color: isActive ? 'var(--fg)' : 'var(--muted-2)',
                  textDecoration: 'none',
                  borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  borderBottom: '1px solid var(--border)',
                  transition: 'color .12s',
                }}
              >
                <span style={{ color: 'var(--accent)', fontSize: 10, flexShrink: 0 }}>›</span>
                {s.label}
                {isActive && <span style={{ marginLeft: 'auto', fontSize: 9, color: 'var(--muted-2)', letterSpacing: '0.05em' }}>current</span>}
              </Link>
            )
          })}
          <div style={{
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted-2)', textDecoration: 'none' }}
            >
              ~/home
            </Link>
            <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)' }}>
              <kbd className="t2-key">⌘K</kbd> to search
            </span>
          </div>
        </div>
      )}

      <main key={pathname} className="t2-main" style={{ flex: 1 }}>
        <PageAnimations />
        {children}
      </main>
    </div>
  )
}
