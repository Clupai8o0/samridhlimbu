import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'Tempo is a workout app that Claude or ChatGPT can read and log to. One FastAPI service powers the REST API, an OAuth-protected MCP server and the Next.js web app. Live at tempo.clupai.com.'

export const metadata: Metadata = {
  title: 'Tempo · workout app with an MCP server',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/tempo' },
  openGraph: {
    type: 'article',
    url: '/projects/tempo',
    title: 'Tempo · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/tempo/desktop.webp', width: 2400, height: 1500, alt: 'The Tempo home page at tempo.clupai.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tempo · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/tempo/desktop.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'API tests at checkpoint', v: '70' },
  { k: 'live since', v: 'Aug 2026' },
]

const SHAPE: [string, string][] = [
  ['apps/web', 'Next.js 16 on tempo.clupai.com: library, logging, dashboard'],
  ['apps/api', 'FastAPI on api.tempo.clupai.com: REST, /mcp and /oauth'],
  ['services/', 'every capability, written once'],
  ['api/routers/', 'thin REST adapters over services'],
  ['mcp/', 'thin MCP tool adapters over the same services'],
  ['oauth/', 'OAuth sign-in for MCP clients'],
  ['Neon Postgres', 'SQLAlchemy 2.0 async + Alembic migrations'],
]

const DECISIONS = [
  ['one service layer', 'separate REST and MCP logic', 'Every capability lives once in a shared service layer. The REST routers and MCP tools are thin adapters over the same functions, so the web app and Claude never drift apart.'],
  ['an OAuth-protected MCP server', 'a connector anyone can call', 'Claude and ChatGPT connect to the MCP server over OAuth, and people sign in with Google.'],
  ['one Turborepo', 'separate repos per app', 'The Next.js web app and the FastAPI service live in one Turborepo and share one Neon Postgres database.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript']],
  ['Backend', ['FastAPI (Python 3.13)', 'SQLAlchemy 2.0', 'Alembic', 'MCP Python SDK', 'Google OAuth']],
  ['Infra', ['Neon Postgres', 'Vercel', 'Turborepo', 'uv']],
]

export default function TempoPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/tempo
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Tempo</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · web + MCP</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            A workout app that Claude or ChatGPT can read and log to. One FastAPI service powers the REST API, an OAuth-protected MCP server and the Next.js web app, so the chat and the browser always show the same training history.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://tempo.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tempo.clupai.com</a>
            <a href="https://github.com/Clupai8o0/tempo" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> code</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/tempo/desktop.webp"
            alt="The Tempo home page: 'Six months, one honest picture.' under a set of wave lines, with Start training and See the dashboard buttons"
            width={2400}
            height={1500}
            caption="tempo.clupai.com. The web app is one of two front doors to the same data."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Problem */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The problem</div>
          <p style={{ ...PROSE, margin: 0 }}>
            For months I planned my workouts and tracked my progress with Claude, and it was genuinely useful. But every new session lost the context, even inside one project, so my history kept disappearing. I didn&apos;t want another gym app to type sets into. I wanted Claude to have somewhere to keep them.
          </p>
        </div>

        {/* Solution */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The fix</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Tempo is that place. I ask Claude to plan a workout, and Tempo stores it, organises it and tracks it: sessions, sets, personal records and an illustrated exercise library. The same data has two front doors. In the browser it is tempo.clupai.com; inside Claude or ChatGPT it is an MCP connector that signs in over OAuth. Both stay in sync because both call the same Python service.
          </p>
        </div>

        {/* System shape */}
        <div className="section-label" style={{ fontFamily: MONO }}>System shape</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 14, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The rule that holds it together: every capability lives once, in services/. Logging a set from the web app and logging it from Claude run the same function, including personal-record detection.
        </p>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Engineering details</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {DECISIONS.map(([a, b, note]) => (
            <div key={a}>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', marginBottom: 6, lineHeight: 1.5 }}>
                <span style={{ color: GREEN }}>{a}</span>
                <span style={{ color: 'var(--muted)' }}> over </span>
                <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
              </div>
              <div style={{ ...PROSE }}>{note}</div>
            </div>
          ))}
        </div>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/tempo/mobile.webp"
            alt="The Tempo home page on a phone, with the headline, pitch and buttons stacked"
            width={1170}
            height={2532}
            caption="tempo.clupai.com at 390px."
            variant="mobile"
          />
        </div>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', columnGap: 12, rowGap: 2, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://tempo.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tempo.clupai.com</a>
          <a href="https://github.com/Clupai8o0/tempo" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
