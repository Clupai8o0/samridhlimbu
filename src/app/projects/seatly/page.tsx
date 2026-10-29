import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'Seatly is a restaurant reservations and table management app: an onboarding wizard with a capacity calculator, a booking engine that picks tables, a diner booking page and an operator dashboard. Built mostly in one week of June 2026, with a last commit in July, and left unfinished.'

export const metadata: Metadata = {
  title: 'Seatly · restaurant reservations',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/seatly' },
  openGraph: {
    type: 'article',
    url: '/projects/seatly',
    title: 'Seatly · restaurant reservations · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/seatly/capacity.webp', width: 1556, height: 1376, alt: 'The Seatly capacity calculator step with five table groups adding up to 22 tables and 54 chairs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seatly · restaurant reservations · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/seatly/capacity.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'API tests passing', v: '71' },
  { k: 'Postgres tables', v: '21' },
  { k: 'tables double-booked under a 120-request burst', v: '0' },
]

// The capacity maths from packages/types/src/capacity.ts, worked for the demo cafe.
const MATHS: [string, string, string][] = [
  ['tables', 'sum of table counts', '22'],
  ['chairs', 'sum of count × seats', '54'],
  ['covers per service', 'round(chairs × 270 ÷ 105 × 0.7)', '97'],
  ['suggested pacing cap', 'ceil(97 ÷ (270 ÷ 15 slots))', '6'],
  ['largest party', 'max(biggest table, combinable seats in one section)', '12'],
]

const LATENCY_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Booking time at 20 quiet venues',
  subtitle: 'One run of the repo\'s load harness on my laptop against local Postgres 16. Under load, times were measured while up to 100 bookings for one other venue were in flight. Times exclude queueing.',
  caption: 'The median went from 14 to 40 ms, and the second-slowest of 20 from 29 to 50 ms. No quiet-venue booking failed.',
  xLabel: 'booking',
  unit: 'ms',
  categories: ['median', 'second-slowest of 20'],
  series: [
    { name: 'no other load', values: [14, 29] },
    { name: 'busy venue next door', values: [40, 50] },
  ],
}

const DECISIONS = [
  ['a derived capacity model', 'a typed-in slot count', 'Operators describe their tables and the engine works out every bookable slot from the tables, turn times (how long a party of each size keeps a table) and rules, and the calculator turns the same table list into a suggested pacing cap and a largest-party limit.'],
  ['one service owns booking writes', 'writing from wherever is convenient', 'The Next.js app reads the database directly for the dashboard, but every new booking and status change goes through the FastAPI service. Dashboard calls carry a service token that expires after five minutes. Diner bookings reach the service through a proxy route. That keeps the lock, the re-check and the table choice in one place.'],
  ['a database backstop', 'trusting the app lock alone', 'The engine locks the venue\'s tables with SELECT ... FOR UPDATE before it re-checks and assigns. Under that, migration 0005 adds a Postgres exclusion constraint on each table\'s booked time range, so two overlapping bookings on one table are rejected even if some future code path skips the lock, as long as it records the time range.'],
  ['tightest table first', 'spreading guests across the room', 'The engine seats a party at the smallest free table that fits, then the smallest combinable pair, then three or more combinable tables in one section. It keeps big tables free for big groups. Ties are broken by the table label as text, so in the timeline above T1, T13 and T14 fill up while T2 to T6 sit empty.'],
  ['a pure engine', 'logic mixed into queries', 'Slot listing, table choice and pacing live in one Python file with no database or clock, and all 71 API tests run without a database.'],
]

const TIMELINE = [
  { date: '2–3 Jun 2026', title: 'Foundation and onboarding', body: 'Turborepo monorepo, Drizzle schema, and the six-step onboarding wizard with the capacity calculator.' },
  { date: '3 Jun 2026', title: 'Booking engine and dashboard', body: 'The FastAPI booking engine, the diner booking page with its manage-booking link, and the first operator dashboard.' },
  { date: '7 Jun 2026', title: 'Guests and reminders', body: 'Guest profiles, a waitlist, and email and SMS notification code, in a commit titled "close to version 1".' },
  { date: '8 Jun 2026', title: 'Better Auth and a native app', body: 'Moved sign-in from Auth.js to Better Auth and started an Expo operator app with its own API client and a tap-to-assign floor plan.' },
  { date: '15 Jul 2026', title: 'Last commit', body: 'A live-refreshing dashboard, capacity and rules changes, and two more migrations, in a commit titled "pre clean up". The clean-up never happened, and there have been no commits since.', current: true },
]

const UNFINISHED = [
  'The README still says Phase 1 and Auth.js. The code went well past that, and sign-in moved to Better Auth.',
  'The floor-area mode in the capacity doc, which estimates seats from square metres, was never built. The README says it was.',
  'The help chatbot planned for the dashboard does not exist.',
  'The pacing suggestion always assumes a 270-minute dinner service with 105-minute turns, even after a cafe has entered its real hours on the step before.',
  'The venue step creates the rules row with a pacing cap of 0, so the rules form shows 0 (no limit) instead of the suggested 6. The screenshot above shows it.',
  'Dates on the bookings page are formatted with the browser\'s locale on one side and the server\'s on the other, which React reports as a hydration mismatch.',
  'There are no tests for the TypeScript side. The 71 tests cover the Python service only.',
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Expo (operator app)']],
  ['Backend', ['FastAPI', 'Python', 'psycopg', 'PostgreSQL', 'Drizzle ORM', 'Better Auth']],
  ['Tooling', ['Turborepo', 'pnpm', 'pytest', 'drizzle-kit', 'uv']],
]

export default function SeatlyPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/seatly
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Seatly</h1>
            <span className="pill" style={{ fontFamily: MONO }}>unfinished · jun–jul 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            Restaurant reservations and table management. An operator describes their tables in a short setup wizard, and Seatly works out what can be booked, picks a table for every booking, and shows the day on a dashboard. Diners book through a hosted page. I built most of it in one week of June 2026, made one last commit in mid-July, and stopped before the clean-up pass.
          </p>
        </div>

        {/* Hero: the capacity calculator */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/seatly/capacity.webp"
            alt="Step 2 of the Seatly setup wizard, the capacity calculator: five table groups (six 2-seat and five 4-seat tables and one 8-seat table in Main, four round 2-seat tables in Courtyard, six stools at a window bar) adding up to 22 tables and 54 chairs"
            width={1556}
            height={1376}
            caption="The capacity calculator, filled in for a made-up cafe. All screenshots are from a local demo account with seeded data, on the last commit."
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
          <p style={{ ...PROSE, margin: '0 0 14px' }}>
            I wanted availability worked out from the room rather than typed in as a number per slot: the tables, which ones can be pushed together, how long a party of each size usually stays. It is a solo project, planned in six phases, from foundation to a marketing site.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            It is unfinished. Onboarding, the booking engine, the diner page and the dashboard all work locally. The roadmap marks the last two phases, guest profiles with automated reminders and the polish pass, as shipped, and the code for them is there, but I did not run the email or SMS paths for this page. The native app was not run either.
          </p>
        </div>

        {/* Capacity calculator */}
        <div className="section-label" style={{ fontFamily: MONO }}>The capacity calculator</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Each row is a group of identical tables: seats, how many, which section, and whether they can be joined or booked online. From that list the calculator works out five numbers, where a cover means one diner. The demo cafe has 22 tables and 54 chairs.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 14, lineHeight: 1.8 }}>
          {MATHS.map(([name, rule, value]) => (
            <div key={name} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 170, flexShrink: 0 }}>{name}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 220px' }}>{rule}</span>
              <span style={{ color: 'var(--fg)', width: 28, textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The 0.7 is a utilisation factor, because no room fills every seat on every turn. Covers per service is a planning number and is never stored. The pacing cap spreads those covers over the 15-minute slots in a service, so no 15-minute slot starts more than six covers. The largest party is the bigger of the biggest single table and all the joinable seats in one section: here, six joinable 2-seat tables in Main make 12.
        </p>
        <p style={{ ...PROSE, margin: '0 0 24px' }}>
          The live summary on this step only shows tables and chairs. The suggested pacing cap and the largest party appear three steps later, on the rules form. Covers per service is never shown.
        </p>

        {/* Rules shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/seatly/rules.webp"
            alt="The Seatly booking rules step: maximum guests set to 16 with a yellow warning that the tables seat up to 12 together, and a pacing cap field showing 0 with the hint 'Suggested from your capacity: 6'"
            width={1480}
            height={1240}
            caption="The rules step. Asking for 16 guests triggers the 12-guest warning. The pacing field shows 0 next to a suggestion of 6, a bug covered below. For the demo I set it to 6 by hand before going live."
          />
        </div>

        {/* Booking engine */}
        <div className="section-label" style={{ fontFamily: MONO }}>How a booking gets a table</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          A booking request goes to the FastAPI service. It locks the venue&apos;s tables, re-checks the slot and the pacing cap under the lock, picks a table, and writes the booking. Each table&apos;s booked time is stored as a Postgres time range, and an exclusion constraint refuses any two ranges that overlap on the same table.
        </p>
        <p style={{ ...PROSE, margin: '0 0 24px' }}>
          The demo bookings were placed by that engine through its own Python functions, not inserted by hand, so the table choices below are the engine&apos;s.
        </p>

        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/seatly/timeline.webp"
            alt="The Seatly bookings timeline for Thursday 29 October: tables T1 to T14 down the side, hours from 7 am to 2 pm across the top, finished breakfast bookings in grey, seated lunch bookings in green, upcoming ones in yellow, one no-show in red, and a red line at the current time"
            width={2040}
            height={1800}
            caption="The timeline for the demo day. Grey is finished, green is seated, yellow is still to come, red is a no-show."
          />
        </div>

        <p style={{ ...PROSE, margin: '0 0 24px' }}>
          The repo has a load harness that runs the real booking code against a local database. On my run, 120 booking attempts, 64 at a time, asked one 8-table venue for the same slot: 8 got a table, 112 were told the slot was full, and no table was double-booked. With the lock bypassed on purpose, Postgres rejected the second overlapping booking on its own. The harness also checks that one busy venue does not block or fail bookings at the others.
        </p>
        <div data-reveal>
          <ArticleChart block={LATENCY_CHART} />
        </div>

        {/* Dashboard */}
        <div className="section-label" style={{ fontFamily: MONO }}>The dashboard</div>
        <p style={{ ...PROSE, margin: '0 0 24px' }}>
          The Today view is worked out when the page loads, from the bookings and the table list: covers, who is seated, table occupancy, covers starting in each slot against the cap, and a list of things to watch, like an allergy note or a guest with a past no-show.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/seatly/today.webp"
            alt="The Seatly Today view at 12:20 pm: 60 covers booked, 20 bookings, 4 seated now, 7 upcoming, 18% occupancy with 4 of 22 tables, a list of seated parties, and a pacing panel with covers per slot against a cap of 6"
            width={2040}
            height={1800}
            caption="Today, with the clock set to 12:20 on a Thursday. The pacing panel on the right counts covers starting in each slot against the cap of 6."
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
            src="/projects/seatly/today-mobile.webp"
            alt="The Seatly Today view in a phone-width browser: the stats stacked two to a row, then the first seated parties with Complete and Unseat buttons"
            width={1170}
            height={2532}
            caption="The same Today view in the web portal at phone width. The native Expo app was not run for this page."
            variant="mobile"
          />
        </div>

        {/* What is unfinished */}
        <div className="section-label" style={{ fontFamily: MONO }}>What is unfinished</div>
        <ul style={{ ...PROSE, margin: '0 0 14px', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {UNFINISHED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Before any new feature, the TypeScript side needs tests of its own. A single test on the rules form would have caught the pacing default of 0.
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
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
