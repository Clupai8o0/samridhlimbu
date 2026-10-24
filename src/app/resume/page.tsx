import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { DownloadPdfButton } from '@/components/download-pdf-button'

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
        body: 'Production data platform for a US health-tech startup (under NDA): React/TypeScript front end, FastAPI + PostgreSQL back end on Google Cloud. Owned frontend integration, new data-source integrations and a production hardening pass, then dozens of production deploys. Cut search latency from seconds to under 200 ms with database indexing and response compression.',
      },
      {
        head: 'CTO · Hoddle Melbourne',
        meta: 'Mar 2026–present',
        body: 'Sole developer of hoddle.org, a mentorship platform for international students: auth, onboarding, weighted mentor matching with nightly recompute, content library, forums, live Q&As, DMs and realtime notifications. 26K+ lines, 51 routes, 23 Postgres tables behind row-level security. Placed 2nd at Study Melbourne Leadership 4Impact.',
      },
      {
        head: 'President · DSEC · Deakin Software Engineering Club',
        meta: 'Jun 2025–present',
        body: '190+ member club. Lead developer of the club platform: public site, committee hub and member portal (Next.js 16, Auth.js, Drizzle, Neon) on a FastAPI API with ~24 routers and an MCP server. Security audit at handover: 212 findings triaged into 121 tickets. Ran T2 2026 Coding Agents and Physical AI workshops, a Prompt-to-Build Sprint, the DSEC Day Hackathon and an internship panel. Built a tiered sponsorship program ($150–$1,000+).',
      },
      {
        head: 'Technical Lead & SEO · King Double Glazing (Freelance)',
        meta: 'Mar–Aug 2026',
        body: 'Rebrand and rebuild from The Glass Discounters after ruling out WordPress: Next.js 16, TinaCMS, Neon, Resend. Instant Estimate Tool shows a price before asking for contact details. Desktop Lighthouse Performance 99, SEO 100. SEO plan across five keyword verticals and suburb landing pages.',
      },
      {
        head: 'Co-founder · TapCraft Studio',
        meta: 'Feb–Oct 2026',
        body: 'Built the headless Shopify + Next.js 16 storefront. 3D product viewer with real-time colour variant switching (no GLB swaps). Solved headless affiliate tracking via Web Pixel + cart context events. Led the B2C → B2B migration.',
      },
      {
        head: 'Residential Leader · DeakinRes',
        meta: 'Oct 2025–present',
        body: 'Residential support and community facilitation for international and domestic student accommodation.',
      },
      {
        head: 'Open Day Ambassador · Deakin University',
        meta: 'Aug 2026',
        body: 'Selected for the 2026 ambassador team; represented Deakin to prospective students and families at Burwood Open Day.',
      },
      {
        head: 'Sessional IT Support · Deakin Law School',
        meta: 'Mar–May 2026',
        body: 'Technical support for Law School academics; scope expanded to lecture material preparation.',
      },
    ],
  },
  {
    label: 'Education',
    rows: [
      {
        head: 'Deakin University · B. Computer Science (IoT Major)',
        meta: 'Jun 2024–Jun 2027 (expected) · WAM ~87',
        body: "Vice-Chancellor's International Scholarship (100% tuition) · VCPEP scholar (Vice-Chancellor's Professional Excellence Program). Capstone: Thoth Tech / OnTrack, leading the Notifications sub-team; merged PRs on security, accessibility, notifications and pagination. Relevant: SIT221 Data Structures & Algorithms · SIT315 Concurrent & Distributed Programming · SIT320 Advanced Algorithms · SIT314 Software Architecture & Scalability for IoT · SIT331 Secure Backend · SIT210/SIT329 Embedded Systems.",
      },
    ],
  },
  {
    label: 'Awards',
    rows: [
      {
        head: 'Winner · GovHack 2025',
        meta: 'Dec 2025',
        body: 'GovChat: RAG platform for natural-language search over Australian government datasets. FastAPI crawler with Playwright fallback, OpenAI embeddings in ChromaDB, and a 5-factor trust score (grounding, provenance, retrieval, verification, recency) on every answer.',
      },
      {
        head: '2nd place · Study Melbourne Leadership 4Impact',
        meta: 'May 2026',
        body: 'Final pitch for Hoddle Melbourne, the international-student mentorship platform.',
      },
    ],
  },
  {
    label: 'Selected projects',
    rows: [
      {
        head: 'ARIA · multi-agent home-energy brain',
        meta: 'Next.js · TypeScript · Claude/OpenAI (ReAct) · IBM Carbon',
        body: 'Hierarchical multi-agent system: one orchestrator coordinates five specialists (forecasting, battery scheduling, load shifting, grid monitoring, P2P trading), each a ReAct loop that explains its decisions. Backtested on the real 13 Feb 2024 AEMO VIC1 price-cap day — ~$120 day credit, ~$61 ahead of an unmanaged home. Whole engine recomputes client-side in a browser sandbox.',
      },
      {
        head: 'Tempo · workout app with an MCP server',
        meta: 'Next.js · FastAPI · Neon · OAuth · MCP',
        body: 'Live at tempo.clupai.com. One Python service powers REST, an OAuth-protected MCP server and the Next.js client, so Claude or ChatGPT can read and log workouts. Every capability lives once in a shared service layer; 70 passing API tests at the phase checkpoint.',
      },
      {
        head: 'load-balancer · concurrent HTTP load balancer',
        meta: 'Go · Prometheus · SIT315',
        body: '21 iterations: round-robin, weighted, least-connections and power-of-two-choices with EWMA latency. AIMD adaptive concurrency limits, token-bucket rate limiting, circuit breakers and outlier ejection, with Prometheus metrics and zero-restart reconfiguration.',
      },
      {
        head: 'R1GPT · NEM connection-approval audit engine',
        meta: 'Next.js 14 · TypeScript · OpenAI gpt-4o · Zod · pdf-parse',
        body: 'Built with Aarav. Audits R1 grid-connection submission packages clause-by-clause against AEMO PSMG v3.0 and NER S5.2. Six deterministic assessors produce a readiness index (95 − Σ severity weights, capped at 95) with every finding traced to its regulatory section. Predicted RFIs + rectification plans. 24/24 deterministic test cases pass; no database.',
      },
      {
        head: 'Kairos · AI-native scheduling app',
        meta: 'Next.js 16 · Drizzle · PostgreSQL · Vercel AI SDK',
        body: 'Live and in daily use. Rewrote a 1,051-line Python/FastAPI prototype into a Next.js monorepo: pure-function scheduler pipeline across 7 modules that scores placements against deadlines, energy windows and calendar conflicts, sub-3 s placement. Oct 2026 rebuild adds a 14-day planner, check-ins that learn how long tasks really take, and Google Calendar sync.',
      },
      {
        head: 'Lock-In · embedded focus tracker',
        meta: 'Arduino C++ · Raspberry Pi 5 · Python asyncio · MQTT · Gemini',
        body: 'Desk-side tracker for SIT210: Arduino sensors plus a Pi 5 running a 5-state FSM across 8 asyncio tasks, Gemini vision every 75 s, MQTT + SSE dashboard. Every subsystem degrades on its own. 51 tests across 4 suites, systemd watchdog.',
      },
      {
        head: 'morgue · UI-animation library',
        meta: 'Node · Playwright · ffmpeg · Cloudflare R2',
        body: 'Local-first library that records repeatable video previews of UI animations, tags them with a fixed vocabulary and exports bundles for coding agents. Design shaped by measured browser limits (40 WebGL contexts created, 16 survive). Multi-user phases 1–2 deployed.',
      },
      {
        head: 'cstack · shared layer for coding agents',
        meta: 'Shell · Claude Code · Codex · DeepSeek',
        body: 'One set of rules, hooks and skills across six coding agents. Benchmarked model routing to cut cost per task 2.7× ($0.33 vs $0.90) at the same score.',
      },
      {
        head: 'TapCraft Studio · headless commerce',
        meta: 'Next.js 16 · React Three Fiber · Shopify GraphQL',
        body: 'Real-time 3D colour variant switching. Headless affiliate tracking (UpPromote + Web Pixel). Led B2C → B2B migration — catalogue restructure, redirect mapping, 3D customiser repositioned as bulk-quote tool.',
      },
      {
        head: 'NMMUN · conference website + operations toolkit',
        meta: 'Next.js · TypeScript · Tailwind CSS · Vercel',
        body: 'Production-ready conference website used live by 500+ participants at a Model United Nations event. Built for reliability and fast iteration under real event deadlines.',
      },
      {
        head: 'Krishnaveni · headless CMS (freelance)',
        meta: 'Sanity Studio · TypeScript · Vercel',
        body: 'Headless CMS for a real client — enables non-technical staff to independently update pages, announcements, and media without developer involvement.',
      },
      {
        head: 'notes-app · CI/CD showcase',
        meta: 'Next.js · MongoDB · Docker · Jenkins · AWS · Prometheus · Grafana',
        body: 'Full-stack app with a complete CI/CD pipeline, containerisation, AWS deployment and monitoring via Prometheus + Grafana.',
      },
      {
        head: 'Farmers Intuition · Hack48 (Mar 2026)',
        meta: 'FastAPI · Google Gemini · ElevenLabs',
        body: 'AI precision irrigation advisory platform built in 48 hours. Two-layer ML engine + voice assistant ("Sage") for natural-language farm advisory.',
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

        <div className="no-print"><PageHeader /></div>

        {/* Breadcrumb */}
        <div data-stagger-item className="no-print" style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 22, letterSpacing: 0.02 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cat ~/resume.md<span className="t2-cursor thin" />
        </div>

        {/* Header */}
        <div data-stagger-item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--accent)', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, margin: '0 0 4px', letterSpacing: -0.02, color: 'var(--fg)' }}>Samridh Limbu</h1>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)' }}>Software Engineer · Melbourne</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginTop: 4 }}>samridh@samridhlimbu.com · samridhlimbu.com</div>
          </div>
          <DownloadPdfButton />
        </div>

        {/* Summary */}
        <p data-reveal style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.65, marginBottom: 24 }}>
          Final-year CS (IoT) at Deakin, graduating Jun 2027. Contract engineer on a production health-tech data platform, CTO of a live mentorship platform, and President of a 190+ member software club. Ships full-stack TypeScript/Python systems end to end, from schema design to production deploys. GovHack 2025 winner. Open to SWE internships for summer 2026–27 and graduate roles from mid-2027.
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
                    {r.meta && <div className="t2-resume-meta" style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)' }}>{r.meta}</div>}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.55 }}>{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer hint — hidden in PDF */}
        <div className="no-print" style={{ marginTop: 20, fontSize: 10, color: 'var(--muted-2)', fontFamily: MONO }}>
          <span style={{ color: 'var(--accent)' }}>❯</span> end of file · press <kbd>q</kbd> to quit
        </div>

      </div>
    </PageShell>
  )
}
