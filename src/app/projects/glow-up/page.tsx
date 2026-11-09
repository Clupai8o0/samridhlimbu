import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'

const DESCRIPTION =
  'Glow Up is a co-op health game for a household that you log to by chatting with Claude or ChatGPT. Started in November 2026: the sign-in and consent screens are deployed, meal logging runs on a separate preview deploy, weight and workout logging are on branches, and the phone design is a preview not yet wired to the API.'

export const metadata: Metadata = {
  title: 'Glow Up · a co-op health game you log to by chatting',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/glow-up' },
  openGraph: {
    type: 'article',
    url: '/projects/glow-up',
    title: 'Glow Up · a co-op health game you log to by chatting · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/glow-up/hero.webp', width: 2880, height: 1800, alt: 'The Glow Up Today screen: Level 7, 12 days in a row, a painted valley trail, and Dinner as the next task' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glow Up · a co-op health game you log to by chatting · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/glow-up/hero.webp', alt: 'The Glow Up Today screen: Level 7, 12 days in a row, a painted valley trail, and Dinner as the next task' }],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const AMBER = 'var(--term-amber, #f5c45a)'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'tests passing', v: '144' },
  { k: 'chat tools', v: '8' },
  { k: 'database migrations', v: '4' },
]

const STATUS: [string, string][] = [
  ['Live', 'glowup.clupai.com runs the 2 Nov build: the sign-in and consent screens and one test tool (ping)'],
  ['Preview', 'a separate preview deploy has meal logging, with its own database'],
  ['Branch only', 'weight and workout logging, and the Painted Valley phone design. The numbers above come from the backend branch'],
  ['Not yet', 'no real Claude or ChatGPT chat has connected, because the Google and email sign-in keys are not set up'],
]

const SHAPE: [string, string][] = [
  ['packages/core', 'every rule and schema, written once with zod'],
  ['packages/api', 'REST + OpenAPI 3.1 and the MCP server, both thin'],
  ['packages/auth', 'Better Auth: Google, email link, OAuth for the chats'],
  ['packages/db', 'Drizzle schema and migrations on Neon Postgres'],
  ['apps/web', 'Next.js on Vercel (Sydney): sign-in, consent, the API'],
  ['valley (branch)', 'the Painted Valley phone UI, not wired to the API yet'],
]

const MAY: [string, string][] = [
  ['May', 'read the household’s member list, then ask who is speaking'],
  ['May', 'log a meal as text, with a calorie and protein guess'],
  ['May', 'log a weight, or a gym, walking pad or other workout'],
  ['May', 'read any one member’s meals, weights or workouts in the household'],
  ['May not', 'send a photo: there is no photo field, so the call fails'],
  ['May not', 'reach another household: the sign-in token decides which one'],
  ['May not', 'delete anything: no tool deletes'],
  ['Told not to', 'put calories or weight in a shared summary. Only the tool description says this; no code checks it'],
]

const CALL = `→ tools/call log_meal
{
  "member": "6650110e-…",
  "time": "2026-11-09T19:10:00+11:00",
  "description": "Salmon, rice, greens",
  "kcal_estimate": 610,
  "protein_estimate": 42,
  "source": "claude"
}
← saved
{
  "time": "2026-11-09T08:10:00.000Z",
  "id": "cd31b8f9-…",
  "event_id": "b343fea2-…",
  "recorded_at": "2026-11-09T17:36:46.602Z"
}

→ tools/call log_meal { …, "photo": "data:image/jpeg;base64,…" }
← isError: Invalid arguments for tool log_meal: Unrecognized key: "photo"

→ any call without a token
← 401`

const DECISIONS = [
  ['one schema for every door', 'writing REST and MCP separately', 'Each tool’s input is a zod schema in packages/core. The REST route, the OpenAPI file and the MCP tool all read it, and a contract test logs a meal through REST and reads the same meal back through MCP.'],
  ['the chat signs in as the household', 'one login per person', 'The first household is two people who share one ChatGPT account. So the OAuth token belongs to the household, and the chat is told to ask who is speaking before it logs anything.'],
  ['an event for every write', 'just saving the row', 'A meal and its event go into the database in one statement, so both save or neither does. The event records who, which household, what and from where (Claude, ChatGPT or the web). Points and streaks are meant to be worked out from that log later.'],
  ['text and a guess', 'keeping meal photos', 'A chat can read a photo, but Glow Up only stores the text and the estimate. The schema rejects unknown fields, so a photo cannot slip in.'],
  ['one token per door', 'a token that works everywhere', 'MCP takes only tokens issued for /api/mcp, and REST takes only tokens issued for no service in particular, so a token for one does not work on the other. Access tokens last an hour, and refresh tokens are replaced each time they are used.'],
]

const TIMELINE = [
  { date: '1 Nov 2026', title: 'Brief and plan', body: 'Brief, phased plan and decision log, then four design concepts for the main screen (Lit Windows, Fridge Door, Day Receipt, Sunrise).' },
  { date: '2 Nov 2026', title: 'Scaffold, database and sign-in', body: 'Monorepo, Neon Postgres in Sydney, Better Auth with an OAuth server for the chats, and a ping tool. This build is the one live on glowup.clupai.com.' },
  { date: '2 Nov 2026', title: 'First logging tools', body: 'Meals, then weights and workouts, on REST and MCP, with CI. Meals run on a separate preview deploy; weights and workouts are on a branch only.' },
  { date: '2–5 Nov 2026', title: 'Painted Valley and a logo', body: 'The design picked on 2 Nov, built as a phone preview with an Android shell. A logo followed on 5 Nov: a valley with a glowing sun.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'TypeScript', 'plain JS phone preview', 'Android (Java) shell']],
  ['Backend', ['Better Auth 1.7 + OAuth provider', 'MCP TypeScript SDK + mcp-handler', 'zod 4', 'OpenAPI 3.1', 'Drizzle ORM']],
  ['Infra', ['Neon Postgres', 'Vercel (syd1)', 'pnpm', 'Turborepo', 'Vitest', 'PGlite in tests']],
]

export default function GlowUpPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/glow-up
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Glow Up</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(245,196,90,0.3)', fontFamily: MONO }}>● in progress · chat + web</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A co-op health game for a household. You tell Claude or ChatGPT what you ate, what you weighed or that you walked, and it logs it for you. The plan is shared points and levels, so nobody plays against anyone. The game part is not built yet.
          </p>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/glow-up/hero.webp"
            alt="The Glow Up Today screen: Level 7, 8 points to the ridge, 12 days in a row, a painted valley trail, Player 2 on the walking pad next, and Dinner as the next task with water, evening pills and tea together below"
            width={2880}
            height={1800}
            caption="Today, in the Painted Valley design. Every screen here is the phone preview running locally with a made-up sample household (Player 1 and Player 2). It is not connected to the API yet."
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

        {/* Status */}
        <div className="section-label" style={{ fontFamily: MONO }}>Where it stands</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 40 }}>
          {STATUS.map(([where, what]) => (
            <div key={where} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: where === 'Live' ? GREEN : 'var(--muted)', width: 88, flexShrink: 0 }}>{where}</span>
              <span style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--fg-dim)', lineHeight: 1.55 }}>{what}</span>
            </div>
          ))}
        </div>

        {/* Problem */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>The problem</div>
          <p style={{ ...PROSE, margin: 0 }}>
            The bet in the brief: tracking apps are a chore and get dropped, while sending a chat message is easy, and logging next to someone else may keep you at it. So Glow Up puts the logging in a chat you already use, and the shared progress in a small app.
          </p>
        </div>

        {/* How it works */}
        <div className="section-label" style={{ fontFamily: MONO }}>How the chat drives it</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          MCP (Model Context Protocol) is a standard way for a chat assistant like Claude to call tools on another service. Claude is meant to connect to Glow Up as a custom connector over MCP. The first time, you sign in and approve it for your household. After that, “salmon and rice for dinner” becomes a log_meal call: the chat guesses the calories and protein, is told to check them with you, and saves the text and the guess. ChatGPT gets the same tools through a REST API described by an OpenAPI file.
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 2, padding: '14px 16px', marginBottom: 24, lineHeight: 1.8 }}>
          {SHAPE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, margin: '0 0 12px' }}>
          What the chat may and may not do:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          {MAY.map(([verdict, what]) => (
            <div key={what} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: verdict === 'May' ? GREEN : 'var(--muted)', width: 88, flexShrink: 0 }}>{verdict}</span>
              <span style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--fg-dim)', lineHeight: 1.55 }}>{what}</span>
            </div>
          ))}
        </div>
        <p style={{ ...PROSE, margin: '0 0 12px' }}>
          Below are calls written by hand to the real MCP server from the backend branch, signed in through the real OAuth flow, on a throwaway in-memory Postgres. Replies are trimmed. No model was involved, so there is no chat reply to show.
        </p>
        <CodePre code={CALL} lang="json" />
        <div style={{ marginBottom: 40 }} />

        {/* Clip */}
        <div data-reveal style={{ maxWidth: 360, margin: '0 auto 40px' }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/glow-up/demo.mp4"
              poster="/projects/glow-up/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Logging dinner in the Glow Up phone preview: opening the dinner sheet and picking Salmon, rice, greens fills in about 610 kcal and 42 g protein"
              style={{ width: '100%', height: 'auto', aspectRatio: '390 / 844', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>Picking dinner in the phone preview. The numbers are a fixed sample estimate, not a model.</div>
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

        {/* Phone shots */}
        <div data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
          <Shot
            src="/projects/glow-up/log.webp"
            alt="The log sheet: What was dinner?, a text field that says Say it how you'd text it, three recent meals, and Read a photo, read once, never kept"
            width={1170}
            height={2532}
            caption="Logging a meal: type it like a text, or pick a recent one."
            variant="mobile"
          />
          <Shot
            src="/projects/glow-up/shop.webp"
            alt="The Shop tab: 7 to buy, about $59.40, grouped into meat and fish, fridge, fruit and veg, and pantry, with a price on each item"
            width={1170}
            height={2532}
            caption="The shared shopping list, with sample prices."
            variant="mobile"
          />
          <Shot
            src="/projects/glow-up/reward.webp"
            alt="The Level 8 reward: You reached the coast, a painted coast at sunrise, and a card that says From you and Player 2, 12 days in a row, with a Send it button"
            width={1170}
            height={2532}
            caption="The Level 8 reward. Levels exist only in this preview so far."
            variant="mobile"
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

        {/* What's left */}
        <div className="section-label" style={{ fontFamily: MONO }}>What&apos;s left</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          First, set up the sign-in keys and connect a real Claude and ChatGPT chat. Then habits, targets and undo, then the weekly summaries, then wiring the phone design to the API. Safety limits are planned for the coach that adjusts targets: a calorie floor, at most 1% of body weight lost a week, and every change announced and undoable. No medical advice.
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
