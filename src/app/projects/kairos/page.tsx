import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'Kairos is a personal planner. It books tasks, goal sessions and habits into the next 14 days around fixed events, asks how each block of 30 minutes or more went, and learns how long things really take. October 2026 rebuild in Next.js 16, not yet deployed.'

export const metadata: Metadata = {
  title: 'Kairos · personal planner',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/kairos' },
  openGraph: {
    type: 'article',
    url: '/projects/kairos',
    title: 'Kairos · personal planner · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/kairos/today.webp', width: 2880, height: 1800, alt: 'The Kairos Today page with the current block, a proposal, a check-in and the week calendar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairos · personal planner · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/kairos/today.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'planning window', v: '14 days' },
  { k: 'test cases', v: '306' },
  { k: 'API route files', v: '45' },
]

const SHAPE: [string, string][] = [
  ['plan.ts', 'pure: same input, same output'],
  ['iterate.ts', 'pure: plans, then holds back the changes that need a yes'],
  ['load.ts', 'reads everything the planner needs from the database'],
  ['apply.ts', 'runs load, plan, write, propose and mirror, one replan at a time per user'],
  ['accept.ts', 'applies an accepted proposal exactly as shown'],
  ['llm/provider.ts', 'the only file that builds an AI provider'],
]

const TIMELINE = [
  { date: 'Mar–Apr 2026', title: 'Python prototype', body: 'A FastAPI service that scheduled tasks on Google Calendar, plus two Next.js front ends for it in quick succession. About 8,000 lines outside the tests by mid-April. The Google Calendar service alone was 1,051.' },
  { date: 'Apr–May 2026', title: 'Full-stack Next.js app', body: 'A rewrite in Next.js 16 that grew a plugin host with a Zod-checked contract, HMAC-signed HTTP plugins, theme and plugin marketplaces, and a chat that could read and write tasks. This is the build still running at kairos.clupai.com, behind a beta gate.' },
  { date: 'Oct 2026', title: 'Planner rebuild', body: 'Started from the earlier app\'s core and dropped the plugins, marketplaces and themes. Added the 14-day planner, check-ins, goals, habits and a Google Calendar mirror. It runs locally and has not been deployed yet.', current: true },
]

const DECISIONS = [
  ['code does the planning', 'letting the model plan', 'The planner is rule-based code. The AI suggests a duration when quick-add has none and drafts goals I confirm in a form. In chat it can add a task, ask for a replan or move a block within the same day; a move to another day still becomes a proposal. Every model call goes through one OpenRouter gateway and is logged with its tokens, cost and latency.'],
  ['a pure planner', 'a scheduler that reads the database', 'The planning code gets plain data and the current time as arguments, with no database or network access. So 225 of the 306 committed test cases are unit tests on plain data with the clock passed in. The other 81 run the real services against an in-memory database, and a dev clock lets a check-in that is hours away be tested in seconds.'],
  ['ask before big changes', 'silent replanning', 'Same-day shuffles of tasks and goal sessions apply on their own and are reported afterwards; moving a habit always asks. Moving work to another day, dropping it, or a deadline at risk becomes one Accept or Reject card. Blocks I have moved stay put: dragging a block pins it, and so does moving its event in Google Calendar.'],
  ['proposed estimates', 'quietly adjusting durations', 'Every done check-in, including any +15 min added, feeds a planned-versus-actual ratio per tag and per goal over the last 60 days; skips feed a separate skip rate by time of day. Once a tag or goal has at least three done check-ins and its overall ratio is outside 0.8 to 1.25, Kairos offers a new multiplier. A rejected estimate proposal stays quiet for 14 days.'],
  ['a separate Kairos calendar', 'writing into my own calendar', 'Kairos reads busy time from Google and mirrors its blocks into a calendar of its own. The plan and the planned-versus-actual history live in the app\'s database, so my real calendar is never overwritten.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'TanStack Query', 'FullCalendar', 'PWA']],
  ['Backend', ['Drizzle ORM', 'PostgreSQL', 'PGlite', 'Better Auth', 'Vercel AI SDK', 'OpenRouter', 'Google Calendar API', 'Web Push', 'Zod']],
  ['Tooling', ['Vitest', 'drizzle-kit']],
]

export default function KairosPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/kairos
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Kairos</h1>
            <span className="pill" style={{ fontFamily: MONO }}>prototype · oct 2026 rebuild</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A personal planner. Kairos books my tasks, goal sessions and habits into the next 14 days, around fixed events like classes. When a block of half an hour or more ends, it asks how it went, and over time it learns how long things really take. Moving work to another day, or planning longer for a kind of task, waits for my OK.
          </p>
        </div>

        {/* Hero: the app itself */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/kairos/today.webp"
            alt="The Kairos Today page: a now card for Pay phone bill with Done, +15 min and Skip, a proposal to plan #uni tasks 1.3× longer, a check-in for a reading block, the day's list, and the week calendar beside it"
            width={2880}
            height={1800}
            caption="Today: the current block, a proposal waiting for an OK, a check-in, and the week beside them. All screenshots are from a local demo account with seeded data, on the current development build."
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
            I got tired of time-blocking tools, so I built my own. It is a solo project, and this is the fourth build since March 2026. The earlier ones placed single tasks on a calendar. The October rebuild plans two weeks at a time and then checks the plan against how the time was actually spent.
          </p>
        </div>

        {/* How it plans */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it plans</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Every replan keeps each block whose slot still works, then places habits, then tasks, then goal sessions into what is left. If a task would miss its deadline, a second pass places the at-risk tasks first and keeps that plan if it saves more of them. Past blocks, the current block, pinned blocks and calendar events never move.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Week shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/kairos/week.webp"
            alt="The Kairos Week view for 2 to 8 November 2026: gym blocks, capstone report and CTF work sessions, and grey lecture, lab and stand-up blocks"
            width={2880}
            height={1508}
            caption="The week. Grey blocks are fixed calendar events: classes, stand-ups and meetings. The coloured ones are placed by the planner and can be dragged."
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

        {/* Goal shot */}
        <div data-reveal style={{ maxWidth: 480, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/kairos/goal.webp"
            alt="The Capstone final report goal page: 6 h done and 30 h left, on track to finish around Tue 17 Nov before the Thu 19 Nov due date, three stages, four tasks and eleven upcoming sessions"
            width={1500}
            height={2178}
            caption="A goal with a due date, three stages and the sessions the planner has booked for it."
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
            src="/projects/kairos/quickadd-mobile.webp"
            alt="Kairos on a phone: the Today screen with 'email tutor 20m tomorrow high' typed into the quick-add box, shown as chips for 20 min, due Tue 27 Oct and high"
            width={1170}
            height={2532}
            caption="Quick-add on a phone. One line becomes a duration, a due date and a priority before it is saved."
            variant="mobile"
          />
        </div>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Get the core job right before building a platform around it. The April–May build grew a plugin host, two marketplaces and a theme system, and none of them got used. The rebuild cut all three and spent its effort on planning and learning. Next is deploying it on Vercel with a Neon database, since kairos.clupai.com still serves the older build.
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
          <a href="https://kairos.clupai.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> kairos.clupai.com · earlier build</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
