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
  inlineLink: {
    color: ACCENT,
    textDecoration: 'none',
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
          Final-year CS at Deakin (WAM ~87), graduating Jun 2027. Contract engineer for a
          US health-tech startup (search latency cut to under 200 ms), CTO and sole developer of a live
          mentorship platform, President of a 190+ member software club. GovHack 2025 winner. Open
          to SWE internships for summer 2026–27 and graduate roles from mid-2027.
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
              Cut search latency from seconds to under 200 ms on a US health-tech startup’s data
              platform (under NDA). Owned frontend integration, data-source integrations and hardening.
              Dozens of production deploys. React/TypeScript, FastAPI, PostgreSQL.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Founder · morgue</Text>
              <Text style={s.entryMeta}>Aug 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Opened the waitlist (<Link src="https://morgue.clupai.com" style={s.inlineLink}>morgue.clupai.com</Link>)
              for a SaaS that records repeatable video previews of UI animations, keeps the code and
              exports bundles for coding agents. Built around measured browser limits (16 of 40 WebGL
              contexts survive); multi-user accounts deployed ahead of launch. Node, Playwright, ffmpeg, Cloudflare R2.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>CTO · Hoddle Melbourne</Text>
              <Text style={s.entryMeta}>Mar 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Built hoddle.org, an international-student mentorship platform, as sole developer. 25K+
              lines, 51 routes, 24 Postgres tables with RLS. Weighted mentor matching, forums, DMs,
              real-time notifications. 2nd place, Study Melbourne Leadership 4Impact.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>President · Deakin Software Engineering Club (DSEC)</Text>
              <Text style={s.entryMeta}>Jun 2025–present</Text>
            </View>
            <Text style={s.entryBody}>
              Run a 190+ member club across five committees. Lead developer of the platform the club
              runs on: public site (<Link src="https://dsec.club" style={s.inlineLink}>dsec.club</Link>),
              member portal and a role-based committee hub where every team manages events, sponsors,
              finance, tasks and meetings, all on one FastAPI API with an MCP server
              (<Link src="https://github.com/dsec-hub" style={s.inlineLink}>github.com/dsec-hub</Link>).
              Hosted T2 2026 workshops and a hackathon.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Software Engineer · MyMor</Text>
              <Text style={s.entryMeta}>Aug–Sep 2026</Text>
            </View>
            <Text style={s.entryBody}>
              Took a beta rebuild of a startup’s university student app to a release candidate: new
              design system, clubs, events, deals and claim moderation. Improved onboarding,
              accessibility and the mobile build; built a Firebase emulator stack with a 442-case
              security-rules test matrix. 400+ commits across five repos. React Native, React, Cloud
              Functions, Firebase.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Technical Lead & SEO · King Double Glazing (freelance)</Text>
              <Text style={s.entryMeta}>Mar–Aug 2026</Text>
            </View>
            <Text style={s.entryBody}>
              Led the rebrand and moved the site from WordPress to Next.js 16. Built a quote tool
              that prices each window from its measurements before asking for contact details.
              Lighthouse on the live site: 99 desktop, 95 phone, SEO 100.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Co-founder · TapCraft Studio</Text>
              <Text style={s.entryMeta}>Feb–Oct 2026</Text>
            </View>
            <Text style={s.entryBody}>
              Built the headless Shopify + Next.js 16 storefront for 3D-printed NFC keychains, with a
              real-time 3D colour-variant viewer and headless affiliate tracking. Led the B2C to B2B
              migration.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Deakin University · campus roles</Text>
              <Text style={s.entryMeta}>2025–present</Text>
            </View>
            <Text style={s.entryBody}>
              Residential Leader, DeakinRes (Oct 2025–present) · Open Day Ambassador (Aug 2026)
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
              Capstone, Thoth Tech / OnTrack: theme system and redesign, notifications lead, 103 merged PRs{'\n'}
              Relevant: Data Structures & Algorithms · Advanced Algorithms · Concurrent & Distributed
              Programming · Software Architecture · Secure Backend · Embedded Systems
            </Text>
          </View>
        </View>

        {/* ── Awards ──────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Awards</Text>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Winner · GovHack 2025 · GovChat</Text>
              <Text style={s.entryMeta}>Dec 2025</Text>
            </View>
            <Text style={s.entryBody}>
              RAG search over Australian government datasets, with a 5-factor trust score on every
              answer (FastAPI, ChromaDB).
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
              Backtested on the real 13 Feb 2024 AEMO VIC1 price-cap day: ~$120 day credit, ~$61 ahead
              of an unmanaged home. One orchestrator coordinates five ReAct specialists that explain
              their decisions.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Tempo · workout app with an MCP server</Text>
              <Link src="https://tempo.clupai.com" style={s.entryMetaLink}>tempo.clupai.com</Link>
            </View>
            <Text style={s.projectStack}>Next.js · FastAPI · Neon · OAuth · MCP</Text>
            <Text style={s.entryBody}>
              Lets Claude or ChatGPT read and log workouts. One FastAPI service powers REST, an
              OAuth-protected MCP server and the Next.js client. 70 passing API tests at the phase
              checkpoint.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>load-balancer · concurrent HTTP load balancer</Text>
              <Text style={s.entryMeta}>2025</Text>
            </View>
            <Text style={s.projectStack}>Go · Prometheus</Text>
            <Text style={s.entryBody}>
              Implemented round-robin, least-connections and power-of-two-choices (EWMA latency) routing
              over 21 iterations. Added AIMD concurrency limits, rate limiting, circuit breakers and
              outlier ejection, with Prometheus metrics.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Kairos · AI-native scheduling app</Text>
              <Link src="https://kairos.clupai.com" style={s.entryMetaLink}>kairos.clupai.com</Link>
            </View>
            <Text style={s.projectStack}>Next.js 16 · Drizzle ORM · PostgreSQL · Vercel AI SDK</Text>
            <Text style={s.entryBody}>
              Rewrote a 7,000+ line Python prototype as a scheduler in daily use: seven pure-function
              modules, side effects isolated in one file, sub-3 s placement. Oct 2026 rebuild adds a
              14-day planner.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>R1GPT · NEM connection-approval audit engine</Text>
              <Link src="https://github.com/Aarav261/R1gpt" style={s.entryMetaLink}>github.com/Aarav261/R1gpt</Link>
            </View>
            <Text style={s.projectStack}>Next.js 14 · TypeScript (strict) · OpenAI gpt-4o · Zod</Text>
            <Text style={s.entryBody}>
              Audits grid-connection packages clause by clause against AEMO PSMG v3.0 and NER S5.2. Six
              deterministic assessors score readiness and trace every finding to its regulatory section.
              24/24 cases pass. Built with Aarav.
            </Text>
          </View>

          <View style={s.entry} wrap={false}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Lock-In · embedded focus tracker</Text>
              <Text style={s.entryMeta}>2026</Text>
            </View>
            <Text style={s.projectStack}>Arduino C++ · Raspberry Pi 5 · Python asyncio · MQTT · Gemini</Text>
            <Text style={s.entryBody}>
              Wired Arduino sensors to a Raspberry Pi 5 running a 5-state FSM across eight asyncio
              tasks, with Gemini vision and an MQTT + SSE dashboard. Subsystems degrade independently.
              51 tests, systemd watchdog.
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
