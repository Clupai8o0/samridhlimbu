'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SECTIONS = [
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' },
  { href: '/resume', label: 'resume' },
]

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const current = SECTIONS.find(s => pathname?.startsWith(s.href))
  const others = SECTIONS.filter(s => !pathname?.startsWith(s.href))

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        fontSize: 12,
        position: 'relative',
        zIndex: 10,
      }}>
        <Link
          href={current?.href ?? '/'}
          style={{ color: 'var(--muted-2)', textDecoration: 'none', fontWeight: 400 }}
        >
          ~/samridhlimbu
          {current && (
            <>
              <span>/</span>
              <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{current.label}</span>
            </>
          )}
        </Link>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {others.map(s => (
            <Link
              key={s.href}
              href={s.href}
              style={{ color: 'var(--muted-2)', textDecoration: 'none', transition: 'color .12s' }}
            >
              {s.label}
            </Link>
          ))}
          <kbd
            className="t2-key"
            style={{ color: 'var(--muted-2)', fontSize: 10, fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)', cursor: 'pointer' }}
          >
            ⌘K
          </kbd>
          <Link
            href="/"
            style={{
              color: !current ? 'var(--fg)' : 'var(--muted-2)',
              textDecoration: 'none',
              transition: 'color .12s',
            }}
          >
            /
          </Link>
        </div>
      </nav>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}
