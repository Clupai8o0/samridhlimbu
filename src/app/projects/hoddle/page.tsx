import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { PROJECTS } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: 'Mar 2026', title: 'Foundation', body: 'Joined as CTO and sole developer. Rejected every third-party auth provider — one Supabase service for auth, Postgres, and RLS. Set up full project scaffold: design tokens, Tailwind v4 theme, route groups, Supabase clients (server, browser, admin), and TypeScript strict mode.' },
  { date: 'Mar 2026', title: 'Auth & onboarding', body: 'Email magic link auth via admin.auth.admin.generateLink() and nodemailer, bypassing Supabase SMTP entirely. 5-step student wizard — university, country of origin, goals, challenges, fields of interest — Zod-validated on both client and server. Partial saves persist between steps.' },
  { date: 'Apr 2026', title: 'Matching algorithm', body: 'scoreMentor(): country +30, field overlap +15 each, challenges and goals +10 each. IO-separated — zero database calls in the scoring function. Scores stored in mentor_recommendations, recomputed nightly at 02:00 AEST via Vercel cron and on-demand after onboarding updates. "Why this mentor" reasoning line rendered on the dashboard.' },
  { date: 'Apr 2026', title: 'Mentor invite system', body: 'Token-gated invite flow: admin sends an email generating a row in mentor_invites with a hashed token, 14-day expiry, and audit columns. Mentor clicks through to /mentor-signup/[token], validated server-side before rendering. After magic-link auth, acceptMentorInvite() sets role=mentor and routes to a 4-step onboarding wizard.' },
  { date: 'Apr 2026', title: 'Content library', body: 'Mentors author articles with a Tiptap rich-text editor, embed YouTube/Vimeo via URL, and attach downloadable resources stored in Supabase Storage with signed URLs (25 MB limit). Students browse with type filter chips and offset pagination (18 per page). View counts increment atomically via server action on each load.' },
  { date: 'Apr 2026', title: 'Community forums', body: '5 seeded categories: First Semester Struggles, Career & Internships, Living in Melbourne, Academic Writing, Visa & Admin. Threads with two-level nested replies, 4 reaction types (Helpful, Thanks, Hugs, Insightful), view counter via SECURITY DEFINER RPC, anonymous posting for students, quote-reply and @mention shortcuts. Mentors always post as identified.' },
  { date: 'Apr 2026', title: 'Live Q&A and sessions', body: 'Mentors schedule sessions with title, description, datetime, duration, capacity, and a meeting URL. Students register (capacity-enforced server-side), submit questions with an anonymous toggle, and receive recordings after. Three Vercel cron jobs handle the full session lifecycle.' },
  { date: 'Apr 2026', title: 'Notification system', body: 'Single notify(recipientId, type, payload) helper writes to the notifications table and conditionally dispatches email based on per-type, per-channel preference toggles. In-app bell uses a Supabase Realtime subscription — unread count stays live without polling. 6 notification types.' },
  { date: 'Apr 2026', title: 'Direct messaging', body: 'Private conversations between students and mentors: conversations, messages, and conversation_read_cursors tables. Rate-limited to 30 messages per 10 minutes. new_chat_message notification fires with a 5-minute per-conversation debounce to avoid notification flooding.' },
  { date: 'Apr 2026', title: 'Google OAuth + feedback pipeline', body: 'Added Google sign-in alongside magic link. Floating feedback widget on all browse pages (Bug / Suggestion / Confusion / Other) forwarded to Airtable via a server action. Auth flows through /auth/confirm client component that handles the implicit-flow hash fragment the server callback route cannot reach.', current: true },
]

const DECISIONS = [
  ['supabase rls', 'application-layer guards', 'Row Level Security enforces data access at the database layer. A bug in middleware can expose data; a bug in application code cannot bypass RLS. Every table has RLS enabled with explicit policies. The admin client is the only surface that bypasses RLS — used only for system operations like notify() and recommendation recompute.'],
  ['three supabase clients', 'single shared client', 'Server client is cookie-bound, used in RSCs and server actions. Browser client powers the Realtime notification bell. Admin client uses the service role key and is never imported from app/ or components/ — the key has no NEXT_PUBLIC_ prefix and never ships to the browser.'],
  ['token table for invites', 'magic link via email provider', 'Owning the invite row means owning the full lifecycle: custom expiry, re-invite without blocking, revocation, reuse prevention, and full audit trail via created_at, expires_at, accepted_at. No dependency on third-party link delivery semantics.'],
  ['pure scoring function', 'coupled db + score logic', 'scoreMentor() takes two plain objects and returns a score and a reasoning string — zero database calls. computeRecommendationsForProfile() handles all Supabase interaction separately. The scoring function is importable into tests with no mocking required.'],
  ['nightly precompute', 'on-demand scoring', 'Match scores are read far more often than profiles change. Precomputing nightly keeps the dashboard to a single ORDER BY score DESC query, running at 02:00 AEST. Scores are also recomputed immediately after any profile update — on-demand only when stale.'],
  ['nodemailer + gmail smtp', 'supabase smtp', 'Generates the magic link server-side via admin.auth.admin.generateLink() and sends via nodemailer. Removes Supabase SMTP config dependency and fixes a production bug where links landed at /?code=… because NEXT_PUBLIC_SITE_URL was missing from Vercel env.'],
  ['claude.md + arch docs', 'ad-hoc onboarding', 'The repo has a CLAUDE.md master briefing, docs/architecture.md, docs/database-schema.md, docs/component-library.md, and docs/design.md. Future contributors and agents can understand the system without a walkthrough. Claude Code uses these docs on every task before touching a file.'],
]

const SCORE_LINES = [
  `<span style="color:#c084fc">export function</span> <span style="color:#60a5fa">scoreMentor</span>(student, mentor): <span style="color:#2dd4bf">ScoreResult</span> {`,
  `  <span style="color:#c084fc">let</span> score = <span style="color:#fcd34d">0</span>`,
  `  <span style="color:#c084fc">const</span> reasonParts: <span style="color:#2dd4bf">string</span>[] = []`,
  ``,
  `  <span style="color:#71717a">// country of origin — strongest signal (+30)</span>`,
  `  <span style="color:#c084fc">if</span> (student.country_of_origin === mentor.country_of_origin) {`,
  `    score += <span style="color:#fcd34d">30</span>`,
  `    reasonParts.<span style="color:#60a5fa">push</span>(<span style="color:#fbbf24">\`Also from \${mentor.country_of_origin}\`</span>)`,
  `  }`,
  ``,
  `  <span style="color:#71717a">// field of interest overlap (+15 each)</span>`,
  `  <span style="color:#c084fc">const</span> fieldMatches = student.fields_of_interest.<span style="color:#60a5fa">filter</span>(`,
  `    f =&gt; mentor.expertise.<span style="color:#60a5fa">includes</span>(f)`,
  `  )`,
  `  score += fieldMatches.length * <span style="color:#fcd34d">15</span>`,
  ``,
  `  <span style="color:#71717a">// challenges + goals overlap (+10 each)</span>`,
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
  ['/api/cron/session-reminders', 'hourly', '24h pre-session reminder emails to all registrants'],
  ['/api/cron/session-starting-soon', 'every 5 min', 'In-app + email push 10–20 min before sessions start'],
  ['/api/cron/recompute-recommendations', 'nightly 02:00 AEST', 'Recompute match scores for all onboarded students'],
]

export default function HoddlePage() {
  const hoddle = PROJECTS.find(p => p.slug === 'hoddle')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/hoddle
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Hoddle Melbourne</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · CTO</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            International mentorship platform connecting first-year students at Melbourne universities with verified senior mentors. Built end-to-end as sole developer — schema, auth, matching algorithm, community layer, and background infrastructure.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> hoddle.org</a>
            <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
          </div>
        </div>

        {/* Demo video */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <video
            src="/projects/hoddle/demo.mp4"
            controls
            playsInline
            style={{ width: '100%', display: 'block', maxHeight: 420 }}
          />
        </div>

        {/* Traction metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'verified mentors', v: '10+' },
            { k: 'early-access mentees', v: '20+' },
            { k: 'linkedin impressions', v: '14,040' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Hero screenshot */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <img src="/projects/hoddle/dashboard.png" alt="Student dashboard" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: '0 0 10px' }}>
            CTO and sole developer, Mar 2026–present. Hoddle is a one-to-many mentorship platform — mentors publish articles, host live Q&As, and tell their story; students get matched based on shared background and goals, browse a content library, and ask questions in forums. Eventually students graduate into mentors themselves.
          </p>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            I owned the full stack from day one: database schema and RLS policies, auth flows, matching algorithm, community features, background jobs, and admin tooling. The codebase sits at 26,000+ lines across 51 routes, 38 components, 19 server action files, and 17 migrations.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.1 }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 520 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Screenshot — matching dashboard */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <img src="/projects/hoddle/mentor-recom.png" alt="Mentor matching dashboard" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {DECISIONS.map(([a, b, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: GREEN }}>{a}</span>
                  <span style={{ color: 'var(--muted-2)' }}> › </span>
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Matching algorithm */}
        <div className="section-label" style={{ fontFamily: MONO }}>The matching algorithm</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={SCORE_LINES} filename="lib/matching/score.ts" lang="ts" />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Country is weighted highest because shared migration context — knowing what it&apos;s like to arrive from the same country — matters more than overlapping in the same field. The reasoning string is stored alongside the score and rendered on the student dashboard as a &quot;why this mentor&quot; line. Scores above a threshold of 10 count as real matches; below that, the algorithm backfills from top-ranked verified mentors to always surface five recommendations.
        </p>

        {/* Screenshot — forums */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden' }}>
          <img src="/projects/hoddle/forum.png" alt="Community forums" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Database */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Database</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 10 }}>17 migrations · ~1,500 lines of SQL</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
            {DB_TABLES.map(t => (
              <span key={t} className="pill" style={{ fontFamily: MONO, fontSize: 9 }}>{t}</span>
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, marginBottom: 6 }}>storage buckets</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {['content-media (public)', 'content-resources (signed)', 'session-recordings (private)', 'story-images (public)', 'avatars (public)'].map(b => (
              <span key={b} className="pill" style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted)' }}>{b}</span>
            ))}
          </div>
        </div>

        {/* Background jobs */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Background jobs</div>
          <div style={{ borderTop: '1px solid var(--border)' }}>
            {CRONS.map(([route, schedule, desc], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'start' }}>
                <div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--fg)', marginBottom: 3 }}>{route}</div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)' }}>{desc}</div>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', whiteSpace: 'nowrap', paddingTop: 2 }}>{schedule}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {Object.entries(hoddle.stack).map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Scale */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Scale</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
            {[
              { k: 'lines', v: '26K+' },
              { k: 'routes', v: '51' },
              { k: 'components', v: '38' },
              { k: 'server actions', v: '19' },
              { k: 'migrations', v: '17' },
            ].map((m, i) => (
              <div key={m.k} style={{ padding: '12px 14px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
                <div style={{ fontFamily: DISPLAY, fontSize: 18, color: 'var(--fg)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://hoddle.org" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> hoddle.org</a>
          <a href="https://github.com/clupai8o0/hoddle" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
