import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'R1GPT checks a grid-connection submission for Australia\'s electricity market against AEMO\'s model guidelines. Six rule-based checks find the gaps, and a plain 0 to 95 score ranks what to fix first. A hackathon team build; I made the dashboard and the multi-company workspaces.'

export const metadata: Metadata = {
  title: 'R1GPT · grid-connection submission checker',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/r1gpt' },
  openGraph: {
    type: 'article',
    url: '/projects/r1gpt',
    title: 'R1GPT · grid-connection submission checker · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/r1gpt/overview.webp', width: 2880, height: 1680, alt: 'The R1GPT project overview for a demo battery project: readiness 72, 23 days in the current review round, 41 days left on the AEMO clock, the six-stage connection pipeline and recent activity' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'R1GPT · grid-connection submission checker · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/r1gpt/overview.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'rule-based checks', v: '6' },
  { k: 'readiness scale', v: '0–95' },
  { k: 'stress checks passing', v: '27/27' },
]

const ASSESSORS: [string, string][] = [
  ['delta', 'compares the designed values in the performance baseline with the factory test results'],
  ['evidence', 'checks the required documents are there, such as the harmonic filter design'],
  ['clause', 'maps each market rule clause to the documents that prove it'],
  ['firmware', 'flags equipment firmware that changed after the model tests were run'],
  ['network', 'flags a baseline more than 12 months old'],
  ['models', 'checks the simulation models match what the guidelines ask for this plant'],
]

const DECISIONS = [
  ['a score you can do by hand', 'a model\'s confidence', 'Each finding has a weight: low 4, medium 12, high 25, and 45 for one that forces new model tests. The score is 95 minus the sum, never below 0. The same package always gets the same score, and a reviewer can check the sum by hand. The weights rank what to fix first; they are not a chance of approval; AEMO publishes no outcomes to calibrate them against.'],
  ['capped at 95', 'a perfect 100', 'Passing every check only means nothing on a finite list went wrong. The last five points stand for the engineer\'s review that the tool cannot do, so it never shows a perfect score.'],
  ['a model reads, rules decide', 'one big prompt', 'GPT-4o only pulls values out of the uploaded PDFs, at temperature 0, and every value is checked against a schema. The six checks are plain code, and each finding names the guideline section it comes from.'],
  ['a workspace per company', 'one shared demo', 'After the event I added accounts, company workspaces with projects, four roles from viewer to owner, email invites, and file uploads. Data lives in Postgres through Drizzle, files in Vercel Blob.'],
]

const STACK: [string, string[]][] = [
  ['App', ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'IBM Carbon-style UI']],
  ['Data', ['Postgres (Neon) with Drizzle', 'Vercel Blob', 'NextAuth v5', 'Resend for invites']],
  ['Checks', ['OpenAI GPT-4o for extraction', 'Zod', 'pdf-parse']],
]

export default function R1GptPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/r1gpt
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>R1GPT</h1>
            <span className="pill" style={{ fontFamily: MONO }}>hackathon team build · jun 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A checker for the paperwork a new solar farm or battery sends AEMO before it can connect to the grid. You upload the package, and it lists what is missing or wrong, which guideline each problem breaks, and a score for how ready it is.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/r1gpt/overview.webp"
            alt="The R1GPT project overview for a demo 200 MW battery: readiness 72 with 2 blocking items, 23 days in the second review round, 41 days left on the AEMO clock, a six-stage connection pipeline and a recent activity feed"
            width={2880}
            height={1680}
            caption="The project overview, running locally in a fresh test workspace. Until an audit runs, the dashboard shows the demo project built into the app. The audit itself needs an OpenAI key, so it is not shown here."
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
            Before a generator joins the grid, AEMO reviews its models in rounds of questions, and each round can take weeks. One missing document or out-of-date test can add a round. R1GPT tries to catch those before the package is sent.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            The same team built it at Watt The Hack 2026, alongside <Link href="/projects/aria" style={{ color: 'var(--accent)' }}>ARIA</Link>. A teammate built the audit core: the six checks, the scoring and the PDF extraction. I built the dashboard, the pass and fail demo picker, the method and limits write-up with its stress test, and after the event, accounts and company workspaces.
          </p>
        </div>

        {/* How it scores */}
        <div className="section-label" style={{ fontFamily: MONO }}>The six checks</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Each check covers one part of AEMO&apos;s Power System Model Guidelines and cites the section it is based on.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {ASSESSORS.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Issues shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/r1gpt/issues.webp"
            alt="The R1GPT issue tracker with four demo questions from AEMO and the network operator, each tagged with its rule clause and marked blocking, major, minor or resolved"
            width={2880}
            height={1040}
            caption="The question tracker, also on the built-in demo data. The draft-response button opens a pre-written sample, not a live model."
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

        {/* Testing */}
        <div className="section-label" style={{ fontFamily: MONO }}>Testing</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          I wrote a stress script with 27 checks that run without an API key. It feeds the checks broken and empty input, tests the edges of the rounding rules, checks the score always stays between 0 and 95, and makes sure every finding cites a guideline section. All 27 pass.
        </p>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Test it on a real submission. It has only seen the two made-up packages it ships with, a failing 400 MW solar farm and a passing 200 MW battery. I&apos;d also stop mixing demo and live numbers on the dashboard: the demo score shows out of 100 while the real one stops at 95.
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
          <a href="https://github.com/Aarav261/R1gpt" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> Aarav261/R1gpt</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
