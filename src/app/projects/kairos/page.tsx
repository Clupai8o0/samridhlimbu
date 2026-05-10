import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
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
  { date: 'Feb 2026', title: 'Full rewrite decision', body: 'Largest file hit 1,051 lines. Declared prototype done, started clean Next.js monorepo. Backend logic ported as pure functions.' },
  { date: 'Mar 2026', title: 'Plugin system · Phase 3', body: 'Zod-validated plugin I/O contract. PluginContext abstraction. Core has zero LLM dependencies — all provider calls route through lib/llm/.' },
  { date: 'Apr 2026', title: 'Marketplaces · Phase 4', body: 'Theme + plugin marketplaces shipped. HTTP plugin runtime: HMAC-signed requests, 5 s timeout, circuit breaker. Install-without-redeploy on the hosted instance.' },
  { date: 'Apr 2026', title: 'Chat · Phase 5c', body: 'Session-scoped chat with streaming tokens. LLM can read and write tasks, query the schedule, manage collections. Tool calls render inline with collapsible output blocks.' },
  { date: 'May 2026', title: 'Collections · Phase 5d', body: 'Coordination layer above tags: ordered phases, bulk-schedule, progress endpoint. Added backlog + blocked task states. v1.0.0 tag pending.', current: true },
]

const DECISIONS = [
  ['plugin host over hardcoded extraction', 'LLM call in core', 'PluginContext gives every plugin complete/completeStructured, config, memory, and logging — without core importing any provider SDK. Adding a new input source is a PR to the public registry, not a core change. 10 plugins shipped at launch.'],
  ['schedule-on-write', 'poll-and-schedule', 'Creating a task enqueues a Postgres job immediately — placement completes in 1–3 s within the same Vercel function call. No separate trigger, no user action. Idempotency keys prevent duplicates under concurrent saves.'],
  ['no-raw-colors ESLint rule', 'style guide doc', 'A custom ESLint rule bans hex literals and raw Tailwind colour utilities in component files. All components reference semantic tokens (--color-accent, --color-surface, etc.). Theme marketplace themes compile to CSS at install time — safe without code review.'],
  ['pure-function pipeline', 'side-effectful scheduler', 'runner.ts is the only file with DB or Google Calendar side effects. Every other module in lib/scheduler/ is a pure function — full unit coverage with no mocks and no database connection required.'],
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
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · next.js monorepo</span>
            <span style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', border: '1px dashed var(--border)', padding: '2px 6px', letterSpacing: 0.04 }}>updating</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Scheduling that reads intent. Paste unstructured notes — Kairos extracts tasks and places them into Google Calendar automatically. Rewrote a 1,051-line Python prototype into a clean Next.js monorepo: pure-function scheduler pipeline, plugin host with zero LLM imports in core, HTTP plugin runtime, theme marketplace enforced by CI, and a session-scoped LLM chat that can read and write your entire task graph.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <a href="https://kairos.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> kairos.clupai.com</a>
            <a href="https://github.com/clupai8o0/kairos" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
          </div>
        </div>

        {/* Hero media */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <video
            src="/projects/kairos/kairos-demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {kairos.metrics!.map((m, i) => (
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
            Solo, 2025–ongoing. I own design, scheduling logic, plugin system, API surface, and all five shipped phases. The core problem: a scheduling tool that understands context — deadlines, dependencies, preferred working windows — instead of just storing a list. Started as a Python/FastAPI prototype, rewrote everything once the file hit 1,051 lines. Phase 5d (Collections) shipped May 2026; v1.0.0 tag pending.
          </p>
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
          Write the pure-function pipeline before the HTTP layer, not alongside it. I pinned myself into endpoint shapes early that the scheduler had to work around. The rewrite enforces the discipline: runner.ts is the only file with side effects — everything else is a pure function you can test without a database.
        </p>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <a href="https://kairos.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> kairos.clupai.com</a>
          <a href="https://github.com/clupai8o0/kairos" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
