import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Prompt } from '@/components/prompt'
import { PROJECTS, ARCHIVE } from '@/lib/data'
import { ProjectCard } from './_components/project-card'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Projects by Samridh Limbu, a software engineer in Melbourne: Hoddle, Kairos, ARIA, R1GPT, the DSEC club platform, Tempo, and client sites for King Double Glazing and Krishnaveni.',
  alternates: { canonical: 'https://samridhlimbu.com/projects' },
  openGraph: { url: 'https://samridhlimbu.com/projects', title: 'Projects · Samridh Limbu' },
}

const DETAIL_PAGES = new Set([
  'hoddle', 'kairos', 'aria', 'r1gpt', 'dsec', 'tempo', 'king-glazing', 'allarkive',
  'acknowledgement-force', 'krishnaveni', 'nmmun', 'tapcraft', 'notes-app', 'load-balancer', 'lock-in',
])

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export default function ProjectsPage() {
  const featured = PROJECTS.filter(p => p.featured)

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>

        <PageHeader />

        {/* Header */}
        <div data-stagger-item style={{ marginBottom: 14 }}>
          <Prompt>ls -la projects/</Prompt>
        </div>
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: '-0.02em', color: 'var(--fg)' }}>Projects</h1>
        </div>

        {/* Featured. The grid follows a .section-label, so PageAnimations
            stagger-reveals its children; each card sits in its own wrapper so
            the reveal styles never overwrite the card's hover transition. */}
        <div className="section-label" style={{ fontFamily: MONO }}>Featured</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, marginBottom: 40 }}>
          {featured.map((p, i) => (
            <div key={p.slug}>
              <ProjectCard
                project={p}
                hasDetailPage={DETAIL_PAGES.has(p.slug)}
                preload={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Archive */}
        <div className="section-label" style={{ fontFamily: MONO }}>Archive</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}>
          <div className="t2-archive-grid" style={{ display: 'grid', gap: 12, padding: '6px 0', color: 'var(--muted-2)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <span className="t2-archive-year">year</span><span>name</span><span className="t2-archive-tech">tech</span><span style={{ textAlign: 'right' }}>link</span>
          </div>
          {ARCHIVE.map(r => (
            <div key={r.name} className={`t2-archive-grid row-hover${r.slug ? ' row-link' : ''}`} style={{ display: 'grid', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <span className="t2-archive-year" style={{ color: 'var(--muted-2)', fontVariantNumeric: 'tabular-nums' }}>{r.year}</span>
              <span style={{ color: 'var(--fg)' }}>{r.name.toLowerCase()}</span>
              <span className="t2-archive-tech" style={{ color: 'var(--muted)' }}>{r.tech}</span>
              {r.slug ? (
                <Link href={`/projects/${r.slug}`} style={{ textAlign: 'right', color: 'var(--accent)', textDecoration: 'none', display: 'block' }}>view →</Link>
              ) : (
                <span style={{ textAlign: 'right', color: 'var(--muted-2)' }}>{r.link}</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
