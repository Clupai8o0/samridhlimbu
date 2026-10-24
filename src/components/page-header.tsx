'use client'

import { usePathname } from 'next/navigation'
import { Typewriter } from '@/components/typewriter'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'

const STATUS_VERBS = [
  'building',
  'shipping',
  'debugging',
  'designing',
  'reading',
  'iterating',
  'optimizing',
  'crafting',
  'learning',
  'refactoring',
]

/**
 * Consistent page header rendered at the top of every page.
 * Left: green dot + typewriter status verb.
 * Right: samridhlimbu.com[/path] · v0.1
 */
export function PageHeader({ className }: { className?: string }) {
  const pathname = usePathname() ?? '/'
  const suffix = pathname === '/' ? '' : pathname

  return (
    <div
      data-stagger-item
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: MONO,
        fontSize: 12,
        flexWrap: 'wrap',
        gap: '4px 16px',
        color: 'var(--muted-2)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 22,
      }}
    >
      <span>
        <span style={{ color: 'var(--term-green)' }}>●</span>{' '}
        <Typewriter texts={STATUS_VERBS} speed={70} pauseDuration={2400} />
      </span>
      <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <span className={suffix ? 'page-header-host' : undefined}>samridhlimbu.com</span>{suffix} · v0.1
      </span>
    </div>
  )
}
