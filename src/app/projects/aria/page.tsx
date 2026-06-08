import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'
const AMBER = '#f59e0b'

const AGENTS = [
  ['Forecasting', 'Reads the day\'s price and weather, sees the peak ahead, and plans every other agent backward from it.'],
  ['Trading', 'Decides when to import, hold, or export — selling stored power into the spike, buying when it\'s cheap.'],
  ['HVAC / automation', 'Treats the building as a thermal battery — pre-cools, then coasts through the expensive window on stored cold.'],
  ['Grid monitoring', 'Watches for anomalies: prices outside the expected range flip the system out of nominal.'],
  ['Neighbourhood', 'Clears peer-to-peer trades across the street — 10 selling → 2 buying — so energy stays local instead of hitting the grid.'],
  ['Orchestrator', 'Coordinates the five specialists toward a day credit and surfaces a plain-English reason for every call. Nothing hidden.'],
]

const DECISIONS = [
  [
    'one unified TypeScript app',
    'separate microservices per agent',
    'Every agent, the battery plan, the HVAC thermal model, and the 12-home swarm live in one Next.js app and recompute together. For a system that has to stay coherent across agents, simplicity and robustness beat modularity — there are no network hops to fail mid-decision.',
  ],
  [
    'ReAct loop with plain-English traces',
    'opaque optimiser',
    'Every agent reasons then acts, and writes down why. The dashboard shows "what ARIA is doing now" as a sentence, not a number. A home-energy system people will trust has to explain itself — the explanation is a first-class output, not an afterthought.',
  ],
  [
    'client-side recompute',
    'server round-trip per slider',
    'The Sandbox runs the whole engine in the browser. Drag solar size, battery capacity, or charge-at-midnight and all six agents plus the swarm re-run end-to-end with no network — the model is fast and transparent enough to live entirely client-side.',
  ],
  [
    'seed-cache fallback',
    'hard dependency on live feeds',
    'Live AEMO prices, Google Solar, and BOM weather drive the system, but a recorded "seed cache" backs every source. If a feed dies the demo still runs on real recorded data — reliability over freshness when the network is the weak link.',
  ],
]

export default function AriaPage() {
  const project = PROJECTS.find(p => p.slug === 'aria')!

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/aria
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>ARIA</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(245,158,11,0.3)', fontFamily: MONO }}>● open source · multi-agent</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Autonomous Residential Intelligence Agent. Millions of home batteries, one coordinated brain. A hierarchical multi-agent system that runs a home&apos;s energy autonomously — reading live AEMO prices, scheduling the battery, shifting load, watching the grid, and trading spare power with the street — and explains every decision in plain English.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/aria" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> Clupai8o0/aria</a>
          </div>
        </div>

        {/* Hero image — drop dashboard.png into public/projects/aria/ */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <img src="/projects/aria/dashboard.png" alt="ARIA home dashboard" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {project.metrics!.map((m, i) => (
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
            Australia is heading toward millions of home batteries with no coordination layer — each one optimising in isolation, blind to the grid and to its neighbours. ARIA is the answer to &ldquo;what if they shared a brain?&rdquo; It was backtested against the real 13 February 2024 AEMO VIC1 market-price-cap day. A single managed home charged overnight and discharged into the $16.60/kWh spike to net roughly $120 in credit — about $61 ahead of an unmanaged solar-only home. Scaled to a 12-home neighbourhood, direct peer-to-peer trading cut peak draw 100% and beat solo operation 94% of the time. Every number on the dashboard is a real settled outcome, not a projection.
          </p>
        </div>

        {/* The six agents */}
        <div className="section-label" style={{ fontFamily: MONO }}>The six agents</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {AGENTS.map(([name, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11.5, color: GREEN, marginBottom: 4 }}>{name}</div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Sandbox image — drop sandbox.png into public/projects/aria/ */}
        <div className="section-label" style={{ fontFamily: MONO }}>The sandbox</div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 12 }}>
          The whole engine runs live in the browser. Drag any slider — solar array, battery capacity, HVAC thermal mass, charge-at-midnight — and ARIA re-runs end to end: the six agents, the battery plan, the thermal model, and the 12-home swarm, all recomputed from your inputs with no network. Scrub the clock to step through the day.
        </p>
        <div style={{ marginBottom: 18, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <img src="/projects/aria/sandbox.png" alt="ARIA sandbox — six agents recomputing live" style={{ width: '100%', display: 'block' }} />
        </div>
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <img src="/projects/aria/swarm.png" alt="ARIA neighbourhood swarm — peer-to-peer trades clearing" style={{ width: '100%', display: 'block' }} />
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

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'App', items: 'Next.js · React · TypeScript · IBM Carbon design system' },
            { label: 'Agents', items: 'Claude (primary) or OpenAI · ReAct reason-and-act loop' },
            { label: 'Forecast', items: 'Chronos-2 (optional upgrade)' },
            { label: 'Data', items: 'AEMO prices · Google Solar API · BOM weather · seed-cache fallback' },
            { label: 'Deploy', items: 'Vercel' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/Clupai8o0/aria" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
