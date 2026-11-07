import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Prompt } from '@/components/prompt'
import { MatchFlow } from '@/components/match/match-flow'

const DESCRIPTION =
  'Answer four quick questions and see the projects by Samridh Limbu that fit your role, with the reasons each one matches. No email needed.'

export const metadata: Metadata = {
  title: 'Match my work to your role',
  description: DESCRIPTION,
  alternates: { canonical: 'https://samridhlimbu.com/match' },
  // openGraph and twitter replace the layout's objects, so they carry every field.
  openGraph: {
    url: 'https://samridhlimbu.com/match',
    title: 'Match my work to your role · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Samridh Limbu · Software Engineer' }],
  },
  twitter: { card: 'summary_large_image', title: 'Match my work to your role · Samridh Limbu', description: DESCRIPTION, images: ['/og.png'] },
}

const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export default function MatchPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>

        <PageHeader />

        <div data-stagger-item style={{ marginBottom: 14 }}>
          <Prompt>./match.sh</Prompt>
        </div>
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: '-0.02em', color: 'var(--fg)' }}>
            Find the work that fits
          </h1>
        </div>
        <div data-stagger-item style={{ minHeight: 420 }}>
          <Suspense fallback={null}>
            <MatchFlow />
          </Suspense>
        </div>
      </div>
    </PageShell>
  )
}
