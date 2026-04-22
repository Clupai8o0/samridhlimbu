import { PageShell } from '@/components/page-shell'
import { POSTS } from '@/lib/writing'
import { WritingClient } from './_components/writing-client'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export default function WritingPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 22, letterSpacing: 0.02 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cat ~/writing/index.md<span className="t2-cursor thin" />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 48, margin: '0 0 10px', letterSpacing: -0.025, color: 'var(--fg)', lineHeight: 1.1 }}>
              Writing<span style={{ color: 'var(--accent)' }}>.</span>
            </h1>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: 'var(--fg-dim)', lineHeight: 1.6, maxWidth: 460, margin: 0 }}>
              Essays and postmortems on the code I ship, the things it breaks, and the thinking underneath.
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 24, paddingTop: 4 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted)', marginBottom: 5 }}>
              {POSTS.length} entries
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', display: 'flex', gap: 5, justifyContent: 'flex-end', alignItems: 'center' }}>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>rss</a>
              <span>·</span>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>atom</a>
              <span>·</span>
              <a href="#" style={{ color: 'var(--muted)', textDecoration: 'none' }}>feed</a>
            </div>
          </div>
        </div>

        <WritingClient posts={POSTS} />

      </div>
    </PageShell>
  )
}
