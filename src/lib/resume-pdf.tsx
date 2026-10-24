import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer'

const ACCENT = '#1a56db'
const FG     = '#0a0a0a'
const FG_DIM = '#1c1c1c'
const MUTED  = '#3a3a3a'
const MUTED2 = '#5a5a5a'
const BORDER = '#d0d0d0'

const s = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    paddingTop: 34,
    paddingBottom: 30,
    paddingHorizontal: 50,
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: FG,
  },

  /* ── Header ───────────────────────────────────────────── */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 9,
    paddingBottom: 9,
    borderBottomWidth: 1.5,
    borderBottomColor: ACCENT,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 21,
    color: FG,
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: MUTED,
  },
  contactBlock: {
    alignItems: 'flex-end',
  },
  contactLink: {
    fontSize: 7.5,
    color: ACCENT,
    textDecoration: 'none',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 7.5,
    color: MUTED2,
    marginBottom: 2,
  },

  /* ── Summary ──────────────────────────────────────────── */
  summary: {
    fontSize: 8.5,
    color: FG_DIM,
    lineHeight: 1.55,
    marginBottom: 13,
  },

  /* ── Section ──────────────────────────────────────────── */
  section: {
    marginBottom: 9,
  },
  sectionLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 7,
    color: ACCENT,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },

  /* ── Entry ────────────────────────────────────────────── */
  entry: {
    marginBottom: 6,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1.5,
  },
  entryHead: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: FG,
    flex: 1,
  },
  entryMeta: {
    fontSize: 7.5,
    color: MUTED2,
    marginLeft: 8,
  },
  entryMetaLink: {
    fontSize: 7.5,
    color: ACCENT,
    textDecoration: 'none',
    marginLeft: 8,
  },
  entryBody: {
    fontSize: 8,
    color: MUTED,
    lineHeight: 1.5,
  },
  projectStack: {
    fontFamily: 'Courier',
    fontSize: 7.5,
    color: MUTED2,
    marginBottom: 2,
    marginTop: 1,
  },

  /* ── Skills ───────────────────────────────────────────── */
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3.5,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    color: FG_DIM,
    width: 68,
    flexShrink: 0,
  },
  skillValue: {
    fontSize: 8,
    color: MUTED,
    flex: 1,
    lineHeight: 1.4,
  },
})

export function ResumeDocument() {
  return (
    <Document
      title="Samridh Limbu — Resume"
      author="Samridh Limbu"
      subject="Software Engineer · Melbourne, AU"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ──────────────────────────────────────── */}
        <View style={s.header}>
          <View>
            <Text style={s.name}>Samridh Limbu</Text>
            <Text style={s.subtitle}>Software Engineer · Melbourne, AU</Text>
          </View>
          <View style={s.contactBlock}>
            <Link src="mailto:samridh@samridhlimbu.com" style={s.contactLink}>
              samridh@samridhlimbu.com
            </Link>
            <Link src="https://github.com/clupai8o0" style={s.contactLink}>
              github.com/clupai8o0
            </Link>
            <Link src="https://linkedin.com/in/samridh-limbu" style={s.contactLink}>
              linkedin.com/in/samridh-limbu
            </Link>
            <Link src="https://samridhlimbu.com" style={s.contactLink}>
              samridhlimbu.com
            </Link>
          </View>
        </View>

        {/* ── Summary ─────────────────────────────────────── */}
        <Text style={s.summary}>
          Final-year CS (IoT) at Deakin, graduating Jun 2027. Contract engineer on a production
          health-tech data platform, CTO of a live mentorship platform, and President of a
          190+ member software club. Ships full-stack TypeScript / Python systems end to end, from schema
          design to production deploys. GovHack 2025 winner. Open to SWE internships for summer
          2026–27 and graduate roles from mid-2027.
        </Text>

        {/* ── Experience ──────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Experience</Text>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Contract Software Engineer · Independent (remote)</Text>
              <Text style={s.entryMeta}>Jul 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Production data platform for a US health-tech startup (under NDA): React / TypeScript, FastAPI and
              PostgreSQL on Google Cloud. Owned frontend integration, new data-source integrations and a production
              hardening pass, then dozens of production deploys. Cut search latency from seconds to under 200 ms.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>CTO · Hoddle Melbourne</Text>
              <Text style={s.entryMeta}>Mar 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Sole developer of hoddle.org, an international-student mentorship platform: weighted mentor matching,
              forums, live Q&As, DMs, realtime notifications. 26K+ lines, 51 routes, 23 Postgres tables with RLS.
              2nd place, Study Melbourne Leadership 4Impact.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>President · Deakin Software Engineering Club (DSEC)</Text>
              <Text style={s.entryMeta}>Jun 2025–present</Text>
            </View>
            <Text style={s.entryBody}>
              190+ member club. Lead developer of the club platform (site, hub, member portal) on a FastAPI API with
              ~24 routers and an MCP server; security audit triaged 212 findings into 121 tickets. Ran T2 2026 workshops and a hackathon.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Technical Lead & SEO · King Double Glazing (Freelance)</Text>
              <Text style={s.entryMeta}>Mar–Aug 2026</Text>
            </View>
            <Text style={s.entryBody}>
              Rebrand and rebuild on Next.js 16, TinaCMS, Neon and Resend after ruling out WordPress. Instant Estimate
              Tool shows a price before asking for contact details. Desktop Lighthouse Performance 99, SEO 100.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Co-founder · TapCraft Studio</Text>
              <Text style={s.entryMeta}>Feb–Oct 2026</Text>
            </View>
            <Text style={s.entryBody}>
              Built the headless Shopify + Next.js 16 storefront with a real-time 3D colour-variant viewer (no GLB
              swaps) and headless affiliate tracking. Led the B2C-to-B2B migration.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Deakin University · campus roles</Text>
              <Text style={s.entryMeta}>2025–present</Text>
            </View>
            <Text style={s.entryBody}>
              Residential Leader, DeakinRes (Oct 2025–) · Open Day Ambassador (Aug 2026) · Sessional IT Support, Law School (Mar–May 2026)
            </Text>
          </View>
        </View>

        {/* ── Education ───────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Education</Text>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Deakin University · B. Computer Science (IoT Major)</Text>
              <Text style={s.entryMeta}>Jun 2024–Jun 2027 (expected)</Text>
            </View>
            <Text style={s.entryBody}>
              WAM ~87 · Vice-Chancellor’s International Scholarship (100% tuition) · VCPEP scholar{'\n'}
              Capstone: Thoth Tech / OnTrack, leading the Notifications sub-team{'\n'}
              Relevant: Data Structures & Algorithms · Concurrent & Distributed Programming · Advanced Algorithms ·
              Software Architecture & Scalability · Secure Backend Development · Embedded Systems
            </Text>
          </View>
        </View>

        {/* ── Awards ──────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Awards</Text>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Winner · GovHack 2025 — GovChat</Text>
              <Text style={s.entryMeta}>Dec 2025</Text>
            </View>
            <Text style={s.entryBody}>
              RAG search over Australian government datasets with a 5-factor trust score on every answer (FastAPI, ChromaDB).
            </Text>
          </View>
        </View>

        {/* ── Projects ────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Projects</Text>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>ARIA · multi-agent home-energy brain</Text>
              <Link src="https://github.com/Clupai8o0/aria" style={s.entryMetaLink}>github.com/clupai8o0/aria</Link>
            </View>
            <Text style={s.projectStack}>Next.js · TypeScript · Claude / OpenAI (ReAct) · IBM Carbon</Text>
            <Text style={s.entryBody}>
              One orchestrator coordinating five ReAct specialists (forecasting, battery scheduling, load shifting,
              grid monitoring, P2P trading) that explain their decisions. Backtested on the real 13 Feb 2024 AEMO VIC1
              price-cap day: ~$120 day credit, ~$61 ahead of an unmanaged home.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Tempo · workout app with an MCP server</Text>
              <Link src="https://tempo.clupai.com" style={s.entryMetaLink}>tempo.clupai.com</Link>
            </View>
            <Text style={s.projectStack}>Next.js · FastAPI · Neon · OAuth · MCP</Text>
            <Text style={s.entryBody}>
              One FastAPI service powers REST, an OAuth-protected MCP server and the Next.js client, so Claude or
              ChatGPT can read and log workouts. 70 passing API tests at the phase checkpoint.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>load-balancer · concurrent HTTP load balancer</Text>
              <Text style={s.entryMeta}>2025</Text>
            </View>
            <Text style={s.projectStack}>Go · Prometheus</Text>
            <Text style={s.entryBody}>
              21 iterations: round-robin, least-connections and power-of-two-choices with EWMA latency; AIMD
              concurrency limits, rate limiting, circuit breakers and outlier ejection, with Prometheus metrics.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Kairos · AI-native scheduling app</Text>
              <Link src="https://kairos.clupai.com" style={s.entryMetaLink}>kairos.clupai.com</Link>
            </View>
            <Text style={s.projectStack}>Next.js 16 · Drizzle ORM · PostgreSQL · Vercel AI SDK</Text>
            <Text style={s.entryBody}>
              Live and in daily use. Rewrote a 1,051-line Python prototype into a pure-function scheduler pipeline
              across 7 modules (sub-3 s placement); Oct 2026 rebuild adds a 14-day planner that learns how long
              tasks really take, with Google Calendar sync.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>R1GPT · NEM connection-approval audit engine</Text>
              <Link src="https://github.com/Aarav261/R1gpt" style={s.entryMetaLink}>github.com/Aarav261/R1gpt</Link>
            </View>
            <Text style={s.projectStack}>Next.js 14 · TypeScript (strict) · OpenAI gpt-4o · Zod</Text>
            <Text style={s.entryBody}>
              Built with Aarav. Audits grid-connection packages clause-by-clause against AEMO PSMG v3.0 and NER S5.2.
              Six deterministic assessors yield a readiness index with every finding traced to its regulatory
              section. 24/24 deterministic cases pass.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Lock-In · embedded focus tracker</Text>
              <Text style={s.entryMeta}>2026</Text>
            </View>
            <Text style={s.projectStack}>Arduino C++ · Raspberry Pi 5 · Python asyncio · MQTT · Gemini</Text>
            <Text style={s.entryBody}>
              Arduino sensors plus a Raspberry Pi 5 running a 5-state FSM across 8 asyncio tasks, Gemini vision and an
              MQTT + SSE dashboard; each subsystem degrades on its own. 51 tests, systemd watchdog.
            </Text>
          </View>
        </View>

        {/* ── Skills ──────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Skills</Text>

          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Languages</Text>
            <Text style={s.skillValue}>TypeScript · Python · Go · SQL · C# · C/C++ (embedded)</Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Frameworks</Text>
            <Text style={s.skillValue}>
              Next.js · React · Vite · FastAPI · SQLAlchemy · Drizzle ORM · Tailwind CSS · React Three Fiber
            </Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Data & infra</Text>
            <Text style={s.skillValue}>
              PostgreSQL (pgvector) · Redis · Firebase · GCP (Cloud Run, Cloud SQL) · Vercel · Docker · Linux · Prometheus
            </Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>AI & APIs</Text>
            <Text style={s.skillValue}>
              MCP servers (OAuth) · Claude / OpenAI / Gemini APIs · RAG (ChromaDB) · Playwright · MQTT · Shopify GraphQL
            </Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
