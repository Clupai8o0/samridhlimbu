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
    paddingTop: 42,
    paddingBottom: 42,
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
    marginBottom: 11,
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
    marginBottom: 8,
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
          Penultimate-year CS (IoT) at Deakin (graduating Jun 2027). Building production-grade full-stack
          applications across scheduling, edtech, and e-commerce as both sole developer and technical
          co-founder. Strong in Next.js / TypeScript / Postgres. Available for SWE internships
          Nov 2026–Feb 2027 and grad roles from mid-2027.
        </Text>

        {/* ── Experience ──────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Experience</Text>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>CTO · Hoddle Melbourne</Text>
              <Text style={s.entryMeta}>Mar 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Sole developer. Built auth, 5-step onboarding wizard, and a weighted matching algorithm
              (country +30 / field +15 / expertise +10) with nightly recompute. Mentor invite system uses
              a token table with email validation, 14-day expiry, and full audit trail.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>President · Deakin Software Engineering Club (DSEC)</Text>
              <Text style={s.entryMeta}>Jun 2025–present</Text>
            </View>
            <Text style={s.entryBody}>
              190+ member club. Built tiered sponsorship prospectus ($150 Bronze → $1,000+ Platinum);
              initiated outreach to VicRoads, Zuum, AustralianSuper. Delivered "My First Australian Offer"
              workshop (30–80 attendees). Co-ran ACUCyS × DSEC Hackathon (5 project submissions).
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Technical Lead & SEO Consultant · King Double Glazing (Freelance)</Text>
              <Text style={s.entryMeta}>Mar 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Evaluated and rejected WordPress before building Next.js 15 + Tailwind v4 + Neon + Drizzle +
              Resend from scratch. Instant Estimate Tool surfaces price before requesting contact details.
              Full SEO strategy: five keyword verticals, suburb page template, LLM/GEO schema optimisation.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Co-founder · TapCraft Studio</Text>
              <Text style={s.entryMeta}>Feb 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Built headless Shopify + Next.js 16 frontend from scratch. 3D product viewer with real-time
              colour variant switching via Three.js material updates (no GLB swaps). Led full B2C → B2B
              migration including catalogue restructure and affiliate tracking via UpPromote.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Residential Leader · DeakinRes</Text>
              <Text style={s.entryMeta}>Oct 2025–present</Text>
            </View>
            <Text style={s.entryBody}>
              Residential community support and facilitation for international and domestic student
              accommodation.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Sessional IT Support · Deakin Law School</Text>
              <Text style={s.entryMeta}>Mar 2026–present</Text>
            </View>
            <Text style={s.entryBody}>
              Technical support for Law School academics; scope expanded to lecture material preparation.
            </Text>
          </View>
        </View>

        {/* ── Education ───────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Education</Text>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Deakin University · B. Computer Science (IoT Major)</Text>
              <Text style={s.entryMeta}>2024–2027 (expected)</Text>
            </View>
            <Text style={s.entryBody}>
              WAM ~87 · Vice-Chancellor's International Scholarship (100% tuition){'\n'}
              Relevant: SIT221 Data Structures & Algorithms · SIT331 Secure Backend Development ·
              SIT215 Computational Intelligence · SIT210 Embedded Systems
            </Text>
          </View>
        </View>

        {/* ── Projects ────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Projects</Text>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Kairos · AI-native scheduling app</Text>
              <Link src="https://kairos.app" style={s.entryMetaLink}>kairos.app</Link>
            </View>
            <Text style={s.projectStack}>
              Next.js 16 · Drizzle ORM · PostgreSQL · Vercel AI SDK · Better Auth
            </Text>
            <Text style={s.entryBody}>
              Rewrote a 1,051-line Python/FastAPI prototype into a clean Next.js monorepo. Pure-function
              scheduler pipeline across 7 modules; plugin system with Zod-validated I/O contract; theme +
              plugin marketplaces shipped in Phase 4. ~$1/mo infra cost.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>TapCraft Studio · headless commerce</Text>
              <Link src="https://tapcraft.shop" style={s.entryMetaLink}>tapcraft.shop</Link>
            </View>
            <Text style={s.projectStack}>
              Next.js 16 · React Three Fiber · Shopify Storefront API (GraphQL) · Tailwind v4
            </Text>
            <Text style={s.entryBody}>
              Real-time 3D colour variant switching via Three.js material updates (no GLB swaps). Headless
              affiliate tracking (UpPromote + Web Pixel). Led B2C → B2B migration.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>NMMUN · conference website + operations toolkit</Text>
              <Link src="https://nmmun.vercel.app" style={s.entryMetaLink}>nmmun.vercel.app</Link>
            </View>
            <Text style={s.projectStack}>Next.js · TypeScript · Tailwind CSS · Vercel</Text>
            <Text style={s.entryBody}>
              Production-ready conference website used live by 500+ participants at a Model United Nations
              event. Built for reliability and fast iteration under real event deadlines.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Krishnaveni · headless CMS (freelance)</Text>
              <Link src="https://krishnaveni-sanity-client.vercel.app" style={s.entryMetaLink}>live</Link>
            </View>
            <Text style={s.projectStack}>Sanity Studio · TypeScript · Vercel</Text>
            <Text style={s.entryBody}>
              Headless CMS for a real client — enables non-technical staff to independently update pages,
              announcements, and media without developer involvement.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>notes-app · CI/CD showcase</Text>
              <Text style={s.entryMeta}>2025</Text>
            </View>
            <Text style={s.projectStack}>Next.js · MongoDB · Docker · Jenkins · AWS · Prometheus · Grafana</Text>
            <Text style={s.entryBody}>
              Full-stack app with complete CI/CD pipeline, containerisation, AWS deployment, and
              observability via Prometheus + Grafana.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>load-balancer · systems engineering</Text>
              <Text style={s.entryMeta}>2025</Text>
            </View>
            <Text style={s.projectStack}>Go · Prometheus</Text>
            <Text style={s.entryBody}>
              Adaptive concurrent HTTP load balancer in Go — fault tolerance, feedback control, and
              observability under real-world traffic patterns.
            </Text>
          </View>

          <View style={s.entry}>
            <View style={s.entryHeader}>
              <Text style={s.entryHead}>Farmers Intuition · Hack48</Text>
              <Text style={s.entryMeta}>Mar 2026 · 48h</Text>
            </View>
            <Text style={s.projectStack}>FastAPI · Google Gemini · ElevenLabs</Text>
            <Text style={s.entryBody}>
              AI precision irrigation advisory platform built in 48 hours. Two-layer ML engine + voice
              assistant ("Sage") for natural-language farm advisory.
            </Text>
          </View>
        </View>

        {/* ── Skills ──────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Skills</Text>

          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Languages</Text>
            <Text style={s.skillValue}>TypeScript · Python · JavaScript · SQL · C#</Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Frameworks</Text>
            <Text style={s.skillValue}>
              Next.js · React · FastAPI · Tailwind CSS · Drizzle ORM · React Three Fiber · TanStack Query
            </Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Databases</Text>
            <Text style={s.skillValue}>PostgreSQL · Supabase · Neon</Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>Infra & tools</Text>
            <Text style={s.skillValue}>Vercel · Cloudflare · Docker · n8n · Claude Code</Text>
          </View>
          <View style={s.skillRow}>
            <Text style={s.skillLabel}>APIs</Text>
            <Text style={s.skillValue}>
              Shopify Storefront API (GraphQL) · Google Calendar API · Vercel AI SDK · Supabase Auth/RLS · Resend
            </Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}
