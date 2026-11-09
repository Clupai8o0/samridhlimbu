import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'noop is a small terminal coding agent I built in two days with coding agents, for a DSEC live build competition on a deliberately weak model. Students sign in with a one-time code and get 30 metered instructions. The event was cancelled, so noop has not been used, and it is not deployed.'

const HERO_ALT = 'The noop terminal: an instruction typed and armed, with the note that it spends 1 instruction of 27 left, the instruction and tool meters in the top bar, and an empty preview pane'

export const metadata: Metadata = {
  title: 'noop · a terminal coding agent for a weak model',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/noop' },
  openGraph: {
    type: 'article',
    url: '/projects/noop',
    title: 'noop · a terminal coding agent for a weak model · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/noop/armed.webp', width: 2880, height: 1800, alt: HERO_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'noop · a terminal coding agent for a weak model · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/noop/armed.webp', alt: HERO_ALT }],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'commits in two days', v: '71' },
  { k: 'instructions per student', v: '30' },
  { k: 'parser corpus cases passing', v: '14/14' },
  { k: 'test files', v: '140' },
]

const SHAPE: [string, string][] = [
  ['contracts/', 'the frozen seam: SQL schema, event types, OpenAPI, every student-facing sentence'],
  ['tools/smoke/', 'the go/no-go gate and the tolerant tool-call parser'],
  ['apps/api', 'FastAPI: sign-in, the meter, the agent loop, a resumable event stream'],
  ['apps/web', 'Vite + React 19: the terminal, the judge view and the organiser console'],
  ['packages/runner', 'runs student code in a locked-down container'],
  ['packages/fake-llm', 'a scripted model, so everything is testable with no key'],
]

const DECISIONS = [
  ['a tag the model writes', 'JSON function calling', 'Weak models break JSON when a file body has quotes and newlines in it. A tool call is one XML-like tag with the raw file inside, generation stops at the close tag, and the parser accepts the usual slips: no closing tag, unquoted or single-quoted attributes, a code fence, a stray JSON object.'],
  ['a gate before the harness', 'building first and hoping', 'Before any harness code, a script sends 20 student-style first prompts to the chosen model. It passes only if 18 or more give a valid tool call first time. If not, the plan says switch model or move to native function calling. It ran once, on 6 September, and DeepSeek V3.2 passed 20 of 20 for less than a cent. The harness imports the same parser, so the gate measures what students would get.'],
  ['charge on intent, refund on the model', 'charging per token', 'Sending an instruction costs one. If the turn lands no file write or command, it is refunded and the student is told it was the model, not them. Once it lands real work the instruction is spent. Reads are free, each instruction gets 5 counted tool calls, and the first continue past that is free.'],
  ['the meter in Postgres', 'counting in Python', 'The charge is one guarded UPDATE that cannot go below zero, retries are caught by a unique key, and charge and refund are each at most once per turn. Tests against a real Postgres send twice on one key at once, restart mid-turn and race two sweepers, and check that no instruction is lost or minted.'],
  ['a frozen contract', 'letting lanes agree as they go', 'Six parts were built in parallel by coding agents. The schema, events, API and copy were frozen first. The contract changed twice, which was the budget the plan set.'],
]

const TIMELINE = [
  { date: '6 Sep 2026', title: 'Contract, gate and six lanes', body: 'The contract and the parser came first, and the gate passed 20 of 20 on DeepSeek V3.2. Then auth and metering, the agent loop, the sandbox, the terminal, the mock tools and the judge view were built in parallel and merged. The first whole-stack start found bugs no single part could see, so a whole-stack smoke test was added.' },
  { date: '7 Sep 2026', title: 'Integrated', body: 'The parts were wired into one system, with scoring, the judge view on real data and a gentler start for first-timers. A readiness audit then found nine defects, mostly in the organiser controls and runbook, such as a +5 button that granted 1. Each was fixed with a test.' },
  { date: '9 Sep 2026', title: 'Event cancelled', body: 'The Agentic Games was cancelled before it ran, so no student has used noop and the full agent loop has never run against the real model. It is not deployed.' },
  { date: 'Now', title: 'A club project', body: 'The build carries on as a DSEC project for next year.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Vite 6', 'React 19', 'TypeScript', 'zustand', 'CodeMirror', 'MSW']],
  ['Backend', ['FastAPI (Python 3.12)', 'asyncpg', 'Postgres 16', 'LiteLLM']],
  ['Infra', ['Docker Compose', 'Caddy', 'Playwright', 'pytest', 'Vitest']],
]

export default function NoopPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>
        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/noop
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>noop</h1>
            <span className="pill" style={{ fontFamily: MONO }}>○ not deployed · DSEC club project</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A small terminal coding agent, in the style of Claude Code, built for DSEC&apos;s Agentic Games: a planned 60-minute live build competition on a deliberately weak open model, DeepSeek V3.2. Students sign in with a one-time code from a paper slip, with no API keys, and get 30 instructions to build one small thing.
          </p>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/noop/armed.webp"
            alt={HERO_ALT}
            width={2880}
            height={1800}
            caption="The first Enter arms an instruction and shows what it will cost. The second sends it. All screens are from a local demo with made-up data and no model connected, so no model output is shown."
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
            The event tested how well students could drive a coding agent. So it used a cheap, weak model, a fixed budget per student and a room of up to 60 students on campus wifi, many of them new to agents. A weak model fumbles tool calls, and every fumble that costs a student an instruction feels unfair. The hard part was making the model usable and the meter trusted.
          </p>
        </div>

        {/* Walkthrough clip */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/noop/demo.mp4"
              poster="/projects/noop/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Signing in with an entry code, opening the free /help card, then typing a first instruction"
              style={{ width: '100%', height: 'auto', aspectRatio: '1440 / 900', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', margin: '10px 0 0', lineHeight: 1.6 }}>
            Sign in with a code, open the free /help card, type a first instruction. It stops before sending, because there is no model behind the demo.
          </p>
        </div>

        {/* How it works */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it works</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The student types in a terminal on the left and watches the build in a sandboxed preview on the right. The server runs each turn as a job and streams events the page can resume after a dropped connection. Every prompt, reply and file change is logged, because the judges score the build story as well as the result.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 140, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/noop/help.webp"
            alt="The /help card: a table of slash commands all marked free, anything else marked 1 instruction, and four rules on how instructions are charged and refunded"
            width={2880}
            height={1800}
            caption="Slash commands are free. The card spells out the charging rules in the same words the server enforces."
          />
        </div>

        {/* Decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {DECISIONS.map(([pick, over, why]) => (
            <div key={pick}>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-sm)', color: 'var(--fg)', marginBottom: 6 }}>
                <span style={{ color: 'var(--accent)' }}>{pick}</span>{' '}
                <span style={{ color: 'var(--muted)' }}>over</span>{' '}
                <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{over}</span>
              </div>
              <p style={{ ...PROSE, fontSize: 'var(--text-sm)', color: 'var(--muted)', margin: 0 }}>{why}</p>
            </div>
          ))}
        </div>

        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/noop/admin.webp"
            alt="The organiser console in sample mode: running turns, refunds, model latency, cache hits, failures and spend against a $1.50 cap, phase buttons, a stop-all switch, a fallback model switch, and two entrants with +5 top-up buttons"
            width={2880}
            height={1800}
            caption="The organiser console, reading its built-in sample log. Its banner says every number here is made up."
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
            src="/projects/noop/login.webp"
            alt="The sign-in screen on a phone: an entry code field, a rookie or open bracket choice, a plain note on what is recorded and where prompts are sent, and a start button"
            width={1170}
            height={2532}
            caption="Sign-in asks for the code on the slip and a bracket, nothing else. The note says plainly what is logged and where prompts go."
            variant="mobile"
          />
        </div>

        {/* What is left */}
        <div className="section-label" style={{ fontFamily: MONO }}>What is left</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The gate only checked the first tool call. Whether a whole instruction reaches working code within 5 tool calls has not been tested on the real model, because the key was never wired through the proxy into the full stack. None of the six outage drills have been run. The parser corpus has 14 hand-written cases, and the plan asks for at least 30.
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
          <Link href="/writing/noop-weak-model-timed-event" className="btn" style={{ fontFamily: MONO }}>read the write-up</Link>
          <Link href="/projects/dsec" className="btn" style={{ fontFamily: MONO }}>DSEC</Link>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
