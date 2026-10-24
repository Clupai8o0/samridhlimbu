import type { Metadata } from 'next'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { DownloadPdfButton } from '@/components/download-pdf-button'

const DESCRIPTION =
  'Resume of Samridh Limbu, a software engineer in Melbourne: final-year CS at Deakin, contract engineer for a US health-tech startup, CTO of Hoddle and GovHack 2025 winner.'

export const metadata: Metadata = {
  title: 'Resume',
  description: DESCRIPTION,
  alternates: { canonical: '/resume' },
  openGraph: {
    type: 'profile',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/resume',
    title: 'Resume · Samridh Limbu',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: 'Resume · Samridh Limbu',
    description: DESCRIPTION,
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

const SECTIONS = [
  {
    label: 'Experience',
    rows: [
      {
        head: 'Contract Software Engineer · Independent (remote)',
        meta: 'Jul 2026–present',
        body: "Cut search latency from seconds to under 200 ms on a US health-tech startup's data platform (under NDA), using database indexing and response compression. Owned frontend integration, new data-source integrations and a production hardening pass. Shipped dozens of production deploys. React/TypeScript, FastAPI, PostgreSQL, Google Cloud.",
      },
      {
        head: 'Founder · morgue',
        meta: 'Aug 2026–present',
        body: 'Opened the waitlist (morgue.clupai.com) for a SaaS that records repeatable video previews of UI animations, keeps the code and exports bundles for coding agents. Built around measured browser limits (16 of 40 WebGL contexts survive); multi-user accounts deployed ahead of launch. Node, Playwright, ffmpeg, Cloudflare R2.',
      },
      {
        head: 'CTO · Hoddle Melbourne',
        meta: 'Mar 2026–present',
        body: 'Built hoddle.org, a mentorship platform for international students, as its sole developer: 26K+ lines, 51 routes, 23 Postgres tables behind row-level security. Designed weighted mentor matching with nightly recompute. Shipped forums, live Q&As, DMs and real-time notifications. Placed 2nd at Study Melbourne Leadership 4Impact.',
      },
      {
        head: 'President · Deakin Software Engineering Club (DSEC)',
        meta: 'Jun 2025–present',
        body: 'Run a 190+ member club across five committees. Led development of its site, committee hub and member portal on a FastAPI backend with ~24 routers and an MCP server. Triaged a 212-finding security audit into 121 tickets. Hosted T2 2026 workshops and a hackathon.',
      },
      {
        head: 'Software Engineer · MyMor',
        meta: 'Aug–Sep 2026',
        body: "Took a beta rebuild of a startup's university student app to a release candidate: new design system, clubs, events, deals and claim moderation. Improved onboarding, accessibility and the mobile build; built a Firebase emulator stack with a 442-case security-rules test matrix. 400+ commits across five repos. React Native, React, Cloud Functions, Firebase.",
      },
      {
        head: 'Technical Lead & SEO · King Double Glazing (freelance)',
        meta: 'Mar–Aug 2026',
        body: 'Rebranded The Glass Discounters as King Double Glazing and rebuilt the site on Next.js 16 after ruling out WordPress. Desktop Lighthouse: Performance 99, SEO 100. Built an Instant Estimate Tool that shows a price before asking for contact details. Planned SEO across five keyword verticals.',
      },
      {
        head: 'Co-founder · TapCraft Studio',
        meta: 'Feb–Oct 2026',
        body: 'Built the headless Shopify + Next.js 16 storefront for 3D-printed NFC keychains. The 3D viewer switches colour variants in real time with Three.js material updates, no GLB swaps. Solved headless affiliate tracking with Web Pixel and cart context events. Led the B2C to B2B migration.',
      },
      {
        head: 'Residential Leader · DeakinRes',
        meta: 'Oct 2025–present',
        body: 'Support residents and build community among international and domestic students in Deakin accommodation.',
      },
      {
        head: 'Open Day Ambassador · Deakin University',
        meta: 'Aug 2026',
        body: 'Selected for the 2026 ambassador team. Represented Deakin to prospective students and families at Burwood Open Day.',
      },
    ],
  },
  {
    label: 'Education',
    rows: [
      {
        head: 'Deakin University · B. Computer Science (IoT Major)',
        meta: 'Jun 2024–Jun 2027 (expected) · WAM ~87',
        body: "Vice-Chancellor's International Scholarship (100% tuition) · VCPEP scholar. Capstone: leading the Notifications sub-team on Thoth Tech / OnTrack, with merged PRs on security, accessibility, notifications and pagination. Relevant: Data Structures & Algorithms · Advanced Algorithms · Concurrent & Distributed Programming · Software Architecture · Secure Backend · Embedded Systems.",
      },
    ],
  },
  {
    label: 'Awards',
    rows: [
      {
        head: 'Winner · GovHack 2025 · GovChat',
        meta: 'Dec 2025',
        body: 'Won with GovChat, a RAG platform that answers plain-English questions about Australian government datasets and gives every answer a trust score for grounding, provenance and retrieval strength, with an audit record. Python crawlers (Playwright for JS pages) feed OpenAI embeddings into ChromaDB behind a FastAPI API.',
      },
      {
        head: '2nd place · Study Melbourne Leadership 4Impact',
        meta: 'May 2026',
        body: 'Pitched Hoddle Melbourne, the mentorship platform for international students, in the final.',
      },
    ],
  },
  {
    label: 'Selected projects',
    rows: [
      {
        head: 'ARIA · multi-agent home-energy brain',
        meta: 'Next.js · TypeScript · Claude/OpenAI (ReAct) · IBM Carbon',
        body: 'Backtested on the real 13 Feb 2024 AEMO VIC1 price-cap day: ~$120 day credit, ~$61 ahead of an unmanaged home. One orchestrator coordinates five ReAct specialists (forecasting, battery scheduling, load shifting, grid monitoring, P2P trading) that explain their decisions. Recomputes client-side in a browser sandbox.',
      },
      {
        head: 'Tempo · workout app with an MCP server',
        meta: 'Next.js · FastAPI · Neon · OAuth · MCP',
        body: 'Built a live workout app where Claude or ChatGPT can read and log workouts. One FastAPI service powers REST, an OAuth-protected MCP server and the Next.js client. Each capability lives once in a shared service layer. 70 passing API tests at the phase checkpoint.',
      },
      {
        head: 'load-balancer · concurrent HTTP load balancer',
        meta: 'Go · Prometheus · SIT315',
        body: 'Implemented round-robin, weighted, least-connections and power-of-two-choices (EWMA latency) routing in Go across 21 iterations. Added AIMD adaptive concurrency limits, per-client token-bucket rate limiting, circuit breakers and outlier ejection. Exports Prometheus metrics and changes backends at runtime without a restart.',
      },
      {
        head: 'R1GPT · NEM connection-approval audit engine',
        meta: 'Next.js 14 · TypeScript · OpenAI gpt-4o · Zod · pdf-parse',
        body: 'Audits R1 grid-connection packages clause by clause against AEMO PSMG v3.0 and NER S5.2. Six deterministic assessors produce a readiness index and trace every finding to its regulatory section. Outputs predicted RFIs and rectification plans. 24/24 deterministic test cases pass. Built with Aarav.',
      },
      {
        head: 'Kairos · AI-native scheduling app',
        meta: 'Next.js 16 · Drizzle · PostgreSQL · Vercel AI SDK',
        body: 'Rewrote a 7,000+ line Python prototype as a Next.js app in daily use. Its pure-function scheduler (seven modules, side effects isolated in one file) places tasks in under 3 s. Oct 2026 rebuild adds a 14-day planner, check-ins that learn task durations and Google Calendar sync.',
      },
      {
        head: 'Lock-In · embedded focus tracker',
        meta: 'Arduino C++ · Raspberry Pi 5 · Python asyncio · MQTT · Gemini',
        body: 'Wired Arduino sensors to a Raspberry Pi 5 running a 5-state FSM across eight asyncio tasks, with Gemini vision every 75 s and an MQTT + SSE dashboard. Subsystems degrade independently: MQTT falls back to snapshot files. 51 tests across four suites, plus a systemd watchdog.',
      },
      {
        head: 'cstack · shared layer for coding agents',
        meta: 'Shell · Claude Code · Codex · DeepSeek',
        body: 'Cut cost per task 2.7× ($0.33 vs $0.90) at the same benchmark score by routing tasks between models. Built one set of rules, hooks and skills shared by six coding agents.',
      },
      {
        head: 'TapCraft Studio · headless commerce',
        meta: 'Next.js 16 · React Three Fiber · Shopify GraphQL',
        body: 'Rendered the 3D viewer on demand to cut GPU load. Made UpPromote affiliate tracking work on a headless store with Web Pixel and checkout linker parameters. Ran the B2C to B2B migration: catalogue restructure, redirect mapping, 3D customiser repositioned as a bulk-quote tool.',
      },
      {
        head: 'NMMUN · conference website + operations toolkit',
        meta: 'Next.js · TypeScript · Tailwind CSS · Vercel',
        body: 'Built the conference website used live by 500+ participants at a Model United Nations event.',
      },
      {
        head: 'Krishnaveni · headless CMS (freelance)',
        meta: 'Sanity Studio · TypeScript · Vercel',
        body: 'Built a Sanity headless CMS for Krishnaveni School so non-technical staff update pages, announcements and media without a developer.',
      },
      {
        head: 'notes-app · CI/CD showcase',
        meta: 'Next.js · MongoDB · Docker · Jenkins · AWS · Prometheus · Grafana',
        body: 'Built a full-stack notes app with JWT auth and middleware route guards, deployed on AWS. Set up Docker + Jenkins CI/CD with Snyk and SonarCloud scanning, plus Prometheus + Grafana monitoring.',
      },
      {
        head: 'Farmers Intuition · Hack48 (Mar 2026)',
        meta: 'FastAPI · Google Gemini · ElevenLabs',
        body: 'Built an AI precision-irrigation advisory platform in 48 hours: a two-layer ML engine plus Sage, a voice assistant that gives farm advice in plain language.',
      },
    ],
  },
  {
    label: 'Skills',
    rows: [
      {
        head: 'Languages',
        meta: '',
        body: 'TypeScript · Python · Go · SQL · C# · C/C++ (embedded)',
      },
      {
        head: 'Frameworks & libraries',
        meta: '',
        body: 'Next.js · React · Vite · FastAPI · SQLAlchemy/Alembic · Drizzle ORM · Tailwind CSS · React Three Fiber · TanStack Query',
      },
      {
        head: 'Data & infra',
        meta: '',
        body: 'PostgreSQL (pgvector) · Redis · Supabase · Neon · Firebase/Firestore · GCP (Cloud Run, Cloud SQL) · Vercel · Cloudflare · Docker · Linux/systemd · Prometheus · Grafana · Jenkins',
      },
      {
        head: 'AI & integrations',
        meta: '',
        body: 'MCP servers (OAuth) · Claude/OpenAI/Gemini APIs · Vercel AI SDK · RAG (ChromaDB) · Playwright · MQTT · Shopify Storefront API (GraphQL) · Google Calendar API · Resend',
      },
    ],
  },
]

export default function ResumePage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 600, margin: '0 auto', padding: '40px 28px' }}>

        <PageHeader className="no-print" />

        {/* Breadcrumb */}
        <div data-stagger-item className="no-print" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 22, letterSpacing: '0.02em' }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cat ~/resume.md<span className="t2-cursor thin" />
        </div>

        {/* Header */}
        <div data-stagger-item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--accent)', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: '0 0 4px', letterSpacing: '-0.02em', color: 'var(--fg)' }}>Samridh Limbu</h1>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)' }}>Software Engineer · Melbourne</div>
            <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginTop: 4 }}>samridh@samridhlimbu.com · samridhlimbu.com</div>
          </div>
          <DownloadPdfButton />
        </div>

        {/* Summary */}
        <p data-reveal style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.65, marginBottom: 24 }}>
          Final-year Computer Science student at Deakin (WAM ~87), graduating Jun 2027. Contract engineer for a US health-tech startup (search latency cut to under 200 ms), CTO and sole developer of a live mentorship platform, President of a 190+ member software club. Builds full-stack TypeScript/Python systems. GovHack 2025 winner. Open to SWE internships for summer 2026–27 and graduate roles from mid-2027.
        </p>

        {/* Sections */}
        {SECTIONS.map(sec => (
          <div key={sec.label} data-reveal style={{ marginBottom: 24 }}>
            <div className="section-label" style={{ fontFamily: MONO }}>{sec.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sec.rows.map((r, i) => (
                <div key={i}>
                  <div className="t2-resume-row">
                    <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: 'var(--fg)' }}>{r.head}</div>
                    {r.meta && <div className="t2-resume-meta" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)' }}>{r.meta}</div>}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 4, lineHeight: 1.6 }}>{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer hint — hidden in PDF */}
        <div className="no-print" style={{ marginTop: 20, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', fontFamily: MONO }}>
          <span style={{ color: 'var(--accent)' }}>❯</span> end of file
        </div>

      </div>
    </PageShell>
  )
}
