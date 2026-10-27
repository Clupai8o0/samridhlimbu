import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'ARIA is a hackathon prototype that runs a home battery and a street of 12 homes against real AEMO prices. On the 13 Feb 2024 price-cap day, the simulated home ends $120 in credit, $61 ahead of the same roof with no battery.'

export const metadata: Metadata = {
  title: 'ARIA · home energy simulator',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/aria' },
  openGraph: {
    type: 'article',
    url: '/projects/aria',
    title: 'ARIA · home energy simulator · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/aria/sandbox.webp', width: 2880, height: 1750, alt: 'The ARIA sandbox on the 13 Feb 2024 heatwave day: sliders for the home, six agent cards and a battery plan ending in a $120.43 credit' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARIA · home energy simulator · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/aria/sandbox.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'one home, cap day', v: '+$120' },
  { k: 'street vs solo', v: '$90' },
  { k: 'unit tests', v: '32' },
]

const AGENTS: [string, string][] = [
  ['forecasting', 'finds the day\'s price peak so the rest can plan back from it'],
  ['trading', 'charge, hold, discharge or export, every 30 minutes'],
  ['automation', 'pre-cools the house, then lets the AC coast through the peak'],
  ['grid', 'flags prices outside the market cap or floor, and sudden jumps'],
  ['neighbourhood', 'turns the home\'s plan into a bid or ask for the street'],
  ['orchestrator', 'combines the five and writes one sentence on what it is doing'],
]

const DECISIONS = [
  ['rules decide, a model only words it', 'letting a model trade', 'Every agent is plain TypeScript. A language model, if a key is set, only rephrases the orchestrator\'s one-line summary, with a 6 second timeout and a fixed template as the fallback. With no key the app gives the same decisions, worded by the template. The screenshots here ran that way.'],
  ['a real recorded day', 'a made-up price curve', 'The heatwave scenario plays back AEMO\'s settlement prices for Victoria on 13 Feb 2024, when the market hit its price cap. The 288 five-minute prices are averaged into 48 half-hours, and the negative midday prices are kept, so the battery is paid to charge.'],
  ['measured savings', 'quoted savings', 'Each number comes from running the same homes through the same day twice. One home is run with foresight and then without a battery. The street is run with every home alone and then trading with each other. The saving is the difference between the two runs.'],
  ['one uniform clearing price', 'pairwise deals', 'The street market is a double auction. Each home\'s bid or ask is the value of a stored kWh from its own plan, and every matched trade in a half-hour settles at one price: halfway between the last matched ask and bid.'],
  ['the house as a battery', 'a fixed AC load', 'Cooling uses a simple thermal model of the building. ARIA runs the AC hard on cheap power before the peak, then turns it off and lets the room warm slowly, staying inside a comfort band.'],
]

const STACK: [string, string[]][] = [
  ['App', ['Next.js 15', 'React 19', 'TypeScript', 'IBM Carbon-style CSS']],
  ['Data', ['AEMO VIC1 prices (recorded day, optional live price)', 'a saved Google Solar result']],
  ['Optional', ['Anthropic or OpenAI SDK for wording']],
  ['Tooling', ['Vitest']],
]

export default function AriaPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/aria
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>ARIA</h1>
            <span className="pill" style={{ fontFamily: MONO }}>hackathon prototype · jun 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A simulator for home batteries that work together. Six small agents run one home against real Victorian wholesale prices: when to charge, when to sell, when to pre-cool the house. Then twelve homes on one street trade spare power with each other before buying from the grid.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/aria/sandbox.webp"
            alt="The ARIA sandbox on the heatwave day at 13:30: sliders for solar, battery, consumption and AC, six agent cards, and a battery plan showing a $120.43 day credit, $61.20 ahead of no battery and 60% self-sufficient"
            width={2880}
            height={1750}
            caption="The sandbox on the 13 Feb 2024 price-cap day. Moving a slider re-runs the whole day in the browser. All screenshots are from the app running locally on its recorded day, with no AI key set."
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

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Built in a team of six at Watt The Hack 2026, an energy AI hackathon in Melbourne, in June 2026. It was one of two ideas the team built; the other was <Link href="/projects/r1gpt" style={{ color: 'var(--accent)' }}>R1GPT</Link>. Home batteries already save money on their own. ARIA asks what a street of them could do if they planned together. Work stopped after the event, and it has never run a real home.
          </p>
        </div>

        {/* How it decides */}
        <div className="section-label" style={{ fontFamily: MONO }}>How a home decides</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Each half-hour, six modules look at the same state. The orchestrator turns their output into one action and one sentence. If the grid module sees a price it does not trust, the home holds instead of trading.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {AGENTS.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Dashboard shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/aria/dashboard.webp"
            alt="The ARIA home dashboard on the heatwave day: 5.4 kW solar, battery at 81%, 8.4 kW exporting at 1,660 c/kWh, the headline 'Selling stored power into the 1660 c/kWh spike', and the day's price chart with one tall spike after midday"
            width={2880}
            height={1930}
            caption="The home dashboard during the spike. The headline comes from the orchestrator's template, and the reasoning grid shows the numbers behind it."
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

        {/* Swarm shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/aria/swarm.webp"
            alt="The ARIA swarm page on the heatwave day: the street saved $90.48 against every home acting alone, 92.1% cheaper, peak demand cut from 6 kW to 0, and 18.9 kWh traded between homes"
            width={2880}
            height={1195}
            caption="The street of 12 homes on the same day: $90.48 saved against each home acting alone, and 18.9 kWh traded house to house."
          />
        </div>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Test it on more than one day. Every headline number comes from a single, extreme day, which flatters a battery that can see the spike coming. A fair test would run a whole year of real prices with a forecast that can be wrong. I&apos;d also build the screens for phones; the sandbox only works on a wide screen.
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
          <a href="https://github.com/Clupai8o0/aria" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> Clupai8o0/aria</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
