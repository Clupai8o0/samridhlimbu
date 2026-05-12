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
export function PageHeader() {
  const pathname = usePathname() ?? '/'
  const suffix = pathname === '/' ? '' : pathname

  return (
    <div
      data-stagger-item
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: MONO,
        fontSize: 10,
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
      <span>samridhlimbu.com{suffix} · v0.1</span>
    </div>
  )
}
