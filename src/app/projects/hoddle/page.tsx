import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { Shot } from '@/components/case-study/shot'
import { PROJECTS } from '@/lib/data'

const DESCRIPTION =
  'CTO and sole developer of hoddle.org, a mentorship platform for international students in Melbourne: 26K+ lines, 51 routes, 23 Postgres tables behind row-level security, weighted mentor matching. 2nd at Study Melbourne Leadership 4Impact.'

export const metadata: Metadata = {
  title: 'Hoddle Melbourne · mentorship platform',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/hoddle' },
  openGraph: {
    type: 'article',
    url: '/projects/hoddle',
    title: 'Hoddle Melbourne · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/hoddle/dashboard.png', width: 1573, height: 991, alt: 'The Hoddle student dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoddle Melbourne · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/hoddle/dashboard.png'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const SCALE = [
  { k: 'lines', v: '26K+' },
  { k: 'routes', v: '51' },
  { k: 'postgres tables', v: '23' },
  { k: 'migrations', v: '17' },
  { k: 'server action files', v: '19' },
]

const TIMELINE = [
  { date: 'Mar 2026', title: 'Foundation and auth', body: 'Joined as CTO and sole developer. One Supabase project for auth, Postgres and row-level security. Magic-link sign-in and a 5-step student onboarding wizard, Zod-validated on client and server.' },
  { date: 'Apr 2026', title: 'Matching and mentor invites', body: 'Weighted mentor matching, recomputed nightly and after onboarding changes. Mentors join through a token-gated invite with a 14-day expiry and a full audit trail.' },
  { date: 'Apr 2026', title: 'Content and forums', body: 'Mentors publish articles, videos and downloads. Forums have two-level replies, reactions and anonymous posting for students. Mentors always post under their name.' },
  { date: 'Apr 2026', title: 'Live Q&As, DMs, notifications', body: 'Capacity-limited live sessions, rate-limited direct messages, and one notify() helper behind a realtime in-app bell and per-type email preferences.' },
  { date: 'Apr 2026', title: 'Google sign-in and feedback', body: 'Google OAuth alongside magic links, and a feedback widget on every browse page that files bugs and suggestions.', current: true },
]

const DECISIONS = [
  ['supabase rls', 'application-layer guards', 'Row-level security enforces access in the database, so a bug in middleware cannot leak another user’s data. Every table has explicit policies. Only system jobs, like notify() and the recommendation recompute, use the admin client.'],
  ['three supabase clients', 'one shared client', 'A cookie-bound server client for server components and actions, a browser client for the realtime bell, and an admin client that is never imported from app/ or components/. The service-role key has no NEXT_PUBLIC_ prefix and never reaches the browser.'],
  ['pure scoring function', 'scoring mixed with queries', 'scoreMentor() takes two plain objects and returns a score and a reason, with no database calls. A separate function does the Supabase work, so the scoring is tested without mocks.'],
  ['nightly precompute', 'scoring on every request', 'Scores are read far more often than profiles change. Precomputing at 02:00 AEST keeps the dashboard to one ORDER BY score DESC query, and a profile update recomputes that student straight away.'],
]

const SCORE_LINES = [
  `<span style="color:#c084fc">export function</span> <span style="color:#60a5fa">scoreMentor</span>(student, mentor): <span style="color:#2dd4bf">ScoreResult</span> {`,
  `  <span style="color:#c084fc">let</span> score = <span style="color:#fcd34d">0</span>`,
  `  <span style="color:#c084fc">const</span> reasonParts: <span style="color:#2dd4bf">string</span>[] = []`,
  ``,
  `  <span style="color:#a1a1aa">// country of origin, the strongest signal (+30)</span>`,
  `  <span style="color:#c084fc">if</span> (student.country_of_origin === mentor.country_of_origin) {`,
  `    score += <span style="color:#fcd34d">30</span>`,
  `    reasonParts.<span style="color:#60a5fa">push</span>(<span style="color:#fbbf24">\`Also from \${mentor.country_of_origin}\`</span>)`,
  `  }`,
  ``,
  `  <span style="color:#a1a1aa">// field of interest overlap (+15 each)</span>`,
  `  <span style="color:#c084fc">const</span> fieldMatches = student.fields_of_interest.<span style="color:#60a5fa">filter</span>(`,
  `    f =&gt; mentor.expertise.<span style="color:#60a5fa">includes</span>(f)`,
  `  )`,
  `  score += fieldMatches.length * <span style="color:#fcd34d">15</span>`,
  ``,
  `  <span style="color:#a1a1aa">// challenges + goals overlap (+10 each)</span>`,
  `  score += student.challenges.<span style="color:#60a5fa">filter</span>(c =&gt; mentor.expertise.<span style="color:#60a5fa">includes</span>(c)).length * <span style="color:#fcd34d">10</span>`,
  `  score += student.goals.<span style="color:#60a5fa">filter</span>(g =&gt; mentor.expertise.<span style="color:#60a5fa">includes</span>(g)).length * <span style="color:#fcd34d">10</span>`,
  ``,
  `  <span style="color:#c084fc">return</span> {`,
  `    score,`,
  `    reasoning: reasonParts.<span style="color:#60a5fa">join</span>(<span style="color:#fbbf24">" · "</span>) || <span style="color:#fbbf24">"Verified mentor on Hoddle"</span>,`,
  `  }`,
  `}`,
]

const DB_TABLES = [
  'profiles', 'onboarding_responses', 'mentors', 'mentor_invites',
  'content_items', 'content_resources', 'content_tags',
  'forum_categories', 'forum_threads', 'forum_posts', 'forum_reactions',
  'success_stories', 'live_sessions', 'session_registrations', 'session_questions',
  'notifications', 'notification_preferences', 'mentor_recommendations',
  'mentor_follows', 'conversations', 'messages', 'conversation_read_cursors', 'reviews',
]

const CRONS: [string, string, string][] = [
  ['/api/cron/session-reminders', 'hourly', 'Reminder emails to everyone registered, 24 hours before a session'],
  ['/api/cron/session-starting-soon', 'every 5 min', 'In-app and email nudge 10 to 20 minutes before a session starts'],
  ['/api/cron/recompute-recommendations', 'nightly 02:00 AEST', 'Recompute match scores for every onboarded student'],
]

const NEXT = [
  ['Mentee to mentor', 'a structured path for students to mentor the next cohort'],
  ['Matching v2', 'weights tuned from real usage instead of fixed values'],
  ['PWA', 'installable, with web push notifications'],
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
        <div data-stagger-item style={{ padding: '24px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Hoddle Melbourne</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · CTO</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            A mentorship platform that matches first-year international students in Melbourne with verified senior mentors. I built it end to end as the sole developer: schema, auth, matching, the community features and the background jobs.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> hoddle.org</a>
            <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> code</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/hoddle/dashboard.png"
            alt="The Hoddle student dashboard: a greeting, the student's goals and areas of interest, and a checklist of onboarding milestones with progress bars"
            width={1573}
            height={991}
            caption="The student dashboard on hoddle.org."
            priority
          />
        </div>

        {/* Scale */}
        <div data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
          {SCALE.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <div>
            <p style={{ ...PROSE, margin: '0 0 12px' }}>
              CTO and sole developer, Mar 2026 to now. Mentors publish articles, host live Q&amp;As and share their story. Students are matched on shared background and goals, browse the content library and ask questions in the forums.
            </p>
            <p style={{ ...PROSE, margin: 0 }}>
              Built through the Study Melbourne Leadership 4Impact program with co-founders Aarav Verma and Tanvir Kaur Sohi. We placed 2nd at the final pitch in May 2026.
            </p>
          </div>
        </div>

        {/* Demo video: native aspect ratio, never cropped */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden', background: 'var(--bg-2)' }}>
            <video
              src="/projects/hoddle/demo.mp4"
              controls
              muted
              playsInline
              preload="metadata"
              aria-label="Walkthrough of hoddle.org"
              style={{ width: '100%', height: 'auto', aspectRatio: '1664 / 1080', objectFit: 'contain', display: 'block' }}
            />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>Walkthrough of hoddle.org.</div>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20, borderLeft: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Matching screenshot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/hoddle/mentor-rec.webp"
            alt="The Hoddle student dashboard with recommended mentor cards, each showing university, expertise tags and a reason for the match"
            width={3022}
            height={1798}
            caption="Recommended mentors, each with a one-line reason for the match."
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

        {/* Matching algorithm */}
        <div className="section-label" style={{ fontFamily: MONO }}>The matching algorithm</div>
        <div style={{ marginBottom: 14 }}>
          <CodeBlock lines={SCORE_LINES} filename="lib/matching/score.ts" lang="ts" />
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Country carries the most weight because arriving from the same place matters more than studying the same field. The reason string is stored with the score and shown on the dashboard. A score above 10 counts as a real match; below that, top-ranked verified mentors fill the list so every student sees five.
        </p>

        {/* Database */}
        <div className="section-label" style={{ fontFamily: MONO }}>Database and jobs</div>
        <div style={{ marginBottom: 40 }}>
          <details style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '12px 0', marginBottom: 20 }}>
            <summary style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', cursor: 'pointer' }}>23 tables · 17 migrations · 5 storage buckets</summary>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
              {DB_TABLES.map(t => (
                <span key={t} className="pill" style={{ fontFamily: MONO }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {['content-media (public)', 'content-resources (signed)', 'session-recordings (private)', 'story-images (public)', 'avatars (public)'].map(b => (
                <span key={b} className="pill" style={{ fontFamily: MONO, color: 'var(--fg-dim)' }}>{b}</span>
              ))}
            </div>
          </details>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {CRONS.map(([route, schedule, desc]) => (
              <div key={route} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', columnGap: 16, rowGap: 4, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ minWidth: 0, flex: '1 1 260px' }}>
                  <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg)', marginBottom: 4, overflowWrap: 'anywhere' }}>{route}</div>
                  <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.5 }}>{desc}</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{schedule}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        {hoddle ? (
          <>
            <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
              {Object.entries(hoddle.stack).map(([label, items]) => (
                <div key={label} style={{ display: 'flex', columnGap: 12, rowGap: 2, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{(items as string[]).join(' · ')}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Testimonial */}
        <figure data-reveal style={{ margin: '0 0 40px', borderLeft: '1px solid var(--accent)', paddingLeft: 16 }}>
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
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> hoddle.org</a>
          <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
