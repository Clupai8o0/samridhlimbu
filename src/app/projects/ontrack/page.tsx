import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'My Deakin capstone on OnTrack, the open-source system Deakin units use to track student work: I built its light and dark theme system and page redesign, led the notifications stream, fixed security and correctness bugs, and opened 24 upstream pull requests carrying the cohort\'s trimester of work.'

export const metadata: Metadata = {
  title: 'OnTrack · capstone',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/ontrack' },
  openGraph: {
    type: 'article',
    url: '/projects/ontrack',
    title: 'OnTrack · capstone · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/ontrack/dashboard-dark.webp', width: 2880, height: 1800, alt: 'The redesigned OnTrack progress dashboard in dark mode: a task list with status icons beside a burndown chart' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnTrack · capstone · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/ontrack/dashboard-dark.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'merged pull requests', v: '103' },
  { k: 'web commits, most in the cohort', v: '464' },
  { k: 'upstream pull requests opened', v: '24' },
]

const AREAS: [string, string][] = [
  ['theme', 'light, dark and system themes, colour tokens, contrast tests, and the redesign of the student and staff pages'],
  ['notifications', 'led the stream: event model, email, web push, the due-soon job, the bell, the dropdown and the notifications page'],
  ['audit fixes', 'five rounds of web fixes and more on the API, including permission and sign-in holes'],
  ['features', 'submission processing with retries, DOCX feedback, a verified second email, plagiarism rescans, a shared panel layout'],
  ['landing', 'merged the cohort\'s closed pull requests back onto 11.0.x, then cut the trimester into 24 upstream pull requests'],
]

const THEME_DECISIONS = [
  ['a written contract first', 'restyling page by page', 'Before any code I wrote down what light, dark and system mean, separating what the user chose from what is on screen. The account stores the choice, so "system" stays "system" and never gets saved as whatever the device showed that day. Every later change was checked against it.'],
  ['colour tokens', 'hard-coded colours', 'Pages read named tokens instead of hex values, so one switch changes the whole app. 166 files use them today, including the charts, which re-read their colours when the theme changes.'],
  ['set before the first paint', 'fixing it after load', 'The saved theme is applied before Angular starts, so a dark-mode user never sees a white flash. The choice is also saved on the account, so it follows them to another device.'],
  ['contrast as a test', 'contrast by eye', 'A spec measures every status, urgency and chart token against its background in both themes and fails below 4.5:1, the WCAG level for body text. Seven pairs failed, and I fixed them in both themes.'],
]

const NOTIF_DECISIONS = [
  ['one event column on the existing hub', 'a new notification system', 'OnTrack stored notifications in five categories, so "a tutor commented" and "your task is due tomorrow" got the same email. One new column names the exact event; the category still decides who can switch it off.'],
  ['split the work by event', 'split it by layer', 'Each event was one ticket with the same six steps, so nobody waited on another person\'s layer. The previous trimester split by layer and merged nine pull requests in total.'],
  ['push rides on email', 'push wired event by event', 'Delivery fans out from one service, so every event that sends an email also sends a push, with no extra code per event.'],
  ['review by risk', 'one rule for every change', 'A ticket that only added its own files needed one approval; anything touching a migration, config or the shared service needed two. With 21 people, review was the bottleneck, not coding.'],
]

const SECURITY: string[] = [
  'grading a task now needs assessment permission',
  'an LTI enrolment token is bound to its subject and works once',
  'a federated sign-in only matches on what the identity provider asserts',
  'overseer assessment results are scoped to the authorised project',
  'a SCORM pass is authorised wherever it is written',
  'students cannot upload to a finalised task',
  'every staff route in the web app has the role guard',
  'comment drafts belong to the signed-in user and clear on sign-out',
]

const STACK: [string, string[]][] = [
  ['Web', ['Angular 22', 'Angular Material', 'Tailwind CSS 4', 'Angular service worker', 'Vitest']],
  ['API', ['Rails 8', 'Grape', 'Sidekiq + sidekiq-cron', 'Redis', 'web-push (VAPID)', 'Minitest']],
  ['Dev', ['Docker Compose', 'Mailpit', 'GitHub Actions']],
]

function Decisions({ items }: { items: string[][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
      {items.map(([a, b, note]) => (
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
  )
}

export default function OnTrackPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/ontrack
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>OnTrack</h1>
            <span className="pill" style={{ fontFamily: MONO }}>capstone · jul–oct 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            OnTrack is the open-source system Deakin units use to track student tasks, feedback and portfolios. In my capstone I built its light and dark theme system and redesigned its pages, led the notifications stream, fixed security and correctness bugs from a product audit, landed the whole cohort&apos;s trimester on the team&apos;s 11.0.x branch, and opened it upstream as 24 pull requests.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/ontrack/dashboard-dark.webp"
            alt="The redesigned OnTrack progress dashboard in dark mode: a task list with coloured status icons beside a burndown chart"
            width={2880}
            height={1800}
            caption="The student progress dashboard in dark mode. All screenshots come from the team's 11.0.x branch running locally on the project's own demo seed, signed in as its made-up Demo Student."
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
            SIT374, Deakin&apos;s Thoth Tech capstone, Trimester 2 2026, with 42 students in the cohort. I was one of its three leads and the lead of the notifications stream. Across the team&apos;s API, web and deploy repos I merged 103 pull requests, and on the web app I made 464 of the trimester&apos;s commits, the most of anyone.
          </p>
        </div>

        {/* What I built */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I built</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {AREAS.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16, marginBottom: 4 }}>
              <span style={{ color: 'var(--accent)', width: 104, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Theme */}
        <div className="section-label" style={{ fontFamily: MONO }}>Theme system and redesign</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          OnTrack had one light look with colours written straight into each page. I wrote the theme contract, built the foundation (tokens, the theme service, startup and saving the choice to the account), with a teammate building out much of the service, and brought both themes up to WCAG contrast. The redesign of the student and staff pages was closed unmerged when pull request intake closed on 19 Sep, so I relanded it on 11.0.x: 144 conflicting files, 96 of its 100 commits mine, keeping every functional fix from the branch and the redesign&apos;s look on top.
        </p>
        <div data-reveal style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 12 }}>
          <Shot src="/projects/ontrack/home-light.webp" alt="The OnTrack home page in the light theme: Unit Hub card, My units and a Needs attention list" width={2880} height={1300} />
          <Shot src="/projects/ontrack/home-dark.webp" alt="The same OnTrack home page in the dark theme" width={2880} height={1300} />
        </div>
        <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 24px' }}>
          The same home page in both themes. With the preference on system, it follows the device.
        </p>
        <Decisions items={THEME_DECISIONS} />
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/ontrack/task-dark.webp"
            alt="An OnTrack task in dark mode: the task list on the left, task details with a due-date timeline in the middle, and a comments panel on the right"
            width={2880}
            height={1800}
            caption="A task in dark mode, inside the shared collapsible and resizable panel layout I built for the inbox, dashboard and task list."
          />
        </div>

        {/* Notifications */}
        <div className="section-label" style={{ fontFamily: MONO }}>Notifications</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Half the cohort, 21 people, worked on notifications, and I led the stream with one co-lead. I wrote the core: the event column and first email path, push subscriptions and delivery, the due-soon job, the bell, the dropdown and the notifications page. I opened 35 of the 72 pull requests merged into the notification branches and wrote 159 of the 360 API test cases. Teammates wrote most of the per-event emails, the Sidekiq email queue and the settings section.
        </p>
        <div data-reveal style={{ marginBottom: 16 }}>
          <Shot
            src="/projects/ontrack/bell-dark.webp"
            alt="The OnTrack home in dark mode with the notification bell open: four unread of five recent notifications for a new task, a task due soon, a changed due date, new feedback and a status change"
            width={2880}
            height={1130}
            caption="The bell and its dropdown, in the redesigned dark theme."
          />
        </div>
        <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <Shot
              src="/projects/ontrack/inbox-dark.webp"
              alt="The OnTrack notifications page in dark mode: mark all read and delete all buttons, filters by unit, category and event, and seven notifications grouped under Today and Yesterday"
              width={1600}
              height={1610}
              caption="The notifications page, grouped by day."
            />
          </div>
          <div style={{ flex: '0 1 220px', minWidth: 0 }}>
            <Shot
              src="/projects/ontrack/bell-mobile-dark.webp"
              alt="The OnTrack notification dropdown on a phone in dark mode"
              width={1170}
              height={1640}
              caption="The dropdown on a phone."
              variant="mobile"
            />
          </div>
        </div>
        <Decisions items={NOTIF_DECISIONS} />

        {/* Audit fixes */}
        <div className="section-label" style={{ fontFamily: MONO }}>Security and correctness fixes</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          A product audit of the codebase turned up defects across both apps. I fixed them in rounds: five on the web app and several on the API. The security ones:
        </p>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8, color: 'var(--muted)' }}>
          {SECURITY.map((s) => (
            <div key={s} style={{ display: 'flex', columnGap: 10 }}>
              <span style={{ color: 'var(--accent)' }}>›</span>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {/* Where it stands */}
        <div className="section-label" style={{ fontFamily: MONO }}>Where it stands</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Everything is merged into the cohort&apos;s fork, on its 11.0.x branch, including the redesign and the panel, accessibility and notification pull requests that closed unmerged when intake shut on 19 Sep, which I relanded afterwards. I then cut the trimester into 24 upstream pull requests to Thoth Tech, by area: theme, redesign, notifications, security, submissions, calendar, Unit Hub, accessibility and more. With everything merged together, 1,722 API tests and 1,440 web tests passed. All 24 are open and not yet reviewed, so production OnTrack does not run any of it.
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
          <a href="https://github.com/thoth-tech/doubtfire-web/pulls?q=is%3Apr+author%3AClupai8o0" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> upstream web PRs</a>
          <a href="https://github.com/thoth-tech/doubtfire-api/pulls?q=is%3Apr+author%3AClupai8o0" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> upstream API PRs</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
