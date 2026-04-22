'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/about', label: 'about' },
  { href: '/projects', label: 'projects' },
  { href: '/writing', label: 'writing' },
  { href: '/resume', label: 'resume' },
]

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
        <Link href="/" style={{ color: 'var(--fg)', textDecoration: 'none', fontWeight: 500 }}>
          samridh<span style={{ color: 'var(--accent)' }}>·</span>limbu
        </Link>
        <div style={{ display: 'flex', gap: 28 }}>
          {NAV.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: pathname?.startsWith(l.href) ? 'var(--fg)' : 'var(--muted-2)',
                textDecoration: 'none',
                transition: 'color .12s',
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  )
}
