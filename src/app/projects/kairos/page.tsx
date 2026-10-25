import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { CodeBlock } from '@/components/code-block'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'Kairos turns messy notes into tasks and places them on your Google Calendar in under 3 s. A Next.js 16 rewrite of a Python prototype, in daily use, with a pure-function scheduler.'

export const metadata: Metadata = {
  title: 'Kairos · AI scheduling app',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/kairos' },
  openGraph: {
    type: 'article',
    url: '/projects/kairos',
    title: 'Kairos · AI scheduling app · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/kairos/tasks.webp', width: 3024, height: 1722, alt: 'The Kairos task list' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairos · AI scheduling app · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/kairos/tasks.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'
const RED = '#ef4444'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'task placement', v: '<3 s' },
  { k: 'scheduler modules', v: '7' },
  { k: 'file with side effects', v: '1' },
  { k: 'line prototype replaced', v: '7,000+' },
]

const TIMELINE = [
  { date: 'Jul 2025', title: 'First commit', body: 'A Python/FastAPI prototype. Cron with retries, honestly, until an explicit state machine replaced the "run and hope" loop.' },
  { date: 'Jan 2026', title: 'The off-by-one', body: 'About 1 in 120 jobs expired quietly. I wrote the boundary tests I should have written first.', highlight: true },
  { date: 'Feb 2026', title: 'The rewrite', body: 'The largest file hit 1,051 lines. I called the prototype done and started again in Next.js, porting the backend logic as pure functions.' },
  { date: 'Mar–May 2026', title: 'Plugins, themes and chat', body: 'A plugin host with a Zod-validated contract and no LLM imports in core. Theme and plugin marketplaces, an HTTP plugin runtime with HMAC-signed requests, and a chat that can read and write tasks.' },
  { date: 'Oct 2026', title: 'Planner rebuild', body: 'A 14-day planner, check-ins that learn how long tasks really take, goals and habits, and Google Calendar sync.', current: true },
]

const DECISIONS = [
  ['plugin host over hardcoded extraction', 'LLM call in core', 'PluginContext gives every plugin completion calls, config, memory and logging without core importing any provider SDK. A new input source is a plugin, not a core change.'],
  ['schedule-on-write', 'poll-and-schedule', 'Creating a task enqueues a Postgres job straight away, so it is placed in under 3 s with no separate trigger. Idempotency keys stop duplicates when saves race.'],
  ['no-raw-colors ESLint rule', 'style guide doc', 'A custom lint rule bans hex literals and raw Tailwind colours in components. Everything uses semantic tokens, so marketplace themes compile to CSS at install time without a code review.'],
  ['pure-function pipeline', 'side-effectful scheduler', 'runner.ts is the only file that touches the database or Google Calendar. Every other scheduler module is a pure function with full unit coverage and no mocks.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'TypeScript', 'Tailwind v4']],
  ['Backend', ['Drizzle ORM', 'PostgreSQL', 'Better Auth', 'Vercel AI SDK', 'Google Calendar API']],
  ['Infra', ['Vercel']],
]

const BUG_LINES = [
  `<span style="color:#c084fc">def</span> <span style="color:#60a5fa">within_retry_window</span>(jobs, high):`,
  `    <span style="color:#a1a1aa"># bug: j &lt; high - 1 drops the last slot</span>`,
  `    <span style="color:#c084fc">for</span> j <span style="color:#c084fc">in</span> jobs:`,
  `-        <span style="color:#c084fc">if</span> j &lt; high - <span style="color:#fcd34d">1</span>:`,
  `+        <span style="color:#c084fc">if</span> j &lt; high:`,
  `             yield j`,
]

export default function KairosPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/kairos
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Kairos</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · in daily use</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            Paste messy notes and Kairos turns them into tasks and places them on your Google Calendar in under 3 s. I rewrote a 7,000+ line Python prototype as a Next.js 16 app that I use every day. The scheduler is seven pure-function modules, with every side effect in one file.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://kairos.clupai.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> kairos.clupai.com</a>
          </div>
        </div>

        {/* Hero: the app itself */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/kairos/tasks.webp"
            alt="The Kairos task list: tasks with tags, priorities and due dates, filtered by status"
            width={3024}
            height={1722}
            caption="The task list. Tags, priority and due date on every row."
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

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            I got tired of time-blocking tools, so I built my own. Solo, from 2025 to now: I own the design, the scheduling logic, the plugin system and the API. It started as a Python/FastAPI prototype and became a Next.js app once the prototype outgrew itself. The October 2026 rebuild moved it from placing tasks to planning: two weeks at a time, with check-ins that learn how long tasks really take.
          </p>
        </div>

        {/* Landing page shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/kairos/desktop.webp"
            alt="The Kairos landing page at kairos.clupai.com, with a scratchpad of pasted notes beside an auto-scheduled week"
            width={2400}
            height={1500}
            caption="kairos.clupai.com. Pasted notes on the left become scheduled blocks on the right."
          />
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20, borderLeft: '1px solid var(--border)' }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.highlight ? RED : e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: e.highlight ? RED : 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
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

        {/* Docs shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/kairos/docs.webp"
            alt="The Kairos documentation page with guides for building plugins, authoring themes and the REST API"
            width={2400}
            height={1500}
            caption="The docs: building plugins, authoring themes, the REST API and a self-host quick start."
          />
        </div>

        {/* The bug */}
        <div className="section-label" style={{ fontFamily: MONO }}>The off-by-one</div>
        <div style={{ marginBottom: 14 }}>
          <CodeBlock lines={BUG_LINES} filename="retry window fix" lang="py" />
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          About one in 120 scheduled jobs quietly expired instead of running. The state machine made it findable; without it the bug would have read as noise. Since then I write boundary tests before happy-path tests.
        </p>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/kairos/mobile.webp"
            alt="The Kairos landing page on a phone, with the headline, pitch and sign-up buttons stacked"
            width={1170}
            height={2532}
            caption="The landing page at 390px."
            variant="mobile"
          />
        </div>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Write the pure-function pipeline before the HTTP layer, not alongside it. I locked in endpoint shapes early and the scheduler had to work around them. The rewrite fixed the order: runner.ts holds the side effects, and everything else can be tested without a database.
        </p>

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
          <a href="https://kairos.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> kairos.clupai.com</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
