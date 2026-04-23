import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: 'Mar 2026', title: 'CTO, day one', body: 'Joined as sole developer and technical co-founder. First decision: reject every third-party auth provider and build on Supabase — one service for auth, database, and RLS.' },
  { date: 'Mar 2026', title: '5-step onboarding wizard', body: 'Mentors and mentees complete role, country, field, and expertise steps before the matching algorithm has enough signal to run. Partial saves persist between steps.' },
  { date: 'Apr 2026', title: 'Weighted matching algorithm', body: 'country_match +30 / field_match +15 / expertise_match +10. Scores computed nightly across all mentor-mentee pairs and cached. Recompute triggered on profile update.' },
  { date: 'Apr 2026', title: 'Token invite system', body: 'Mentor invites use a dedicated token table: email, token hash, created_at, expires_at (14-day), used_at. Every invite action logged for full audit trail.', current: true },
]

const DECISIONS = [
  ['supabase auth + rls', 'custom auth + middleware guards', 'Row Level Security enforces data access at the database layer — not the application layer. A bug in middleware can expose data; a bug in application code cannot bypass RLS.'],
  ['token table for invites', 'magic link via email provider', 'Own the invite lifecycle: custom expiry, revocation, reuse prevention, and audit trail. No dependency on third-party link delivery semantics.'],
  ['nightly recompute', 'on-demand scoring', 'Match scores are read far more often than profiles change. Precomputing nightly keeps API response times low and simplifies the query — just ORDER BY score DESC.'],
  ['claude.md + arch docs', 'ad-hoc onboarding', 'The codebase has a CLAUDE.md and architecture docs so future contributors (or agents) can understand the system without a walkthrough. Agent-driven dev workflow from day one.'],
]

const SCORE_LINES = [
  `<span style="color:#c084fc">func</span> <span style="color:#60a5fa">computeScore</span>(mentor, mentee Profiles) <span style="color:#fcd34d">int</span> {`,
  `    score := <span style="color:#fcd34d">0</span>`,
  `    <span style="color:#c084fc">if</span> mentor.Country == mentee.Country {`,
  `        score += <span style="color:#fcd34d">30</span>  <span style="color:#71717a">// strongest signal</span>`,
  `    }`,
  `    <span style="color:#c084fc">if</span> mentor.Field == mentee.Field {`,
  `        score += <span style="color:#fcd34d">15</span>`,
  `    }`,
  `    <span style="color:#c084fc">if</span> mentor.Expertise == mentee.Expertise {`,
  `        score += <span style="color:#fcd34d">10</span>`,
  `    }`,
  `    <span style="color:#c084fc">return</span> score`,
  `}`,
]

export default function HoddlePage() {
  const hoddle = PROJECTS.find(p => p.slug === 'hoddle')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/hoddle
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Hoddle Melbourne</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · CTO</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            International student mentorship platform. Sole developer — built auth, 5-step onboarding wizard, weighted matching algorithm (country +30 / field +15 / expertise +10) with nightly recompute, and a token-based invite system with full audit trail.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> hoddle.org</a>
            <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            ...(hoddle.metrics ?? []),
            { k: 'invite expiry', v: '14d' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            CTO and sole developer, Mar 2026–present. Hoddle connects international students at Melbourne universities with mentors in their field. I own the full stack — auth, database schema, RLS policies, matching algorithm, and invite system. Architecture docs and a CLAUDE.md are in the repo so future contributors can onboard without a walkthrough.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {DECISIONS.map(([a, b, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: GREEN }}>{a}</span>
                  <span style={{ color: 'var(--muted-2)' }}> › </span>
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Matching algorithm */}
        <div className="section-label" style={{ fontFamily: MONO }}>The matching algorithm</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={SCORE_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Three signals, each independently meaningful. Country is weighted highest because shared migration context matters more than shared field for this user base. Scores are precomputed nightly and cached — matching page loads are just a sorted read.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {Object.entries(hoddle.stack).map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> hoddle.org</a>
          <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
