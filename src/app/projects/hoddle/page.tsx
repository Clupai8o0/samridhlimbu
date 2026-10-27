import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { Shot } from '@/components/case-study/shot'
import { PROJECTS } from '@/lib/data'

const DESCRIPTION =
  'CTO and sole developer of hoddle.org, a mentorship platform for first-year international students in Melbourne. Mentor matching, forums, live Q&As and access rules in Postgres. An October 2026 rebuild redid every page and hardened the database.'

export const metadata: Metadata = {
  title: 'Hoddle Melbourne · mentorship platform',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/hoddle' },
  openGraph: {
    type: 'article',
    url: '/projects/hoddle',
    title: 'Hoddle Melbourne · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/hoddle/home.webp', width: 2880, height: 1800, alt: 'The Hoddle home page from the October 2026 rebuild' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoddle Melbourne · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/hoddle/home.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const SCALE = [
  { k: 'lines of typescript', v: '37K+' },
  { k: 'pages', v: '55' },
  { k: 'postgres tables', v: '25' },
  { k: 'migrations', v: '45' },
  { k: 'sql test checks', v: '124' },
]

const TIMELINE = [
  { date: '13 Apr 2026', title: 'Foundation and auth', body: 'Supabase for auth, Postgres and storage, with row-level security on every table. Magic-link sign-in and a 5-step student onboarding, validated with Zod in the browser and again on the server.' },
  { date: 'Apr 2026', title: 'Matching and mentor invites', body: 'Weighted mentor matching, recomputed nightly and when a student finishes onboarding. Mentors join through a single-use invite link that expires after 7 days.' },
  { date: 'Apr 2026', title: 'Library, forums, sessions, messages', body: 'Mentors publish articles, videos and downloads. Students can ask in the forums anonymously; mentors always answer under their name. Live Q&As with a seat limit, direct messages, and a realtime notification bell.' },
  { date: '23 Apr 2026', title: 'The build on hoddle.org', body: '181 commits from 13 to 23 April. Google sign-in joined magic links, and a feedback widget files bugs and ideas. hoddle.org still serves this build.' },
  { date: '27 Oct 2026', title: 'The rebuild', body: 'A new component kit and every page redone, then 27 migrations that move rate limits, private meeting links and stricter write rules into the database, plus a check on sign-in links. It is finished on a branch and not deployed yet.', current: true },
]

const DECISIONS = [
  ['row-level security', 'application-layer guards', 'Access rules live in Postgres, so a bug in a page or an action cannot leak another user’s data. The service-role client that skips them is only used in server code: the cron jobs, notifications, the mentor invite sign-up and admin pages behind a role check.'],
  ['a hidden column', 'a second table for meeting links', 'Anyone can browse sessions, but only the mentor, registered students and admins should see the meeting link. Row-level security filters rows, not columns, so the column has its read grant removed and is read through one function that checks who is asking.'],
  ['rate limits in postgres', 'rate limits in middleware', 'The browser talks to the database API directly, so a limit in Next.js could be skipped. A trigger caps how fast one account can add threads, replies, messages, session questions, registrations and stories. Sign-in emails and public forms use an atomic counter.'],
  ['ask before signing in', 'sign in from any link', 'A magic link carries a session, so a link someone else requested could sign you into their account. The sign-in form now leaves a one-time code in the browser and the email link carries it back. If they do not match, the page asks “Sign in as …?” first.'],
  ['pure scoring function', 'scoring mixed with queries', 'scoreMentor() takes two plain objects and returns a score and a reason, with no database calls, so it can be tested without mocks. A separate function loads the data and writes the results.'],
  ['nightly precompute', 'scoring on every request', 'Scores are read far more often than profiles change, so the dashboard reads a stored list. A cron job rescores every student each night, and a student who finishes onboarding or edits their profile is rescored straight away.'],
]

const SCORE_LINES = [
  `<span style="color:#c084fc">export function</span> <span style="color:#60a5fa">scoreMentor</span>(student, mentor): <span style="color:#2dd4bf">ScoreResult</span> {`,
  `  <span style="color:#c084fc">let</span> score = <span style="color:#fcd34d">0</span>`,
  `  <span style="color:#c084fc">const</span> reasonParts: <span style="color:#2dd4bf">string</span>[] = []`,
  ``,
  `  <span style="color:#a1a1aa">// country of origin, the strongest signal (+30)</span>`,
  `  <span style="color:#c084fc">const</span> studentCountry = student.country_of_origin?.<span style="color:#60a5fa">toLowerCase</span>().<span style="color:#60a5fa">trim</span>()`,
  `  <span style="color:#c084fc">const</span> mentorCountry = mentor.profiles?.country_of_origin`,
  `    ?.<span style="color:#60a5fa">toLowerCase</span>().<span style="color:#60a5fa">trim</span>()`,
  `  <span style="color:#c084fc">if</span> (studentCountry &amp;&amp; mentorCountry &amp;&amp; studentCountry === mentorCountry) {`,
  `    score += <span style="color:#fcd34d">30</span>`,
  `    reasonParts.<span style="color:#60a5fa">push</span>(<span style="color:#fbbf24">\`Also from \${mentor.profiles!.country_of_origin}\`</span>)`,
  `  }`,
  ``,
  `  <span style="color:#a1a1aa">// field of interest overlap (+15 each)</span>`,
  `  <span style="color:#c084fc">const</span> fieldMatches = student.fields_of_interest.<span style="color:#60a5fa">filter</span>((f) =&gt;`,
  `    mentor.expertise.<span style="color:#60a5fa">includes</span>(f),`,
  `  )`,
  `  score += fieldMatches.length * <span style="color:#fcd34d">15</span>`,
  ``,
  `  <span style="color:#a1a1aa">// challenges and goals the mentor can help with (+10 each)</span>`,
  `  <span style="color:#c084fc">const</span> challengeMatches = student.challenges.<span style="color:#60a5fa">filter</span>((c) =&gt;`,
  `    mentor.help_challenges.<span style="color:#60a5fa">includes</span>(c),`,
  `  )`,
  `  <span style="color:#c084fc">const</span> goalMatches = student.goals.<span style="color:#60a5fa">filter</span>((g) =&gt;`,
  `    mentor.help_goals.<span style="color:#60a5fa">includes</span>(g),`,
  `  )`,
  `  score += (challengeMatches.length + goalMatches.length) * <span style="color:#fcd34d">10</span>`,
  ``,
  `  <span style="color:#a1a1aa">// each match also adds a line to reasonParts</span>`,
  `  <span style="color:#c084fc">return</span> {`,
  `    score,`,
  `    reasoning: reasonParts.<span style="color:#60a5fa">join</span>(<span style="color:#fbbf24">" · "</span>) || <span style="color:#fbbf24">"Verified mentor on Hoddle"</span>,`,
  `  }`,
  `}`,
]

const DB_TABLES = [
  'profiles', 'onboarding_responses', 'mentors', 'mentor_invites', 'mentor_recommendations', 'mentor_follows',
  'content_items', 'content_resources', 'content_tags', 'content_item_tags',
  'forum_categories', 'forum_threads', 'forum_posts', 'forum_reactions', 'success_stories',
  'live_sessions', 'session_registrations', 'session_questions',
  'conversations', 'messages', 'conversation_read_cursors',
  'notifications', 'notification_preferences', 'reviews', 'rate_limit_hits',
]

const BUCKETS = [
  'avatars (public)', 'content-media (public)', 'content-images (public)', 'story-images (public)', 'reviews (public)',
  'content-resources (private)', 'session-recordings (private)',
]

const CRONS: [string, string, string][] = [
  ['/api/cron/session-reminders', 'daily, 08:00 UTC', 'Emails and notifies everyone registered for a session that starts before the end of tomorrow, Melbourne time'],
  ['/api/cron/recompute-recommendations', 'daily, 16:00 UTC', 'Rescores mentors for every onboarded student'],
]

const NEXT = [
  ['Ship the rebuild', 'run the 27 new migrations on production and deploy the branch'],
  ['Mentee to mentor', 'a structured path for students to mentor the next cohort'],
  ['Matching v2', 'weights tuned from real usage instead of fixed values'],
]

export default function HoddlePage() {
  const hoddle = PROJECTS.find(p => p.slug === 'hoddle')

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/hoddle
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Hoddle Melbourne</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · CTO</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            A mentorship platform that matches first-year international students in Melbourne with verified senior mentors. I built it as the sole developer, from the schema to the background jobs. hoddle.org runs the April 2026 build. The October 2026 rebuild shown here is finished but not deployed yet.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> hoddle.org</a>
            <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> code</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/hoddle/home.webp"
            alt="The Hoddle home page: the headline “Navigate Melbourne with someone who’s been in your shoes”, a Find my mentor button, and a photo of a student at a tram stop with a verified mentor card over it"
            width={2880}
            height={1800}
            caption="The home page in the October rebuild. Screens on this page come from a local copy with seeded demo accounts."
            priority
          />
        </div>

        {/* Scale */}
        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
          {SCALE.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <div>
            <p style={{ ...PROSE, margin: '0 0 12px' }}>
              I was CTO and the only developer. Mentors publish articles, host live Q&amp;As and tell their story. Students are matched with mentors on where they come from, what they study and what they need help with, then read the library and ask in the forums.
            </p>
            <p style={{ ...PROSE, margin: 0 }}>
              Built through the Study Melbourne Leadership 4Impact program with co-founders Aarav Verma and Tanvir Kaur Sohi. We placed 2nd at the final pitch in May 2026. The numbers above are from the rebuild branch.
            </p>
          </div>
        </div>

        {/* Matching screenshot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/hoddle/matching.webp"
            alt="Mentors picked for you: three mentor cards, each with a university, a Follow button and a line such as “Has navigated career direction · Can help with build my network, land an internship”"
            width={2880}
            height={1520}
            caption="Mentors picked for a demo student. On each card, the line starting “Has navigated” is the reason scoreMentor() wrote."
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

        {/* Live build walkthrough: native aspect ratio, never cropped */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <div style={{ borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/hoddle/demo.mp4"
              poster="/projects/hoddle/demo-poster.webp"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Walkthrough of the April 2026 build on hoddle.org"
              style={{ width: '100%', height: 'auto', aspectRatio: '1664 / 1080', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>Walkthrough of the April build that hoddle.org serves.</div>
        </div>

        {/* Forum screenshot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/hoddle/forum-thread.webp"
            alt="A forum thread asking for the best suburbs to live in near the University of Melbourne, with two answers from verified mentors, and a side column listing the mentors in the thread and three related library pieces"
            width={2880}
            height={3330}
            caption="A forum thread with two mentor answers. The side column lists the mentors in the thread and related library pieces."
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

        {/* Rebuild screenshots */}
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/hoddle/mentor-session.webp"
            alt="A mentor's page for an upcoming session on 5 November 2026, with a Join meeting button, an empty questions list, a 0 of 60 registered count and a Meeting link card that reads “Only you and registered students can see it”"
            width={2880}
            height={2420}
            caption="A mentor's session page, with the meeting link card on the right."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/hoddle/sign-in-check.webp"
            alt="A page titled “Check it’s you” asking “Sign in as ahmad.khalil@seed.hoddle.dev?”, with Continue and This isn't me buttons"
            width={2880}
            height={1800}
            caption="Opening a sign-in link that this browser did not ask for."
          />
        </div>

        {/* Matching algorithm */}
        <div className="section-label" style={{ fontFamily: MONO }}>The matching algorithm</div>
        <div style={{ marginBottom: 14 }}>
          <CodeBlock lines={SCORE_LINES} filename="lib/matching/score.ts" lang="ts" />
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Trimmed for space. Country carries the most weight, because arriving from the same place matters more than studying the same field. Mentors pick the challenges and goals they can help with, and those are matched against what the student chose in onboarding. Only verified mentors are scored. A score of 10 or more counts as a match; if fewer than three mentors reach it, the top scores fill the list up to five.
        </p>

        {/* Database */}
        <div className="section-label" style={{ fontFamily: MONO }}>Database and jobs</div>
        <div style={{ marginBottom: 40 }}>
          <details style={{ marginBottom: 20 }}>
            <summary style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', cursor: 'pointer', padding: '13px 0' }}>25 tables · 45 migrations · 7 storage buckets</summary>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {DB_TABLES.map(t => (
                <span key={t} className="pill" style={{ fontFamily: MONO }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {BUCKETS.map(b => (
                <span key={b} className="pill" style={{ fontFamily: MONO, color: 'var(--fg-dim)' }}>{b}</span>
              ))}
            </div>
          </details>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CRONS.map(([route, schedule, desc]) => (
              <div key={route} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 16, rowGap: 4 }}>
                <div style={{ minWidth: 0, flex: '1 1 260px' }}>
                  <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg)', marginBottom: 4, overflowWrap: 'anywhere' }}>{route}</div>
                  <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{schedule}</div>
              </div>
            ))}
          </div>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: '20px 0 0' }}>
            Three SQL suites with 124 checks sign in as a student, a mentor and an admin, try what each should and should not be able to do, and roll back.
          </p>
        </div>

        {/* Phone */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/hoddle/phone-home.webp"
            alt="The Hoddle home page on a phone: a photo of a student at a tram stop above the headline and the line about free mentorship from senior students"
            width={1170}
            height={2380}
            caption="The home page on a phone."
            variant="mobile"
          />
        </div>

        {/* Stack */}
        {hoddle ? (
          <>
            <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
              {Object.entries(hoddle.stack).map(([label, items]) => (
                <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{(items as string[]).join(' · ')}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Testimonial */}
        <figure data-reveal style={{ margin: '0 0 40px' }}>
          <blockquote style={{ fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, margin: '0 0 8px', fontStyle: 'italic' }}>
            &ldquo;They had a really easy time navigating through the UI. The experience matched the promise.&rdquo;
          </blockquote>
          <figcaption style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Early-access cohort · Hoddle Melbourne
          </figcaption>
        </figure>

        {/* Roadmap */}
        <div className="section-label" style={{ fontFamily: MONO }}>What&apos;s next</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
          {NEXT.map(([label, desc]) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 8, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--accent)' }}>›</span>
              <div style={{ lineHeight: 1.6 }}>
                <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)' }}>{label}</span>
                <span style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)' }}>: {desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> hoddle.org</a>
          <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
