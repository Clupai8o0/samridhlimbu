import type { Metadata } from 'next'
import { POSTS } from '@/lib/writing'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { WritingClient } from './_components/writing-client'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Essays and postmortems by Samridh Limbu — on the code he ships, the things it breaks, and the thinking underneath.',
  alternates: { canonical: 'https://samridhlimbu.com/writing' },
  openGraph: { url: 'https://samridhlimbu.com/writing', title: 'Writing · Samridh Limbu' },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export default function WritingPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>

        <PageHeader />

        {/* Breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 22, letterSpacing: 0.02 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cat ~/writing/index.md<span className="t2-cursor thin" />
        </div>

        {/* Header */}
        <div data-stagger-item style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: -0.02, color: 'var(--fg)' }}>
            Writing
          </h1>
          <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)' }}>
            {POSTS.length} {POSTS.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div data-reveal>
          <WritingClient posts={POSTS} />
        </div>

      </div>
    </PageShell>
  )
}
