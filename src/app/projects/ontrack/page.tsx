import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'

const DESCRIPTION =
  'I led the notifications stream of my Deakin capstone on OnTrack, the open-source system Deakin units use to track student work: an in-app bell, email and web push for about 15 events. It is merged in the team fork; the upstream pull requests are still open.'

export const metadata: Metadata = {
  title: 'OnTrack notifications · capstone',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/ontrack' },
  openGraph: {
    type: 'article',
    url: '/projects/ontrack',
    title: 'OnTrack notifications · capstone · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/ontrack/bell.webp', width: 2880, height: 1130, alt: 'The OnTrack home for a demo student with the notification bell open: four unread of five recent notifications for a new task, a task due soon, a changed due date, new feedback and a status change' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OnTrack notifications · capstone · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/ontrack/bell.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'notification PRs merged', v: '35/72' },
  { k: 'API test cases written', v: '159' },
  { k: 'students on the stream', v: '21' },
]

const MINE: [string, string][] = [
  ['api', 'the event column and first email path, push subscription storage and delivery, the due-soon job, collapsing repeat pushes, notification targets, tutor alerts, the digest email'],
  ['web', 'the service worker and push opt-in, the notification service, the bell, the dropdown, mark all read and delete, the notifications page'],
  ['team', 'most of the per-event emails, the Sidekiq email queue, push-click navigation, install and update prompts, the settings section, and the tests and risk docs'],
]

const DECISIONS = [
  ['one event column on the existing hub', 'a new notification system', 'OnTrack already stored notifications, but only in five categories, so "a tutor commented" and "your task is due tomorrow" were the same type and got the same email. One new column names the exact event. The category still decides who can switch it off, and each event gets its own wording and template.'],
  ['split the work by event', 'split it by layer', 'Each event was one ticket with the same six steps: hook the model, write the copy, write the email and in-app templates, and test it. Nobody waited on another person\'s layer. The previous trimester split by layer and merged nine pull requests in total.'],
  ['push rides on email', 'push wired event by event', 'Delivery fans out from one service. Once push subscriptions existed, every event that sends an email also sends a push, with no extra code per event.'],
  ['send email straight away, at first', 'queue it from day one', 'The development stack started Redis but never ran a Sidekiq worker, so queued mail would have vanished with no error. Email went out directly until a teammate moved it onto the queue as its own ticket.'],
  ['review by risk', 'one rule for every change', 'A ticket that only added its own files needed one approval. Anything touching a migration, config or the shared notification service needed two. With 21 people, review was the bottleneck, not coding.'],
]

const STACK: [string, string[]][] = [
  ['API', ['Rails 8', 'Grape', 'Sidekiq + sidekiq-cron', 'Redis', 'web-push (VAPID)', 'Minitest']],
  ['Web', ['Angular 22', 'Angular service worker', 'Tailwind CSS 4', 'Vitest']],
  ['Dev', ['Docker Compose', 'Mailpit']],
]

export default function OnTrackPage() {
  return (
    <PageShell>
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
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>OnTrack notifications</h1>
            <span className="pill" style={{ fontFamily: MONO }}>capstone · jul–oct 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            OnTrack is the open-source system Deakin units use to track student tasks, feedback and portfolios. For my capstone I led the stream that rebuilt its notifications: a bell in the app, a notifications page, an email per event, and push to a phone or desktop, each switched on or off by category.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/ontrack/bell.webp"
            alt="The OnTrack home for a demo student with the notification bell open: four unread of five recent notifications for a new task, a task due soon, a changed due date, new feedback and a status change"
            width={2880}
            height={1130}
            caption="The bell and its dropdown, which I built. All screenshots come from the team's 11.0.x branch running locally on the project's own demo seed, signed in as its made-up Demo Student."
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
            SIT374, Deakin&apos;s Thoth Tech capstone, Trimester 2 2026. Half the 42-student cohort, 21 people, worked on notifications, and I was the stream&apos;s lead with one co-lead. I planned the work, wrote the core, reviewed and merged, and wrote about half of the notification code that exists today: 52% of its API lines and 56% of its web lines by git blame.
          </p>
        </div>

        {/* Who built what */}
        <div className="section-label" style={{ fontFamily: MONO }}>Who built what</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {MINE.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16 }}>
              <span style={{ color: part === 'team' ? 'var(--muted)' : 'var(--accent)', width: 72, flexShrink: 0 }}>{part === 'team' ? 'others' : `me · ${part}`}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Inbox shots */}
        <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <Shot
              src="/projects/ontrack/inbox.webp"
              alt="The OnTrack notifications page: mark all read and delete all buttons, filters by unit, category and event, and seven notifications grouped under Today and Yesterday"
              width={1600}
              height={1610}
              caption="The notifications page, grouped by day, with mark all read and delete."
            />
          </div>
          <div style={{ flex: '0 1 220px', minWidth: 0 }}>
            <Shot
              src="/projects/ontrack/bell-mobile.webp"
              alt="The OnTrack notification dropdown on a phone, filling the screen width under the bell"
              width={1170}
              height={1640}
              caption="The same dropdown on a phone."
              variant="mobile"
            />
          </div>
        </div>


        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key decisions</div>
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

        {/* Settings shot */}
        <div data-reveal style={{ maxWidth: 520, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/ontrack/settings.webp"
            alt="OnTrack notification settings: email and push checkboxes for task, feedback and portfolio updates, a student summary email set to Never, and Unit Hub updates"
            width={1424}
            height={1646}
            caption="Per-category email and push switches. A teammate built this section."
          />
        </div>

        {/* Where it stands */}
        <div className="section-label" style={{ fontFamily: MONO }}>Where it stands</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          The work is merged into the cohort&apos;s fork, on its 11.0.x branch. Before the upstream pull requests went in, the full suites passed with everything merged together: 1,722 API tests and 1,440 web tests. The two pull requests to Thoth Tech are open and have not been reviewed yet, so production OnTrack does not run any of it. Known gaps: extension, group and tutorial events can&apos;t be switched off, and push permission is per device, which is why push failed in one mentor demo.
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
          <a href="https://github.com/thoth-tech/doubtfire-api/pull/122" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> API pull request</a>
          <a href="https://github.com/thoth-tech/doubtfire-web/pull/538" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> web pull request</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
