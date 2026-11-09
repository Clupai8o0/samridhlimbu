import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'VisaTrack counts the hours an international student on a subclass 500 visa has worked inside every overlapping Monday fortnight, and says how many more they can work. Next.js 16 and FastAPI, built in July 2026, not deployed.'

export const metadata: Metadata = {
  title: 'VisaTrack · student work-hours tracker',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/visatrack' },
  openGraph: {
    type: 'article',
    url: '/projects/visatrack',
    title: 'VisaTrack · student work-hours tracker · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/visatrack/dashboard.webp', width: 1600, height: 970, alt: 'The VisaTrack Today card: within your limit, you can work 17 hours more, 31 of 48 hours used from 2 to 15 November' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisaTrack · student work-hours tracker · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/visatrack/dashboard.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'API tests passing', v: '458' },
  { k: 'commits in 7 days', v: '108' },
  { k: 'windows per day', v: '2' },
]

const WINDOWS_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Counted hours per 14-day window',
  subtitle: 'Demo student, one bar per window, labelled by its starting Monday. Cap is 48.',
  xLabel: 'window starting Monday',
  unit: 'hours',
  categories: ['5 Oct', '12 Oct', '19 Oct', '26 Oct', '2 Nov', '9 Nov'],
  series: [{ name: 'Counted hours', values: [39, 37, 38, 46, 31, 5] }],
}

const DECISIONS = [
  ['step windows by 7 days', 'pairs of weeks', 'The app treats every Monday as the start of a 14-day window, so each day sits in two of them. The hours left today are the smaller of the two amounts, and the window that started last Monday is often the tighter one.'],
  ['"unknown" when data is missing', 'a hopeful green tick', 'Without the student\'s teaching periods and breaks, the engine cannot tell which days are capped, so it says it does not know. A visa subclass other than 500 also gets "unknown".'],
  ['all rules in the engine', 'rules spread across the app', 'The frontend, the MCP tools and the screenshot importer are meant to show only what the engine returns. A backend test fails if Python code outside the engine computes the cap, and a written audit covers the other surfaces.'],
  ['a pure function', 'reading the clock', 'evaluate() takes shifts, profile, periods and the time as arguments. It never reads the database or the clock, so every answer can be reproduced in a test.'],
  ['warn on other 14-day stretches', 'calling them a breach', 'The definition names Monday windows only, so a student can pass all of them and still work over 48 hours in some other 14 days. No source says how Home Affairs treats that, so the app warns about the pattern and does not call it a breach.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Zod', 'date-fns', 'Playwright']],
  ['Backend', ['Python 3.12', 'FastAPI', 'SQLAlchemy 2 (async)', 'Alembic', 'PostgreSQL', 'pytest']],
]

export default function VisaTrackPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/visatrack
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>VisaTrack</h1>
            <span className="pill" style={{ fontFamily: MONO }}>prototype · jul 2026 · not deployed</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A work-hours tracker for international students in Australia on a Student visa (subclass 500). It counts the hours worked inside every fortnight the visa condition looks at, and gives one answer: how many more hours you can work.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/visatrack/dashboard.webp"
            alt="The VisaTrack Today card: within your limit, you can work 17 hours more, 31 of 48 hours used from 2 to 15 November, and a bar for each of the 14 days"
            width={1600}
            height={970}
            caption="Today. The window shown is 2 to 15 November, the one that started last Monday, because it has less room. All screens come from a local demo with a made-up student and seeded shifts."
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
            Student visa holders may work up to 48 hours a fortnight while their course is in session. The regulation defines a fortnight as 14 days starting on a Monday and names no first Monday. VisaTrack reads that as a new window every Monday, so the windows overlap. Pairing weeks 1 and 2, then 3 and 4, never checks weeks 2 and 3. VisaTrack checks every window. It is a prototype, not migration advice.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            I built it in a week, 16 to 22 July 2026, working with Claude and Codex agents through a phased build plan. The repo keeps every legal claim in one rules file that quotes the regulation. It runs locally and has not been deployed. The release checklist still waits on a review by a registered migration agent and a fresh check of the rules.
          </p>
        </div>

        {/* Clip */}
        <div className="section-label" style={{ fontFamily: MONO }}>Can I take a shift?</div>
        <div style={{ marginBottom: 40 }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/visatrack/demo.mp4"
              poster="/projects/visatrack/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Checking a 7:00 to 19:00 shift on the Can I take this shift page; the answer is close to your limit, you can work 5 hours more"
              style={{ width: '100%', height: 'auto', aspectRatio: '1440 / 900', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>A 12-hour shift checked before saying yes. Nothing is logged. The engine answers 43 of 48 hours in the 2 to 15 November window, and warns that one 14-day stretch not starting on a Monday would go over 48.</div>
        </div>

        {/* Windows */}
        <div className="section-label" style={{ fontFamily: MONO }}>Overlapping windows</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The chart is the engine&apos;s own report for the demo student. Pairs of weeks from 19 October come to 38 and 31 hours. The window between them, starting 26 October, holds 46.
        </p>
        <div style={{ marginBottom: 40 }}>
          <ArticleChart block={WINDOWS_CHART} />
        </div>

        {/* Week shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/visatrack/shifts-week.webp"
            alt="The VisaTrack shifts week view for 2 to 8 November: Campus café mornings on Monday, Wednesday and Friday and a Corner bakery shift on Saturday"
            width={1600}
            height={1272}
            caption="Shifts for the week of 2 November, from made-up casual jobs."
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

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/visatrack/dashboard-mobile.webp"
            alt="VisaTrack on a phone: within your limit, you can work 17 hours more, 31 of 48 hours used, with a bar for each of the 14 days"
            width={1170}
            height={1722}
            caption="The same answer on a phone."
            variant="mobile"
          />
        </div>

        {/* What else */}
        <div className="section-label" style={{ fontFamily: MONO }}>What else is built</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The repo also has a free and paid tier with Stripe billing, read-only calendar sync, an MCP server, CSV, PDF, Excel and Word exports, and drafting shifts from a roster screenshot with a vision model. Billing, calendar sync and drafting need live keys, which this demo did not have. None of these are shown here. The release checklist plans the legal review first, then a staged rollout: the team, a small beta group, then open sign-ups.
        </p>

        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          More on the rule and the maths: <Link href="/writing/forty-eight-hours-a-fortnight" style={{ color: 'var(--accent)' }}>48 hours a fortnight: why VisaTrack checks every Monday</Link>.
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

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
