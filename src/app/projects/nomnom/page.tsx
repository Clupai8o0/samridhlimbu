import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'

const DESCRIPTION =
  'nomnom is a one-user calorie tracker. You log a meal by sending Claude a photo. Claude names the food through a remote MCP server, a local USDA database supplies the calories, and code does the arithmetic. Next.js 16, tRPC, Prisma and Better Auth, deployed on Vercel in Sydney.'

export const metadata: Metadata = {
  title: 'nomnom · calorie tracker you log through Claude',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/nomnom' },
  openGraph: {
    type: 'article',
    url: '/projects/nomnom',
    title: 'nomnom · calorie tracker you log through Claude · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/nomnom/today-og.webp', width: 1200, height: 630, alt: 'The top of the nomnom Today page: 527 kcal logged with 1,773 left, protein, carbs and fat tiles, and a breakfast entry marked Usual' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'nomnom · calorie tracker you log through Claude · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/nomnom/today-og.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'USDA foods', v: '8,114' },
  { k: 'MCP tools', v: '10' },
  { k: 'unit tests', v: '21' },
]

const SPLIT: [string, string][] = [
  ['Claude', 'names each food and picks an amount and a unit'],
  ['search_foods', 'finds the USDA row, its portions and your usual grams'],
  ['units.ts', 'the only file that turns an amount into grams'],
  ['log_meal', 'copies the calories and macros onto the entry'],
  ['/today', 'where you read the numbers back'],
]

const TOOL_CALL = `→ tools/call search_foods { "query": "rolled oats", "limit": 1 }

← name               Oats, whole grain, rolled, old fashioned
  per100g.energyKcal 379
  servingGrams       40
  portions           1 RACC = 40 g
  yourTypicalGrams   60`

const DECISIONS = [
  ['code does the maths', 'asking the model for calories', 'The server instructions tell Claude never to state calories it worked out itself. For each item it sends a food id, an amount and a unit such as 1 cup or 2 pieces. One file, units.ts, turns that into grams using the food’s own USDA portions, then multiplies the nutrients per 100 g.'],
  ['your own median portion', 'the model’s gram guess', 'For any food you have logged before, search results carry yourTypicalGrams, the median of your past portions. The tool description asks Claude to prefer it over its own estimate, because I expect the portion guess to be the biggest source of error. That is an instruction, not a rule in code. The server uses the unit Claude sends, and only falls back to your median when the food has no weight for a serving or a piece.'],
  ['fail loudly', 'invent a weight', 'If an amount cannot be turned into grams, the item is stored with no weight and goes to the review queue. It counts zero calories until you fix it. Volumes are different: with no density on file, 1 ml counts as 1 g and the item gets a lower confidence.'],
  ['macros copied at log time', 'recomputing from the food table', 'Each entry item keeps its own calories and macros, so re-importing the USDA data never rewrites a day you already logged.'],
  ['one service layer', 'logic in each front door', 'The tRPC router, the MCP endpoint and the waitlist server action only validate input and call one function in lib/services. Both the web app and Claude get the same rules.'],
  ['streaks for logging', 'streaks for eating less', 'The streak counts days you logged anything. Going over your target never breaks it.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'TanStack Query', 'ZXing', 'PWA']],
  ['Backend', ['tRPC 11', 'Prisma 7', 'PostgreSQL', 'pg_trgm', 'Better Auth', 'MCP TypeScript SDK', 'Zod', 'USDA FoodData Central', 'Open Food Facts']],
  ['Hosting', ['Vercel (Sydney)', 'Neon']],
  ['Tooling', ['Vitest', 'pnpm']],
]

export default function NomnomPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/nomnom
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>nomnom</h1>
            <span className="pill" style={{ fontFamily: MONO }}>deployed · aug 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A calorie tracker with one user. You log a meal by sending Claude a photo of it. Claude says what is on the plate, a local copy of the USDA food database supplies the calories, and plain code does the arithmetic. The web app is where you read the numbers back and fix anything that looks off.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/nomnom/today.webp"
            alt="The nomnom Today page: 527 kcal with 1,773 left of 2,300, protein, carbs and fat tiles, two entries marked Usual and Estimated, a 14-day bar chart with a 7-day average line, and a 9-day streak card"
            width={1120}
            height={2398}
            caption="Today: the day’s total, where each entry came from, the last 14 days and the logging streak. The screenshots and the clip come from a local demo account with made-up meals. They were taken from palette changes that are not released yet, so the live site has different colours."
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
            The idea is that you never type a meal in. Claude can already read a photo, so it does the logging, and the web app is only for reading your numbers. Claude reaches nomnom as a remote MCP server. MCP (Model Context Protocol) is a standard way to give an AI app a set of tools it can call. Here the tools search the food database and write log entries.
          </p>
        </div>

        {/* How a number is made */}
        <div className="section-label" style={{ fontFamily: MONO }}>How a number is made</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The model gets one job: say what is on the plate and how much of it. The calorie and macro numbers come from the database and from code.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 20, lineHeight: 1.8 }}>
          {SPLIT.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Below is a direct call to the server’s search_foods tool, made against a local copy with a hand-written request over the same OAuth flow Claude uses. It is not a Claude conversation. The demo account has eaten 60 g of oats a few times, so that comes back next to USDA’s 40 g serving.
        </p>
        <div style={{ marginBottom: 40 }}>
          <CodePre code={TOOL_CALL} />
        </div>

        {/* Clip */}
        <div data-reveal style={{ maxWidth: 360, margin: '0 auto 40px' }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/nomnom/demo.mp4"
              poster="/projects/nomnom/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Fixing an entry on a phone: the milk in a flat white goes from 120 ml to 200 ml and its chip changes from Estimated to Entered"
              style={{ width: '100%', height: 'auto', aspectRatio: '390 / 844', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>Fixing a portion: 120 ml of milk becomes 200 ml, the item is re-marked as Entered and the total updates.</div>
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

        {/* Review shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/nomnom/review-mobile.webp"
            alt="The nomnom review page on a phone: one item, pizza slice, pepperoni, marked Estimated and Needs a look, counting 0 kcal"
            width={1170}
            height={1150}
            caption="The review queue lists only items with no weight behind them. This one counts zero until it is fixed."
            variant="mobile"
          />
        </div>

        {/* Where it lives */}
        <div className="section-label" style={{ fontFamily: MONO }}>Where it lives</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Deployed on 24 August 2026 on Vercel in Sydney, with a Neon database in the same region. The app is at nomnom.clupai.com and the MCP connector at api.nomnom.clupai.com. It is two hosts because the web app signs in with a cookie, while the connector uses bearer tokens from OAuth 2.1, which Claude’s mobile app needs since it has nowhere to paste a key. Sign-up is off: there is one account, made by a seed script.
        </p>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/nomnom/today-mobile.webp"
            alt="The nomnom Today page on a phone, from the day total down to the streak card and the Review, Scan and Settings links"
            width={1170}
            height={3585}
            caption="The same page at phone width. The app is a PWA, so it can be added to a phone’s home screen."
            variant="mobile"
          />
        </div>

        {/* What is next */}
        <div className="section-label" style={{ fontFamily: MONO }}>What is still open</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          The site is live, but the connector has not been added to Claude on a phone yet, so nobody uses it day to day. The open question is whether logging by photo sticks, and the plan is to answer it with a fortnight of real use before writing more code. Food search also needs work. Ranking is hand-tuned, and until you have logged an apple once, a search for “apple” puts Applebee’s restaurant dishes above the fruit.
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
          <a href="https://nomnom.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> nomnom.clupai.com</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
