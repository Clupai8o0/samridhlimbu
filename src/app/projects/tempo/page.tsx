import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'Tempo is a workout app that Claude can read and log to. A FastAPI service runs the REST API and an OAuth-protected MCP server behind the Next.js web app. Live at tempo.clupai.com since August 2026.'

export const metadata: Metadata = {
  title: 'Tempo · workout app with an MCP server',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/tempo' },
  openGraph: {
    type: 'article',
    url: '/projects/tempo',
    title: 'Tempo · workout app with an MCP server · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/tempo/dashboard.webp', width: 2880, height: 1800, alt: 'The Tempo home screen with the last seven days, latest record, top skill, volume and frequency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tempo · workout app with an MCP server · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/tempo/dashboard.webp', alt: 'The Tempo home screen with the last seven days, latest record, top skill, volume and frequency' }],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'API tests passing', v: '353' },
  { k: 'MCP tools', v: '40' },
  { k: 'REST endpoints', v: '46' },
  { k: 'exercises in the library', v: '873' },
]

const SHAPE: [string, string][] = [
  ['apps/web', 'Next.js 16 on tempo.clupai.com: home, library, logging, progress'],
  ['apps/api', 'FastAPI on api.tempo.clupai.com: REST, /mcp and /oauth'],
  ['services/', 'every capability, written once'],
  ['api/routers/', '46 REST endpoints, each a thin call into services'],
  ['mcp/server.py', '40 MCP tools, each a thin call into the same services'],
  ['oauth/', 'the OAuth 2.1 server; people sign in with Google'],
  ['Neon Postgres', 'SQLAlchemy 2.0 async, 8 Alembic migrations'],
]

const DECISIONS = [
  ['one service layer', 'keeping the old TypeScript MCP server', 'The first version was a separate MCP server, so any web app would have meant writing the logic twice. Now REST and MCP call the same Python functions, and two kinds of test keep it that way: one fails if a router or MCP tool touches the database itself, and contract tests check that the main MCP read tools return exactly what their REST endpoints do.'],
  ['my own OAuth server', 'a managed auth provider', 'Claude connects to the MCP server over OAuth, so Tempo runs its own OAuth 2.1 server in FastAPI. Google handles the sign-in itself, and Tempo stores no passwords. The server uses PKCE, keeps tokens only as keyed hashes, and rotates refresh tokens; reusing an old one revokes the whole chain.'],
  ['a separate table for plans', 'a "planned" flag on logged sets', 'Volume, tonnage and record detection never read planned sets, so a plan cannot count as training until it is done. Frequency counts sessions, so it is the one query that has to skip a session that only holds a plan, and it does so explicitly. That query is also the one that failed on 7 August.'],
  ['retry-safe writes', 'trusting every request to arrive once', 'Early on, a repeated call left two identical sessions dated 1 May. Logging calls now take a client key, and a retry with the same key returns the original record instead of writing it twice.'],
  ['an offline queue in the app', 'Background Sync', 'Sets logged without signal wait in an IndexedDB queue and send when the browser comes back online. The browser\'s Background Sync API could have done this, but Safari and Firefox do not support it.'],
]

const TIMELINE = [
  { date: 'Apr–May 2026', title: 'First version', body: 'A TypeScript MCP server on Supabase, so Claude could save workouts. It is archived in the repo under legacy/.' },
  { date: '22–23 Jul 2026', title: 'Rebuild', body: 'I wrote the plan first in docs/, then built it one phase per branch with coding agents (Claude and Codex): the monorepo, the data model, the services and REST API, the OAuth server, the MCP server, then the library, logging and dashboard.' },
  { date: '31 Jul–2 Aug 2026', title: 'Phone-first and live', body: 'Bottom tabs and a docked session bar, home as the dashboard, manual records, corrections and a performance pass. Live at tempo.clupai.com from 1 August.' },
  { date: '7 Aug 2026', title: 'Planning a workout ahead', body: 'The API and MCP tools for planning shipped. The web planning screens are half built in seven local commits that have not been pushed, so the live site does not have them yet.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'CSS Modules', 'Motion', 'PWA']],
  ['Backend', ['FastAPI (Python 3.13)', 'SQLAlchemy 2.0', 'Alembic', 'MCP Python SDK', 'Authlib', 'Google sign-in', 'OpenAI image API']],
  ['Infra', ['Neon Postgres', 'Vercel', 'Vercel Blob', 'Turborepo', 'pnpm', 'uv']],
]

export default function TempoPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/tempo
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Tempo</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · web + MCP</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            A workout app that Claude can read and log to. One FastAPI service runs the REST API, an MCP server behind its own OAuth sign-in, and the Next.js web app, so the chat and the browser show the same training history.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://tempo.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tempo.clupai.com</a>
            <a href="https://github.com/Clupai8o0/tempo" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> code</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/tempo/dashboard.webp"
            alt="The Tempo home screen in dark mode: Hey, Sam; no workout in progress; last 7 days with 4 sessions, 22,066 kg, 53 sets and 6 PRs; latest PR Seated Cable Rows 65 kg; top skill Handstand Push-Up at 55%; volume by movement and a 13-week frequency strip"
            width={2880}
            height={1800}
            caption="Home: the last seven days, the latest record, a skill in progress, volume and frequency. All screenshots are from a local demo account with seeded data, on my local build of 7 August, which has seven commits more than the live site."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
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
            For months I planned my workouts with Claude and tracked progress there too. It worked, but every new chat lost the history, even inside one project. I didn&apos;t want another gym app to type sets into. I wanted Claude to have somewhere to keep them.
          </p>
        </div>

        {/* How it works */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it works</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Tempo has two front doors to the same data. In the browser it is tempo.clupai.com. Inside Claude it is a custom connector that signs in over OAuth. Logging a set from either one runs the same function, record detection included. The library imports 873 exercises from the open free-exercise-db dataset, and a batch script can draw line-art for them with OpenAI&apos;s image model.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Session shot */}
        <div data-reveal style={{ maxWidth: 560, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/tempo/session.webp"
            alt="Yesterday's Upper B workout: Barbell Curl with three sets of 30 kg for 10, 9 and 8 reps, a set-entry pad with weight 30 and reps 8 and a Log set 4 button"
            width={1620}
            height={1355}
            caption="A logged workout. Each movement keeps its sets, and the pad underneath logs the next one."
          />
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
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

        {/* Connector shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/tempo/connector.webp"
            alt="The Connected apps section of Settings: an Add Tempo to Claude card with the MCP URL, a Copy URL button and three steps to add it as a custom connector and sign in with Google"
            width={1580}
            height={775}
            caption="Settings shows the URL and steps for adding Tempo to Claude. In the local copy the URL points at localhost."
          />
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/tempo/log-mobile.webp"
            alt="The Log tab on a phone: Start training with a name field and Start workout button, an Upcoming card for Lower B on Saturday 31 October, a Plan a workout button, and recent workouts"
            width={1170}
            height={2532}
            caption="The Log tab on a phone. The Upcoming card is from the half-built planning screens, which are not on the live site yet."
            variant="mobile"
          />
        </div>

        {/* What went wrong */}
        <div className="section-label" style={{ fontFamily: MONO }}>What went wrong</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          On 7 August I pushed the planning API before its database migration, thinking a push did not deploy. It did. One dashboard endpoint returned errors for about an hour, until I rolled back, ran the migration and promoted the same build again. No data was lost, and the rule now sits in the repo: migrate first, then push. Next is finishing the planning screens so they can go live.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://tempo.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tempo.clupai.com</a>
          <a href="https://github.com/Clupai8o0/tempo" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
