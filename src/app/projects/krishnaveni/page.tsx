import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'
import { ArticleChart } from '@/components/article-chart'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'A website for Krishnaveni School in Hyderabad. The 2025 build served every page in English, Hindi and Telugu from Sanity. The 2026 rebuild kept only English, since no one at the school could maintain the other two, moved page copy into code and left staff a small Sanity Studio, a ready-made editing app, for posts and facilities.'
// This shot shows no people, so it is safe as the share card.
const OG_IMAGE = {
  url: '/projects/krishnaveni/early-te-news.webp',
  width: 2880,
  height: 1320,
  alt: 'The 2025 Krishnaveni build at /te: a blue banner offering English, Hindi and Telugu, and an Under Construction notice in all three languages',
}

export const metadata: Metadata = {
  title: 'Krishnaveni',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/krishnaveni' },
  openGraph: {
    type: 'article',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/projects/krishnaveni',
    title: 'Krishnaveni · Samridh Limbu',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishnaveni · Samridh Limbu',
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const CODE = {
  fontFamily: MONO,
  fontSize: 'var(--text-xs)',
  lineHeight: 1.7,
  color: 'var(--fg-dim)',
  background: 'var(--bg-2)',
  borderRadius: 2,
  padding: '14px 16px',
  margin: 0,
  overflowX: 'auto' as const,
  whiteSpace: 'pre' as const,
}

const CODE_CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

const METRICS = [
  { k: 'languages in 2025', v: '3' },
  { k: 'section types today', v: '13' },
  { k: 'commits', v: '87' },
]

// studio/sanity.config.ts at commit 019e115 (Dec 2025), plugins only.
const STUDIO_CONFIG = `plugins: [
  structureTool(),
  visionTool(),
  table(),
  documentInternationalization({
    supportedLanguages: [
      { id: 'en', title: 'English' },
      { id: 'hi', title: 'Hindi' },
      { id: 'te', title: 'Telugu' },
    ],
    schemaTypes: schemaTypes.map((type) => type.name),
  }),
],`

// client/lib/queries.ts at 019e115, trimmed to the page lookup.
const PAGE_QUERY = `*[_type == "page" && language == $lang && pageType == $pageType][0]{
  seo{ metaTitle, metaDescription, metaKeywords },
  content[]{
    ...,
    _type == "heroSection" => { "imageUrl": images{ ... }, "ctaBtns": ... },
    _type == "bentoGallery" => { "imageUrl": images[]{ ... } },
  }
}`

// Early build vs today, counted from the repo at 019e115 and at HEAD (aa71c3f).
const THEN_NOW: [string, string, string][] = [
  ['Languages', 'English, Hindi, Telugu', 'English'],
  ['URLs', '/en, /hi, /te prefixes', 'no prefix; old ones redirect'],
  ['Page copy lives in', 'Sanity page documents', 'a generated TypeScript file'],
  ['Studio schema types', '17, incl. 11 section types', '2: post, facility'],
  ['Page section types', '11', '13'],
  ['Stack', 'Next.js 15, Sanity v3', 'Next.js 16, Sanity v5'],
]

const COMMITS_CHART: ChartBlock = {
  type: 'chart',
  kind: 'bar',
  title: 'Commits per month',
  subtitle: 'All 87 commits on the repo, June 2025 to May 2026.',
  caption: 'Two bursts: the first build in June 2025, and the rebuild in April and May 2026.',
  unit: 'commits',
  categories: ['Jun 25', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan 26', 'Feb', 'Mar', 'Apr', 'May'],
  series: [{ name: 'commits', values: [67, 2, 0, 0, 0, 0, 1, 0, 0, 1, 11, 5] }],
}

const TIMELINE = [
  { date: 'Jun–Jul 2025', title: 'First build, three languages', body: 'Next.js 15 and a Sanity v3 Studio in one repo. Every route under /en, /hi or /te. Home, about, admissions and contact were built; academics, campus life, parents and news showed a trilingual placeholder.' },
  { date: 'Mar 2026', title: 'Next.js 16', body: 'Upgraded the front end from Next.js 15 to 16.' },
  { date: '20 Apr 2026', title: 'More pages', body: 'Achievements, facilities, and the principal\'s and chairman\'s message pages, still under the three language prefixes. The Studio moved to Sanity v4.' },
  { date: '28 Apr 2026', title: 'Rebuild', body: 'Removed the language routes, the language middleware, the banner and the whole Studio. A script exported the English content from Sanity and another generated a data file from it. A third machine-translated it into Hindi and Telugu. The pages only ever read the English. Posts got a small admin area backed by Supabase.' },
  { date: '29 Apr 2026', title: 'Posts back in Sanity', body: 'Dropped the Supabase admin. A new Studio with one document type, post, first on Sanity v3 and on v5 that afternoon.' },
  { date: '30 Apr – 1 May 2026', title: 'Facilities', body: 'Deleted the translation script and its output. Added a facilities section and a facility type in the Studio.' },
  { date: '27 May 2026', title: 'Old links redirect', body: 'Old /en, /hi and /te URLs now redirect permanently to the English page at the same path.', current: true },
]

const DECISIONS = [
  ['a document per language', 'translated fields', 'In 2025, Sanity\'s document-internationalization plugin let each page, menu and call-to-action have a separate English, Hindi and Telugu document, linked together. Every query filtered on a hidden language field. A Telugu page could also have different sections from the English one. The cost is that a change has to be made in each language\'s document.'],
  ['the language in the URL', 'a language toggle', 'Each language had its own address, so /te/admissions could be shared as the Telugu page. Middleware only stepped in when a path had no prefix, and picked the browser\'s first language if it was one of the three.'],
  ['page copy in code', 'page copy in the CMS', 'Since the April 2026 rebuild, the marketing pages read a generated file instead of asking Sanity, so they need no CMS request to render. Changing their copy or layout now means a developer edits the data and redeploys. The handover guide sends layout and design changes to the developer.'],
  ['a two-type Studio', 'a custom admin', 'For less than a day, posts lived in a Supabase table behind a home-made login. The next day they were back in Sanity, where the post type takes text, image and video uploads. Facilities joined two days later.'],
  ['redirecting old URLs', 'letting them 404', 'Links to the 2025 pages, like /hi/admissions, get a permanent redirect to the English page instead of a dead end.'],
]

const STACK: [string, string[]][] = [
  ['Today', ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'GSAP', 'Motion', 'Radix UI', 'Sanity v5', '@sanity/client', 'Vercel']],
  ['2025', ['Next.js 15', 'Sanity v3', 'document-internationalization', '@sanity/table', 'next-sanity']],
]

export default function KrishnaveniPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/krishnaveni
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Krishnaveni</h1>
            <span className="pill" style={{ color: GREEN, fontFamily: MONO }}>● live · freelance</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 16px' }}>
            A website for Krishnaveni School, an English-medium school in Peerzadiguda, Hyderabad. The first build, in June 2025, served every page in English, Hindi and Telugu from Sanity. No one at the school was there to keep the Hindi and Telugu copy up to date, so the April 2026 rebuild kept only English. It moved the page copy into code and left the school&apos;s staff a small Sanity Studio, a ready-made editing app, for posts and facilities.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://krishnavenischool.co.in" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> krishnavenischool.co.in</a>
            <a href="https://github.com/clupai8o0/krishnaveni-sanity" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> code</a>
          </div>
        </div>

        {/* Hero: the 2025 build */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/krishnaveni/early-te-news.webp"
            alt="The 2025 Krishnaveni build at /te/news: a blue banner reading View this page in English or हिन्दी or తెలుగు, the school's menu, and an Under Construction notice with the same sentence and Go Home button in English, Hindi and Telugu"
            width={2880}
            height={1320}
            caption="The 2025 build at /te/news. Pages that were not built yet showed this notice in all three languages. Shots of the 2025 build come from the old code run locally on the repo's own sample content, so the menu shows English even at /te. Photos are blurred."
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
            Freelance work for a school in India. I built the first version in June and July 2025: a Next.js front end and a Sanity Studio in one repo, with every page in three languages. In March and April 2026 I came back to it, moved it to Next.js 16, added pages, and then changed where the content lives. That rebuild is what runs at krishnavenischool.co.in today.
          </p>
        </div>

        {/* The 2025 build */}
        <div className="section-label" style={{ fontFamily: MONO }}>The 2025 build: three languages</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Every address started with a language: /en, /hi or /te. If an address had none, the server checked which language the visitor&apos;s browser prefers and sent them to that version, or to English. A blue banner on every page offered the same page in all three languages.
        </p>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          In the Studio, Sanity&apos;s document-internationalization plugin handled the translations. Each page, menu and call-to-action could have an English, a Hindi and a Telugu document, and every front-end query asked for the one matching the URL. The public dataset still holds 9 English, 7 Hindi and 7 Telugu page documents.
        </p>
        <div data-reveal style={{ marginBottom: 14 }}>
          <CodePre style={CODE} code={STUDIO_CONFIG} lang="ts" />
          <div style={CODE_CAPTION}>studio/sanity.config.ts in the 2025 build: the three languages the Studio offered for every schema type.</div>
        </div>
        <div data-reveal style={{ marginBottom: 14 }}>
          <CodePre style={CODE} code={PAGE_QUERY} lang="js" />
          <div style={CODE_CAPTION}>The page query, trimmed. The language comes from the URL and the page type from the route.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 24px' }}>
          A page was a list of sections. The page schema accepted 11 section types, from hero and feature cards to a bento gallery, video testimonials and FAQs, and one SectionRenderer component mapped each section&apos;s type to a React component. Staff could add, reorder or remove sections in the Studio without a code change.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/krishnaveni/early-en-home.webp"
            alt="The 2025 build at /en: the language banner, the menu, and a hero reading About Krishnaveni School with Apply Now and Book a School Tour buttons over a blurred photo"
            width={2880}
            height={1300}
            caption="/en in the 2025 build. With Sanity switched off, every built route falls back to the repo's sample content, which is the About page copy."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/krishnaveni/early-te-news-mobile.webp"
            alt="The 2025 build on a phone at /te/news: the language banner, the logo and menu button, and the trilingual Under Construction notice with three stacked Go Home buttons"
            width={1170}
            height={2268}
            caption="The same notice on a phone."
            variant="mobile"
          />
        </div>

        {/* How it got here */}
        <div className="section-label" style={{ fontFamily: MONO }}>From 2025 to today</div>
        <div style={{ marginBottom: 24 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <ArticleChart block={COMMITS_CHART} />
        </div>

        {/* Then and now */}
        <div className="section-label" style={{ fontFamily: MONO }}>Then and now</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 1fr) 1.3fr 1.3fr', columnGap: 16, fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span />
            <span>2025</span>
            <span>today</span>
          </div>
          {THEN_NOW.map(([label, then, now]) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 1fr) 1.3fr 1.3fr', columnGap: 16, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5 }}>{label}</span>
              <span style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--fg-dim)', lineHeight: 1.5 }}>{then}</span>
              <span style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--fg)', lineHeight: 1.5 }}>{now}</span>
            </div>
          ))}
        </div>

        {/* Today's build */}
        <div className="section-label" style={{ fontFamily: MONO }}>Today&apos;s build</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The marketing pages read a single data file, 1,052 lines, generated from the Sanity export. It still renders through SectionRenderer, now with 13 section types. The updates and achievements lists read posts from Sanity on the server and refresh at most once a minute. The facilities page takes its cards from the facility documents. A one-page handover guide tells staff to sign in to the Studio and edit posts and facilities there, and to ask for anything else.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/krishnaveni/homepage.webp"
            alt="The live Krishnaveni home page: the headline Affordable, Values Driven Education in Peerzadiguda, Apply Now and Contact Us buttons, social links and four coloured cards, over a blurred photo"
            width={3024}
            height={1792}
            caption="The live home page at krishnavenischool.co.in, from the 2026 rebuild. Photos are blurred."
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

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Settle the language question before building for it. Three languages ran through the routing, the queries and the Studio of the first build, and the rebuild kept only English because no one at the school could maintain the other two. I would also make the sample-content switch cover every query. In the 2025 code the page-title lookup still called Sanity with sample content switched on, so running the old build offline for these shots took a one-line patch in a local copy.
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
          <a href="https://krishnavenischool.co.in" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> krishnavenischool.co.in</a>
          <a href="https://github.com/clupai8o0/krishnaveni-sanity" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
