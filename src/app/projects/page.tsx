import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Prompt } from '@/components/prompt'
import { PROJECTS, ARCHIVE } from '@/lib/data'

const DETAIL_PAGES = new Set(['kairos', 'hoddle', 'tapcraft', 'king-glazing', 'nmmun', 'krishnaveni', 'notes-app', 'load-balancer'])

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

export default function ProjectsPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: 0, letterSpacing: -0.02, color: 'var(--fg)' }}>Projects</h1>
          <Prompt>ls -la projects/</Prompt>
        </div>

        {/* Featured */}
        <div className="section-label" style={{ fontFamily: MONO }}>Featured</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 32 }}>
          {PROJECTS.filter(p => p.featured).map(p => (
            <Link
              key={p.slug}
              href={DETAIL_PAGES.has(p.slug) ? `/projects/${p.slug}` : '#'}
              style={{ border: '1px solid var(--border)', padding: 14, cursor: DETAIL_PAGES.has(p.slug) ? 'pointer' : 'default', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'border-color .12s' }}
              onMouseEnter={undefined}
            >
              <div className="placeholder" style={{ height: 90, marginBottom: 10 }}>[ {p.slug} · cover ]</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 13, color: 'var(--fg)' }}>{p.name}</span>
                <span style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)' }}>{p.year}</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>{p.pitchShort}</div>
            </Link>
          ))}
        </div>

        {/* Archive */}
        <div className="section-label" style={{ fontFamily: MONO }}>Archive</div>
        <div style={{ fontFamily: MONO }}>
          <div style={{ display: 'grid', gridTemplateColumns: '55px 130px 1fr 90px', gap: 12, padding: '6px 0', fontSize: 9, color: 'var(--muted-2)', borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: 0.08 }}>
            <span>year</span><span>name</span><span>tech</span><span style={{ textAlign: 'right' }}>link</span>
          </div>
          {ARCHIVE.map((r, i) => (
            <div key={i} className="row-hover" style={{ display: 'grid', gridTemplateColumns: '55px 130px 1fr 90px', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 11, alignItems: 'center' }}>
              <span style={{ color: 'var(--muted-2)', fontSize: 10 }}>{r.year}</span>
              <span style={{ color: 'var(--fg)' }}>{r.name.toLowerCase()}</span>
              <span style={{ color: 'var(--muted)', fontSize: 10.5 }}>{r.tech}</span>
              {r.slug ? (
                <Link href={`/projects/${r.slug}`} style={{ textAlign: 'right', fontSize: 10, color: 'var(--accent)', textDecoration: 'none', display: 'block' }}>view →</Link>
              ) : (
                <span style={{ textAlign: 'right', fontSize: 10, color: (r.link === 'private' || r.link === 'archived') ? 'var(--muted-2)' : 'var(--accent)' }}>{r.link}</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </PageShell>
  )
}
