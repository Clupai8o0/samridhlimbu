'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { PageAnimations } from '@/components/page-animations'
import { openCommandPalette } from '@/components/cmd-provider'

const SECTIONS = [
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' },
  { href: '/resume', label: 'resume' },
]

const MONO = 'var(--font-mono, "JetBrains Mono", monospace)'

const FOOTER_LINKS = [
  { href: 'https://github.com/clupai8o0', label: 'github', rel: 'me noopener noreferrer', external: true },
  { href: 'https://linkedin.com/in/samridh-limbu', label: 'linkedin', rel: 'me noopener noreferrer', external: true },
  { href: 'https://x.com/clupai8o0', label: 'x', rel: 'me noopener noreferrer', external: true },
  { href: 'https://instagram.com/clupaii', label: 'instagram', rel: 'me noopener noreferrer', external: true },
  { href: 'mailto:samridh@samridhlimbu.com', label: 'email', rel: undefined, external: false },
  { href: '/api/resume', label: 'resume (pdf)', rel: undefined, external: false },
]

const LAST_UPDATED = '2026-10-25'

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // The drawer belongs to the path it was opened on, so navigating closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const menuOpen = menuPath !== null && menuPath === pathname
  const closeMenu = () => setMenuPath(null)
  const hamRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuPath(null)
      // The drawer leaves the DOM, so focus would drop to the body.
      hamRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const current = SECTIONS.find(s => pathname?.startsWith(s.href))
  const others = SECTIONS.filter(s => !pathname?.startsWith(s.href))

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="t2-progress" aria-hidden="true" />
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
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Link
            href="/"
            className="t2-crumb"
            style={{ color: 'var(--muted-2)', textDecoration: 'none', fontWeight: 400 }}
            onClick={closeMenu}
          >
            ~/samridhlimbu
          </Link>
          {current && (
            <Link
              href={current.href}
              className="t2-crumb"
              style={{ color: 'var(--muted-2)', textDecoration: 'none', fontWeight: 400 }}
              onClick={closeMenu}
            >
              /<span style={{ color: 'var(--fg)', fontWeight: 500 }}>{current.label}</span>
            </Link>
          )}
        </div>

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
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open command palette"
            className="t2-key"
            style={{ color: 'var(--muted-2)', fontSize: 12, fontFamily: MONO, cursor: 'pointer' }}
          >
            ⌘K
          </button>
          <Link
            href="/"
            aria-label="Home"
            style={{ color: !current ? 'var(--fg)' : 'var(--muted-2)', textDecoration: 'none', transition: 'color .12s' }}
          >
            /
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamRef}
          className="t2-nav-ham"
          onClick={() => setMenuPath(menuOpen ? null : pathname)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
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
        <button
          type="button"
          className="t2-nav-backdrop"
          aria-label="Close navigation"
          tabIndex={-1}
          onClick={closeMenu}
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            border: 0,
            padding: 0,
            cursor: 'pointer',
            zIndex: 14,
          }}
        />
      )}
      {menuOpen && (
        <div
          className="t2-nav-drawer"
          style={{
            display: 'none',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            // Above the nav, so its touch hit areas never catch a tap on the first row.
            position: 'relative',
            zIndex: 21,
          }}
        >
          {SECTIONS.map(s => {
            const isActive = pathname?.startsWith(s.href)
            return (
              <Link
                key={s.href}
                href={s.href}
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '13px 20px',
                  fontFamily: MONO,
                  fontSize: 12,
                  color: isActive ? 'var(--fg)' : 'var(--muted-2)',
                  textDecoration: 'none',
                  borderLeft: `2px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
                  borderBottom: '1px solid var(--border)',
                  transition: 'color .12s',
                }}
              >
                <span style={{ color: 'var(--accent)', fontSize: 12, flexShrink: 0 }}>›</span>
                {s.label}
                {isActive && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted-2)', letterSpacing: '0.05em' }}>current</span>}
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
              onClick={closeMenu}
              className="t2-crumb"
              style={{ fontFamily: MONO, fontSize: 12, color: 'var(--muted-2)', textDecoration: 'none' }}
            >
              ~/home
            </Link>
            <button
              type="button"
              onClick={() => { closeMenu(); openCommandPalette() }}
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: 'var(--muted-2)',
                background: 'none',
                border: '1px solid var(--border)',
                borderRadius: 2,
                padding: '12px 14px',
                cursor: 'pointer',
              }}
            >
              ❯ search
            </button>
          </div>
        </div>
      )}

      <main key={pathname} id="main" tabIndex={-1} className="t2-main" style={{ flex: 1 }}>
        <PageAnimations />
        {children}
      </main>

      <footer
        className="t2-footer"
        style={{
          borderTop: '1px solid var(--border)',
          fontFamily: MONO,
          fontSize: 12,
          color: 'var(--muted-2)',
        }}
      >
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '20px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px 20px',
        }}>
          <span>samridh limbu · melbourne</span>
          <nav aria-label="Elsewhere" className="t2-footer-links">
            {FOOTER_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                rel={l.rel}
                target={l.external ? '_blank' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span>last updated {LAST_UPDATED}</span>
        </div>
      </footer>
    </div>
  )
}
