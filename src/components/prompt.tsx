import type { ReactNode } from 'react'

export function Prompt({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        fontSize: 10.5,
        color: 'var(--muted-2)',
        letterSpacing: 0.02,
      }}
    >
      <span style={{ color: 'var(--accent)' }}>❯</span> {children}
    </div>
  )
}
