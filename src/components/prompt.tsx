import type { ReactNode } from 'react'

export function Prompt({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        fontSize: 'var(--text-xs)',
        color: 'var(--muted-2)',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ color: 'var(--accent)' }}>❯</span> {children}
    </div>
  )
}
