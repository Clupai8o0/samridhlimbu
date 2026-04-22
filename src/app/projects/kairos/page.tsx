import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Prompt } from '@/components/prompt'
import { CodeBlock } from '@/components/code-block'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'
const RED = '#ef4444'

const TIMELINE = [
  { date: 'Jul 2025', title: 'First commit', body: 'Sketch of a cron alternative. Just cron with retries, honestly.' },
  { date: 'Aug 2025', title: 'State machine', body: 'Replaced the "run and hope" loop with an explicit FSM. Everything downstream cleaner.' },
  { date: 'Oct 2025', title: 'Postgres over Redis', body: 'Migrated off Redis queues. Advisory locks, single source of truth.' },
  { date: 'Jan 2026', title: 'The off-by-one', body: '1 in ~120 jobs expired quietly. Wrote the boundary tests I should have written first.', highlight: true },
  { date: 'Mar 2026', title: 'Frontend rewrite', body: 'Started Next.js 16 frontend from scratch. Backend stays.' },
  { date: 'Apr 2026', title: 'Current', body: 'p95 38ms, 84% coverage, 99.96% uptime. Quiet.', current: true },
]

const DECISIONS = [
  ['state machine', 'cron', 'A scheduler that "mostly runs" but silently drops events is worse than one that halts loudly. The FSM made failure modes enumerable.'],
  ['postgres + advisory locks', 'redis queues', 'Single source of truth beats 2× throughput at my scale. Transactions were worth keeping.'],
  ['fastapi', 'django', '~40 endpoints, Pydantic for free contract tests, no admin needed.'],
  ['rewrite frontend', 'rewrite everything', 'The bugs are in the UI contract, not the scheduling logic. Rewriting both would have been a different project.'],
]

const BUG_LINES = [
  `<span style="color:#c084fc">def</span> <span style="color:#60a5fa">within_retry_window</span>(jobs, high):`,
  `    <span style="color:#71717a"># bug: j &lt; high - 1 drops the last slot</span>`,
  `    <span style="color:#c084fc">for</span> j <span style="color:#c084fc">in</span> jobs:`,
  `-        <span style="color:#c084fc">if</span> j &lt; high - <span style="color:#fcd34d">1</span>:`,
  `+        <span style="color:#c084fc">if</span> j &lt; high:`,
  `             yield j`,
]

export default function KairosPage() {
  const kairos = PROJECTS.find(p => p.slug === 'kairos')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd projects/<Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>kairos</Link>
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Kairos</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● in rewrite</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Scheduling that reads intent. FastAPI backend with a state-machine core, now rewriting the frontend from scratch in Next.js 16.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <a href="#" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="play" size={11} /> demo</a>
            <a href="https://github.com/samridhlimbu/kairos" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
            <a href="#" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> kairos.dev</a>
          </div>
        </div>

        {/* Video placeholder */}
        <div style={{ border: '1px solid var(--border)', background: '#0a0a0c', aspectRatio: '16 / 9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: 8, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, #0c0c0e 0 8px, #101014 8px 16px)', opacity: 0.4 }} />
          <div style={{ position: 'relative', width: 56, height: 56, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 6px rgba(99,102,241,0.2)' }}>
            <Icon name="play" size={22} />
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 14, fontFamily: MONO, fontSize: 9.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.08 }}>loom · 00:22 · walkthrough</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginBottom: 28, letterSpacing: 0.08, textTransform: 'uppercase' }}>fig. 01 — 20s demo</div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {kairos.metrics!.map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          Solo, open source, 2025–ongoing (9 months active). I own design, backend, and API surface. The core problem: writing a scheduler that fails loudly instead of dropping events.
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.highlight ? RED : e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: e.highlight ? RED : 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Screenshot grid */}
        <div className="section-label" style={{ fontFamily: MONO }}>Screenshots</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '140px 140px', gap: 10, marginBottom: 8 }}>
          <div className="placeholder" style={{ gridRow: 'span 2', height: '100%' }}>[ dashboard · main view ]</div>
          <div className="placeholder">[ job detail ]</div>
          <div className="placeholder">[ fsm diagram ]</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginBottom: 28, letterSpacing: 0.08, textTransform: 'uppercase' }}>fig. 02 — ui + state machine</div>

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

        {/* The bug */}
        <div className="section-label" style={{ fontFamily: MONO }}>The off-by-one</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={BUG_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          One in ~120 scheduled jobs quietly expired instead of running. Lesson: write boundary tests before happy-path tests. The FSM made this findable; without it the bug would&apos;ve read as noise.
        </p>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
          Write the state machine before the HTTP layer, not alongside it. I pinned myself into endpoint shapes early that the FSM had to work around — the rewrite undoes most of that.
        </p>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <a href="#" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> kairos.dev</a>
          <a href="https://github.com/samridhlimbu/kairos" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
