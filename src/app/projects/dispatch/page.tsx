import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'

const DESCRIPTION =
  'A personal inbox and calendar agent, June 2026. A TypeScript engine reads Gmail and Google Calendar and writes day, week and month briefs. It sorts mail by subject and sender before reading bodies, and learns which kinds of mail you delete. A local prototype with a CLI and a web UI.'

export const metadata: Metadata = {
  title: 'Dispatch · inbox and calendar agent',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/dispatch' },
  openGraph: {
    type: 'article',
    url: '/projects/dispatch',
    title: 'Dispatch · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/dispatch/brief.webp', width: 2880, height: 1430, alt: 'The Dispatch web UI showing the day brief: a headline reading Your day: 2 meetings, 1 deadline, 1 to reply to, then a Meetings card listing a cyber club committee meeting and a SIT320 lab' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dispatch · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/dispatch/brief.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const LOG = {
  fontFamily: MONO,
  fontSize: 'var(--text-xs)',
  lineHeight: 1.7,
  color: 'var(--fg-dim)',
  background: 'var(--bg-2)',
  borderRadius: 2,
  padding: '14px 16px',
  margin: 0,
  overflowX: 'auto' as const,
  whiteSpace: 'pre' as const,
}

const LOG_CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

const METRICS = [
  { k: 'commits, one night', v: '14' },
  { k: 'lines of TypeScript', v: '8,942' },
  { k: 'API routes', v: '12' },
  { k: 'automated tests', v: '0' },
]

const STATUS: [string, string[]][] = [
  ['Ran for this page', [
    'Day, week and month briefs, with the template summaries it uses when there is no model key',
    'Two-pass cleanup: sort by subject and sender, then read only the bodies that look important',
    'The learning ladder, from first delete to a learned auto-delete rule',
    'List-Unsubscribe parsing, with the unsubscribe itself simulated',
    'Learned rules, the audit log and undo, the CLI, and the Brief, Cleanup and Learning views of the web UI',
  ]],
  ['Written, not run here', [
    'Google sign-in, reading Gmail and Calendar, and the Gmail actions (trash, archive, label, draft, send)',
    'Model calls for sorting, reading, summaries and reply drafts',
    'The one-click unsubscribe POST, and sending the brief by email or push',
  ]],
  ['Not built', [
    'Learned preferences feeding the brief ranking: the weight exists, the signal is fixed at 0',
    'Tests, and a phone layout for the web UI',
    'The roadmap’s later list: more sources, "what changed" diffs, tone-matched replies, snooze',
  ]],
]

const TRIAGE_LOG = `triage: 9 emails, threshold 0.4
  likely-junk      0.15  skip body  The Commit Log #112: a Rust release, CRDTs,…  (has unsubscribe link)
  likely-important 0.90  read body  Can you push the Dijkstra notebook before T…  (starred)
  likely-junk      0.15  skip body  [dispatch] CI passed on main                  (mailing-list mail)
  likely-important 0.70  read body  SIT320 Task 4.2 due Friday 11:59pm            (unread personal mail)
  likely-junk      0.15  skip body  Two-for-one burritos this week                (has unsubscribe link)
  likely-junk      0.15  skip body  The Commit Log #111: local-first tools, a b…  (has unsubscribe link)
  likely-junk      0.15  skip body  The Commit Log #110: compiler internals and…  (has unsubscribe link)
  likely-important 0.70  read body  Could you review the CTF write-up before Su…  (unread personal mail)
  likely-important 0.70  read body  Your loan expires in 3 days                   (unread personal mail)
  bodies read: 4 of 9`

const LADDER_LOG = `# run 1: the first run is a learning run
UNSUBSCRIBE (SUGGESTED) (2)
  • The Commit Log #112: a Rust release, CRDTs, five repos  · The Commit Log <digest@commitlo…  [do]
# run 2
  • The Commit Log #112: a Rust release, CRDTs, five repos  · The Commit Log <digest@commitlo…  [ask]
# run 3
  • The Commit Log #112: a Rust release, CRDTs, five repos  · The Commit Log <digest@commitlo…  [ask]
  ↳ Learned: auto-delete the weekly.commitlog.example newsletter (after 3 confirmations)
# run 4: dangerous.autoDelete still off
DELETE (→ TRASH) (3)
  • The Commit Log #112: a Rust release, CRDTs, five repos  · The Commit Log <digest@commitlo…  [ask]
# run 5: dangerous.autoDelete on
  • The Commit Log #112: a Rust release, CRDTs, five repos  · The Commit Log <digest@commitlo…  [auto]
auto: delete "The Commit Log #112: a Rust release, CRDTs, five repos" — Learned: auto-delete the weekly.commitlog.example newsletter`

const UNSUB_LOG = `The Commit Log
  header   <https://commitlog.example/u/opt-out?id=7f3a>, <mailto:leave@commitlog.example>
  parsed   https=["https://commitlog.example/u/opt-out?id=7f3a"] mailto=["mailto:leave@commitlog.example"]
  result   one-click, would POST one-click unsubscribe to https://commitlog.example/u/opt-out?id=7f3a (simulated)
Campus Eats
  header   <mailto:stop@campuseats.example?subject=unsubscribe>
  parsed   https=[] mailto=["mailto:stop@campuseats.example?subject=unsubscribe"]
  result   mailto, would email mailto:stop@campuseats.example?subject=unsubscribe to unsubscribe (simulated)`

const UNDO_LOG = `Outcome: 0 applied · 2 skipped · 0 failed
  - skipped: unsubscribe "gmail:mock-promo-1" (cannot undo unsubscribe (irreversible))
  - skipped: keep "gmail:mock-deadline-1" (cannot undo: keep is a no-op)`

const DECISIONS = [
  ['a rule-based fallback', 'failing without a key', 'Every model call sits in a try block. With no key, or when a call fails, sorting drops to a few fixed rules and the brief drops to templates. That is why every command on this page runs offline. It also means the output here is the fallback, not what a model would write.'],
  ['grouping by mailing list', 'grouping by sender', 'A decision about one email has to apply to the next one of its kind. The key is the List-Id header when there is one, and the sender address when there is not. One newsletter is one kind even if it comes from several addresses. Working out the key needs no body and no model.'],
  ['two switches to auto-delete', 'auto-delete after N confirmations', 'Three confirmed deletes make a learned rule, but it still asks until the auto-delete setting in the Dangerous tier is turned on. That setting is off by default. The rule table lives in one pure function, decideTrust, in learn/trust.ts.'],
  ['a model per job', 'one vendor', 'Sorting, reading and replies each get their own model setting through the Vercel AI SDK. The default is a small Anthropic model for sorting and a larger one for reading and replies. Any job can point at OpenAI, Gemini, DeepSeek or an OpenAI-compatible endpoint instead.'],
  ['JSON files in one folder', 'a database', 'Settings, rules, preferences and the audit log are each one JSON file under ~/.dispatch, or under DISPATCH_DATA_DIR if it is set. Pointing that at a temp folder gave this showcase a clean slate without touching anything else.'],
  ['node:http and a small router', 'a web framework', 'The API is 12 routes on a plain Node server that also serves the built React app. The web views reuse the engine’s own functions, so the CLI and the UI give the same answers.'],
]

const STACK: [string, string[]][] = [
  ['Engine', ['TypeScript', 'Node', 'Vercel AI SDK', 'zod', 'googleapis']],
  ['Web', ['React 19', 'Vite', 'node:http']],
  ['Data', ['JSON files']],
  ['Tools', ['npm workspaces', 'tsx']],
]

export default function DispatchPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/dispatch
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Dispatch</h1>
            <span className="pill" style={{ fontFamily: MONO }}>personal · June 2026 · local prototype</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            An inbox and calendar agent I built for myself. It reads Gmail and Google Calendar, writes a brief for the day, week or month, and suggests what to archive, delete or unsubscribe from. When you keep deleting the same kind of mail, it learns that, and can delete it for you once you allow it.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/dispatch/brief.webp"
            alt="The Dispatch web UI on the Brief tab with a Mock mode badge. The headline card reads Your day: 2 meetings, 1 deadline, 1 to reply to. Below it, a Meetings card lists a cyber club committee meeting on Thursday that needs an RSVP and a SIT320 lab in an hour."
            width={2880}
            height={1430}
            caption="The day brief in the web UI. Every screen and log on this page comes from a local demo with seeded, made-up emails, with the clock set to 8:30 am. There is no model key, so the summary lines are Dispatch's own templates."
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
        <div className="section-label" style={{ fontFamily: MONO }}>What is built</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          I wrote it over one night, 4 to 5 June 2026, in nine phases from scaffold to scheduled brief. The README says all nine are done. That is true of the code, but the Google side never ran for this page, because I would not point it at a real inbox. Here is what I could check and what I could not.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {STATUS.map(([label, items]) => (
            <div key={label}>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
              <ul style={{ ...PROSE, margin: 0, paddingLeft: 18 }}>
                {items.map((it) => (
                  <li key={it} style={{ marginBottom: 4 }}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* How it fits together */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it fits together</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Two npm workspaces. The engine turns emails and calendar events into one Item type, then passes them through five stages: brief, clean, learn, automate and deliver. Briefs sort items into meetings, deadlines, needs-a-reply and FYI. Each item is then ranked by sender, unread state, deadline words and how soon it starts. Week and month briefs add repeating events, repeat senders and a by-day view.
        </p>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The same engine sits behind a CLI (today, week, month, clean, rules, learned, audit, undo, run) and a small API that serves the React app. A scheduler can send the brief each morning at a set time, either from its own loop or as a crontab or systemd line it prints for you.
        </p>

        {/* Triage */}
        <div className="section-label" style={{ fontFamily: MONO }}>Cheap first: read the subject before the body</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Cleanup runs in two passes. The first sees only the subject, the sender, the labels, the preview text and a few flags. It marks each email likely important, likely junk or unsure, with a score. Only emails that are not junk and score at least 0.4 get their bodies read in the second pass. With a key, a small model does the first pass. Without one, these fixed rules do:
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre code={TRIAGE_LOG} style={LOG} />
          <div style={LOG_CAPTION}>The first pass on the week&apos;s nine made-up emails, run through the engine&apos;s own triagePass with no key, so it fell back to the rules. &apos;bodies read&apos; counts the emails sent on to the second pass; my demo script stops before reading them.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          A starred email counts as important. Otherwise, anything with an unsubscribe link or a mailing-list header counts as junk. So the CI notice is junk and the unit site&apos;s reminder is important. The second pass then turns each verdict into a proposed action. Nothing runs until you approve it. The cleanup view below covers only the day&apos;s five emails.
        </p>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/dispatch/cleanup.webp"
            alt="The Cleanup tab titled Review before anything happens. A bar reads 5 triaged, 2 bodies read, 3 skipped, 5 actions proposed. Below, three Delete proposals, The Commit Log #112, a CI notice and a burrito deal, each give the reason Learned: auto-delete and carry an ask tag."
            width={2880}
            height={1610}
            caption="The cleanup review after three runs. Each delete comes from a learned rule but is still tagged ask, because auto-delete is off."
          />
        </div>

        {/* Learning */}
        <div className="section-label" style={{ fontFamily: MONO }}>Learning to delete</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The README sets the rule: the first delete of a kind just happens, the next ones ask, and after enough confirmations that kind is deleted on its own. In the code, enough is three, and a kind you keep is marked wanted and never proposed for removal. I ran the real CLI five times on the same inbox, approving everything, and turned on auto-delete before the fifth run.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre code={LADDER_LOG} style={LOG} />
          <div style={LOG_CAPTION}>Five runs of dispatch clean --apply --yes, cut down to The Commit Log&apos;s lines. The # lines are my notes. Approving an unsubscribe counts as a confirmed removal, so after three runs the newsletter has a learned delete rule and moves to DELETE.</div>
        </div>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/dispatch/learning.webp"
            alt="The Learning tab titled What Dispatch has learned, with tags reading Learning active, 2 wanted, 3 disliked, 3 learned rules. The lab partner and the unit site are wanted with 3 keep signals each. The Commit Log newsletter is disliked at 3/3 toward auto, marked graduated, with Actually keep this and Reset count buttons."
            width={2160}
            height={1850}
            caption="The Learning tab after three runs. Each kind of mail you kept or removed shows here, and you can undo what it learned."
          />
        </div>

        {/* Unsubscribe */}
        <div className="section-label" style={{ fontFamily: MONO }}>Unsubscribing</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Newsletters put their unsubscribe options in a List-Unsubscribe header. Dispatch splits it into web links and email addresses. If there is a web link, it tries to unsubscribe with one request, as the one-click standard (RFC 8058) allows, though it does not check that the sender opted in to that. If the request fails, it hands you the link to open. If there is only an email address, it shows you the address and never sends the email itself. In mock mode it makes no network call and says what it would have done:
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={UNSUB_LOG} style={LOG} />
          <div style={LOG_CAPTION}>parseListUnsubscribe and unsubscribe on two made-up headers, in mock mode.</div>
        </div>

        {/* Safety */}
        <div className="section-label" style={{ fontFamily: MONO }}>Safe by default</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Settings come in three tiers. Base is safe and easy to reverse. Advanced holds the thresholds and ranking weights. Dangerous holds auto-delete, permanent delete, auto-sending replies, bulk actions and turning off the audit log, and all of them start off. A clean is a dry run unless you pass --apply. Reply drafts are saved as Gmail drafts unless auto-send is on. Every applied action goes in an audit log, and undo says plainly when it cannot reverse something:
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={UNDO_LOG} style={LOG} />
          <div style={LOG_CAPTION}>dispatch undo 2 --yes on the last two applied actions in the local audit log.</div>
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

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Write tests first. There are none, and decideTrust is a short pure function that a test would cover in minutes. The web app also only typechecks after the engine is built, because it imports the built output. I would also connect what it learns to the brief: the ranking has a weight for learned preferences, but the signal is fixed at 0. And I would retune the weights. The demo puts a club meeting two days away that still needs an RSVP above a lab that starts in an hour, because the open RSVP adds more to its score than the lab gains from being an hour away.
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
