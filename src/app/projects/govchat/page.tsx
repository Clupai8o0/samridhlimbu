import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { ArticleChart } from '@/components/article-chart'
import { CodePre } from '@/components/code-pre'
import type { ChartBlock } from '@/lib/writing'

const DESCRIPTION =
  'GovHack 2025 winner. Ask in plain English and GovChat finds matching Australian government datasets, with sources and a five-factor trust score on every answer. In October 2026 I measured its search on 40 test questions and built a local prototype that finds the right dataset first for 28 of them instead of 21.'

export const metadata: Metadata = {
  title: 'GovChat',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/govchat' },
  openGraph: {
    type: 'article',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/projects/govchat',
    title: 'GovChat · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/govchat/trust.webp', width: 2880, height: 1800, alt: 'GovChat answering a question, with the Trust Meter showing 78 out of 100 and its five factors' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GovChat · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/govchat/trust.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'GovHack 2025', v: 'winner' },
  { k: 'datasets indexed', v: '2,016' },
  { k: 'right dataset first, of 40 tests', v: '21 → 28' },
  { k: 'zero-trust answers, of 40 tests', v: '2 → 0' },
]

const TIMELINE = [
  { date: 'Aug 2025', title: 'Problem framing', body: 'Australian government data is spread across the ABS and dozens of department sites. Finding a dataset means knowing which agency holds it and what it is called. GovChat lets you ask in plain English instead.' },
  { date: 'Aug 2025', title: 'Catalogue and embeddings', body: 'Two crawlers, both respecting robots.txt. One walks *.gov.au for CSV, XLS and PDF links (ZIP optional); the other pulls page text from seed sites, with optional Playwright for pages that need JavaScript. ABS dataflow metadata is flattened into one catalogue, embedded with OpenAI and loaded into ChromaDB.' },
  { date: 'Aug 2025', title: 'Trust layer', body: 'Each answer returns the top four datasets, a trust score from five factors and an audit id. The frontend shows the factors, the sources with similarity badges and an audit view; the API stores the full record under that id. A React Flow graph lets you browse related datasets.' },
  { date: 'Dec 2025', title: 'Won GovHack 2025', body: 'GovChat was named a GovHack 2025 winner.' },
  { date: 'Oct 2026', title: 'Measured and improved, locally', body: 'I ran both repos on my laptop, wrote 40 test questions and measured how often search finds the right dataset. Then I built an improved copy and measured it the same way. The copy is a local prototype: it is not deployed and not published.', current: true },
]

const DECISIONS = [
  ['metadata-only answers', 'answers from the raw data', 'The model sees only dataset titles and agencies, not the data itself, so any figure it writes would be made up. A grounding pass swaps figures like "4.2 million" for "[data available]", and the trust score drops to zero when a leftover figure is detected.'],
  ['geometric trust score', 'weighted average', 'The score multiplies each factor raised to its weight. If one factor is zero, such as an answer with an invented figure, the whole score is zero. A weighted average would still show 0.7 and look safe.'],
  ['an audit record per answer', 'a bare answer', 'Each response saves the query, the raw matches, the answer and the trust factors under an audit id, so anyone can see why a dataset came back.'],
]

const TRUST_CODE = `# trust score: weighted geometric blend of five factors
weights = {"grounding": 0.30, "provenance": 0.20, "retrieval": 0.20,
           "verification": 0.20, "recency": 0.10}

factors["grounding"] = 0.0 if detect_numeric_claims(answer) else 1.0
factors["retrieval"] = 1.0 if max_sim >= 0.90 else max_sim

score = 1.0
for name, w in weights.items():
    score *= factors[name] ** w`

const CHANGES = [
  ['File words in the index', 'won', 'Many Data.gov.au rows share one title, such as "Taxation Statistics 2021-22 - Dataset - Data.gov.au". Their file names differ, so each row now gets the words split out of its file name, like "ts 22 individual 26 rental property schedules". The datasets panel shows that line too.'],
  ['True similarity', 'fixed', 'The API turned Chroma\'s distance into a similarity with 1 − d²/2, but Chroma\'s distance is already squared. Badges and the trust score\'s retrieval factor came out too low, and dropped to 0 % for weaker matches. The copy uses the real cosine similarity.'],
  ['Keyword + vector search', 'lost', 'BM25 keyword search fused with the vector ranking (reciprocal rank fusion). It put the right dataset first less often, on both the original text and the improved text. It stays in the copy behind a switch, off by default.'],
]

// Verbatim lines from the showcase run's logs (similarity-check.log, trust-run.log), trimmed by selection only.
const SIM_LOG = 'chroma distance=1.3487  2-2cos=1.3487  cos=0.3256  original formula 1-d^2/2=0.0905'
const TRUST_LOG = `original zero trust: 2 of 40 | mean trust 0.776 | min 0.0 max 1.0 | http ms p50 45.0
improved zero trust: 0 of 40 | mean trust 0.857 | min 0.757 max 0.954 | http ms p50 46.3`

const STACK: [string, string][] = [
  ['Frontend', 'Next.js 15 · React 19 · TypeScript · Tailwind v4 · React Flow'],
  ['API', 'Python · FastAPI · pandas'],
  ['Retrieval', 'OpenAI text-embedding-3-small · ChromaDB'],
  ['Ingestion', 'Python crawlers · Playwright for JS pages · ABS dataflow metadata'],
  ['Oct 2026 tests', 'all-MiniLM-L6-v2 run locally · rank_bm25 · Playwright screenshots · matplotlib'],
]

const RETRIEVAL_CHART: ChartBlock = {
  type: 'chart',
  kind: 'hbar',
  title: 'Right dataset found, of 40 questions',
  subtitle: 'Four search versions; the prototype runs file words.',
  caption: 'Mean reciprocal rank: original 0.583, hybrid only 0.492, file words + hybrid 0.671, file words 0.740. Measured on my MacBook, October 2026. Search time stayed about the same: a median of 38.9 ms before, 39.3 ms after, over 120 searches each.',
  unit: 'of 40',
  categories: ['original', 'hybrid only', 'file words + hybrid', 'file words'],
  series: [
    { name: 'first', values: [21, 16, 24, 28] },
    { name: 'in the 4 the app shows', values: [25, 22, 30, 31] },
    { name: 'in the top 10', values: [30, 29, 35, 33] },
  ],
}

function LogBlock({ label, text, reveal = true, lang }: { label: string; text: string; reveal?: boolean; lang?: string })
{
  return (
    <figure data-reveal={reveal ? '' : undefined} style={{ margin: '0 0 12px' }}>
      <figcaption style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</figcaption>
      <CodePre style={{ margin: 0, padding: '12px 14px', background: 'var(--bg-2)', borderRadius: 2, fontFamily: MONO, fontSize: 12, lineHeight: 1.6, color: 'var(--fg-dim)', whiteSpace: 'pre', overflowX: 'auto' }} code={text} lang={lang} />
    </figure>
  )
}

export default function GovchatPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/govchat
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>GovChat</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● winner · GovHack 2025</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 'var(--text-base)', color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Search Australian government datasets in plain English. GovChat returns the closest datasets from the ABS and *.gov.au sites, a short answer checked for made-up figures, and a five-factor trust score backed by an audit record.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/Clupai8o0/govchat" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> frontend</a>
            <a href="https://github.com/Clupai8o0/govchat-api" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> api</a>
          </div>
        </div>

        {/* Metrics */}
        <div data-reveal className="cs-metrics" style={{ marginBottom: 28 }}>
          {METRICS.map(m => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 12 }}>
          <Shot
            src="/projects/govchat/trust.webp"
            alt="GovChat answering 'What languages do people speak at home?' with Trust 78/100. The side panel's Trust tab shows the Trust Meter at 78 and five factors: Content Grounding 100%, Source Provenance 100%, Retrieval Quality 29%, Fact Verification 100%, Data Recency 100%."
            width={2880}
            height={1800}
            caption="The original code answering a test question: trust 78/100, pulled down by retrieval quality at 29 %."
            priority
          />
        </div>
        <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 40px', maxWidth: 640 }}>
          Every screenshot here comes from a copy running on my laptop in October 2026, with no OpenAI key. So the reply line is the code&apos;s own fallback text, not model output, and search uses a local embedding model.
        </p>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            A team project for GovHack 2025. All the frontend commits are mine, and about half of the API commits. Public data is only useful if people can find it, and a wrong answer about government data does real harm. So GovChat answers from dataset metadata only, cites every source, and shows a trust score you can check against the audit record.
          </p>
        </div>

        {/* How it works */}
        <div className="section-label" style={{ fontFamily: MONO }}>How it works</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The catalogue holds 2,016 datasets: 1,216 from the ABS, 500 from Data.gov.au and 300 from the Department of Education. Each one becomes a single line of text and a single vector; nothing is chunked. A question is embedded the same way, and the four nearest datasets come back with the answer, the trust factors and an audit id.
        </p>
        <div style={{ margin: '0 0 40px' }}>
          <Shot
            src="/projects/govchat/architecture.svg"
            alt="Diagram. Built once: ingest with gov_data_scraper.py and Normalizer.py, datasets.csv with 2016 datasets, one text per dataset with no chunking, OpenAI text-embedding-3-small, a Chroma collection. Per question: FastAPI GET /query embeds the question, takes the 4 nearest datasets, answers from titles and agency only, swaps figures for [data available], scores trust on 5 factors and saves an audit record; then the Next.js frontend. Blue notes mark the October 2026 changes: file-name words and true cosine similarity."
            width={400}
            height={960}
            caption="Drawn from the code in govchat-api. The blue lines are the two changes in the October 2026 prototype."
            wide={{ src: '/projects/govchat/architecture-wide.svg', width: 784, height: 500 }}
          />
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 18 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{e.date}</div>
              <div style={{ fontFamily: MONO, fontSize: 12.5, color: 'var(--fg)', marginBottom: 3 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key technical decisions</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {DECISIONS.map(([a, b, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <span style={{ color: GREEN }}>{a}</span>
                  <span style={{ color: 'var(--muted-2)' }}> over </span>
                  <span style={{ color: 'var(--muted)', textDecoration: 'line-through' }}>{b}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust score */}
        <div className="section-label" style={{ fontFamily: MONO }}>Trust score</div>
        <div style={{ marginBottom: 12 }}>
          <LogBlock label="retrieval.py (simplified)" text={TRUST_CODE} reveal={false} lang="python" />
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 24px' }}>
          Grounding carries the most weight because invented figures are the worst failure. Retrieval reaches 1.0 only when the best match clears 0.90 similarity. The figure check is a pattern match, so it catches forms like &ldquo;4.2 million&rdquo; or &ldquo;5 percent&rdquo;, not every number. Two factors are placeholders for now: recency and verification sit at 1.0 until freshness tracking and checks on figures are built.
        </p>
        <div style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/govchat/audit.webp"
            alt="The Audit Details dialog showing JSON: the question, trust_score 78, and the first retrieved dataset with its source title, similarity 0.2934, recency_flag, preview text, id C21_G13_SAL, agency ABS and api_url."
            width={1340}
            height={1052}
            caption="View audit opens the stored record: the question, the score and the datasets that came back, each with its similarity."
          />
        </div>
        <div style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/govchat/tree.webp"
            alt="Tree view: the question 'What languages do people speak at home?' as the root node, with four Census 2021 G13 Language used at home datasets below it, each with an ABS tag, a similarity badge of 27 to 29 percent and Download and Explore buttons."
            width={2332}
            height={720}
            caption="Tree View: the question at the root and the four datasets it found, each with an Explore button."
          />
        </div>

        {/* Improved version */}
        <div className="section-label" style={{ fontFamily: MONO }}>October 2026: an improved prototype</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          A year on, I wanted to know how often GovChat finds the right dataset, and whether I could make that better. I made a copy, tried three changes and measured each one on the same questions. Two helped and one did not. The copy runs only on my laptop; the GovHack build is the one online.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          {CHANGES.map(([title, verdict, note], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 12 }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--accent)', paddingTop: 2 }}>0{i + 1}</span>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--fg)' }}>{title}</span>
                  <span style={{ color: verdict === 'lost' ? '#f59e0b' : GREEN }}> · {verdict}</span>
                </div>
                <div style={{ fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.6 }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          Same question, &ldquo;Tax deductions for rental properties&rdquo;, on both copies. The original&apos;s answer scored 0/100 for trust; the copy&apos;s scored 83/100.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 28 }}>
          <Shot
            src="/projects/govchat/rental-before.webp"
            alt="Original datasets panel: four cards all titled 'Taxation Statistics 2021-22 - Dataset - Data.gov.au', each with a 0% badge and ids starting GOV_TS22ACTIVITYSTATEME, GOV_TS22COMPANY05KEYIT, GOV_TS22TRUSTS06RENTAL and GOV_TS22COC01ALLFORMS."
            width={766}
            height={1300}
            caption="Before: four files with the same title, all at 0 %."
          />
          <Shot
            src="/projects/govchat/rental-after.webp"
            alt="Improved datasets panel: Taxation Statistics 2021-22, 2019-20, 2018-19 and 2022-23 cards at 39%, 38%, 38% and 38%. The first three show a File line reading 'ts 22 / 20 / 19 individual 26 rental property schedules'; the fourth card is cut off below its title."
            width={766}
            height={1300}
            caption="After: rental property schedules for several tax years, each told apart by its file line, at 38 to 39 %."
          />
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>How I measured it</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          I wrote 40 questions, such as &ldquo;How many cars does each household own?&rdquo; and &ldquo;Fringe benefits tax statistics&rdquo;. They are made up for this test, not taken from real users. Each one is labelled by hand with a pattern over the catalogue&apos;s titles, ids or links, so any matching dataset counts as right. A test script calls each version&apos;s own search function and records where the first right dataset lands. Both versions use the same local embedding model, all-MiniLM-L6-v2, because the OpenAI one needs a key. So these numbers compare the two versions; they are not the numbers of the live site.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <ArticleChart block={RETRIEVAL_CHART} />
        </div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          File words lifted the right-first count from 21 to 28 of 40 and broke none of the 21. In the top four it gained seven questions and lost one, &ldquo;Number of deaths by state&rdquo;. Keyword search on the original text put the right dataset first for 16 questions, down from 21. Added to the file words, it got a right dataset into the top 10 for two more questions but put one first for four fewer. The app only shows four, so I left it off.
        </p>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          The similarity fix shows up in the logs. Chroma&apos;s distance equals 2 − 2·cos, so the old formula turned a cosine of 0.33 into 0.09. Asked all 40 questions over HTTP, the original gave two answers a trust score of zero; the copy gave none.
        </p>
        <LogBlock label="similarity check, first match for ‘How do people get to work in each area?’" text={SIM_LOG} />
        <div style={{ marginBottom: 40 }}>
          <LogBlock label="trust over HTTP, 40 questions, both APIs" text={TRUST_LOG} />
        </div>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 96, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, flexWrap: 'wrap' }}>
          <a href="https://github.com/Clupai8o0/govchat" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> frontend</a>
          <a href="https://github.com/Clupai8o0/govchat-api" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}><Icon name="github" size={11} /> api</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
