import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { PROJECTS } from '@/lib/data'

const DESCRIPTION =
  'Website for a Melbourne double glazing business: a small Next.js 16 site and a quote tool that shows a real price from your window sizes before it asks who you are.'
const OG_IMAGE = { url: '/projects/kdg/hero.webp', width: 2880, height: 1800, alt: 'King Double Glazing home page' }

export const metadata: Metadata = {
  title: 'King Double Glazing',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/king-glazing' },
  openGraph: {
    type: 'article',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: '/projects/king-glazing',
    title: 'King Double Glazing · Samridh Limbu',
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'King Double Glazing · Samridh Limbu',
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'desktop performance', v: '99' },
  { k: 'phone performance', v: '95' },
  { k: 'SEO', v: '100' },
]

const AREAS: [string, string][] = [
  ['quote tool', 'four glass options priced per square metre, a row per window, and a total that updates as you type'],
  ['quote handling', 'the server checks the price again, saves the quote, and emails the business a link to confirm it'],
  ['content', 'a TinaCMS visual editor over JSON files in the repository, prices and the second-storey charge included'],
  ['site', 'home, services, gallery, about, contact and warranty pages, with structured data for search engines'],
]

const QUOTE_DECISIONS = [
  ['measured windows', 'a questionnaire', 'The April version asked about property type, window count, orientation, frame condition and priority, then showed a price range. In July I rebuilt it as one form: choose a glass, enter each window\'s height and width, and get one total. All four glass prices stay on screen, each row shows its own area.'],
  ['the server works the price out again', 'trusting the browser', 'The browser shows the total, but on submit the server recalculates it with the same pricing code and rejects the quote if the two differ by more than 5%, so an edited page cannot send in a much cheaper one.'],
  ['the business confirms first', 'an instant auto-reply', 'A sent quote is saved as pending, and the business gets an email with a confirm link. Only after they click it is the customer emailed the confirmed quote, so no confirmed quote goes out that the business has not checked.'],
  ['prices as content', 'prices in code', 'The four prices per square metre and the second-storey charge live in TinaCMS, so the business can change them in the visual editor without a developer.'],
]

const SITE_DECISIONS = [
  ['five pages', 'a page per suburb', 'The first plan was a large SEO site with suburb pages and a blog, and the first week built it. On 15 April it was cut to five pages plus the quote tool and a warranty page. Every page has a button to the quote tool.'],
  ['tinacms', 'sanity', 'Sanity went in on 28 April and came out two days later. TinaCMS keeps content as JSON files in the same git repository as the code, so every edit is a commit and the content lives with the code.'],
]

const STACK: [string, string[]][] = [
  ['Frontend', ['Next.js 16', 'React 19', 'Tailwind CSS 4', 'TinaCMS']],
  ['Backend', ['Server actions', 'zod', 'Neon Postgres', 'Drizzle', 'Resend + React Email']],
  ['Infra', ['Vercel', 'pnpm']],
]

function Decisions({ items }: { items: string[][] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
      {items.map(([a, b, note]) => (
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
  )
}

export default function KingGlazingPage() {
  const kg = PROJECTS.find(p => p.slug === 'king-glazing')!

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/king-glazing
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>King Double Glazing</h1>
            <span className="pill" style={{ color: GREEN, fontFamily: MONO }}>● live · freelance</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 16px' }}>
            The website of a Melbourne glazier that fits double-glazed glass into the window frames people already have. I built it from an empty repository: a small site and a quote tool that shows a real price as soon as you enter your window sizes, before it asks who you are. The business edits its own pages and prices in a visual editor.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://www.kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> live site</a>
            <a href={kg.github} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          </div>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/kdg/hero.webp"
            alt="King Double Glazing home page on desktop: a yellow promo bar, the headline Why choose the King double glazing system, a Generate my quote button and a 10-year warranty badge"
            width={2880}
            height={1800}
            caption="The home page. All screenshots are the business's own code from its repository, run on my machine with analytics blocked. The window sizes in the quote are made up, and prices are blurred."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <div className="cs-metrics">
            {METRICS.map((m) => (
              <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
                <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
                <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.6, margin: '8px 0 0' }}>
            Lighthouse on the live home page, 27 Oct 2026, median of three runs. The largest element appears in 0.8 s on desktop and 2.9 s on a throttled phone. The business&apos;s older WordPress site scores about 80 on a phone in the same test.
          </p>
        </div>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Freelance, as technical lead. I wrote the code between April and July 2026. The business replaces only the glass, not the whole window. Many trade sites ask for contact details before they show a price; this one shows the price first.
          </p>
        </div>

        {/* What I built */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I built</div>
        <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', background: 'var(--bg-2)', borderRadius: 2, padding: '14px 16px', marginBottom: 40, lineHeight: 1.8 }}>
          {AREAS.map(([part, desc]) => (
            <div key={part} style={{ display: 'flex', flexWrap: 'wrap', columnGap: 16, marginBottom: 4 }}>
              <span style={{ color: 'var(--accent)', width: 120, flexShrink: 0 }}>{part}</span>
              <span style={{ color: 'var(--muted)', flex: '1 1 200px' }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Quote tool */}
        <div className="section-label" style={{ fontFamily: MONO }}>The quote tool</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The quote page is the point of the site. A visitor picks one of four glass options, adds a row for each window, and sees the price straight away, with no email needed. Sending it is optional and comes last.
        </p>
        <div data-reveal style={{ marginBottom: 16 }}>
          <Shot
            src="/projects/kdg/estimate-options.webp"
            alt="Four glass options, A to D, each with how much quieter and how much less heat it lets through and its price per square metre, blurred; option C is selected"
            width={1920}
            height={1480}
            caption="Step one: the glass. All four prices stay on screen."
          />
        </div>
        <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ flex: '0 1 220px', minWidth: 0 }}>
            <Shot
              src="/projects/kdg/estimate-windows-mobile.webp"
              alt="Three window rows on a phone, each with height, width and quantity, a second-storey checkbox with its charge blurred, and the area worked out underneath"
              width={1170}
              height={2532}
              caption="Step two on a phone: one row per window."
              variant="mobile"
            />
          </div>
          <div style={{ flex: '1 1 360px', minWidth: 0 }}>
            <Shot
              src="/projects/kdg/estimate-quote.webp"
              alt="The quote: the total in large type and a line per window, with every price blurred, total area 4.32 square metres, the glass make-up, a note that the price is accurate to within 10%, and a Send us your quote button"
              width={1920}
              height={1540}
              caption="The result: one price, the working behind it, and the glass it buys."
            />
          </div>
        </div>
        <Decisions items={QUOTE_DECISIONS} />

        {/* Site */}
        <div className="section-label" style={{ fontFamily: MONO }}>The rest of the site</div>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          Around the quote tool sit five pages and a warranty page. The pages carry structured data, so search engines can read the business, its services, its FAQ answers and the breadcrumbs.
        </p>
        <Decisions items={SITE_DECISIONS} />

        {/* Where it stands */}
        <div className="section-label" style={{ fontFamily: MONO }}>Where it stands</div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Live at kingdoubleglazing.com.au on Vercel, deployed from the business&apos;s own GitHub repository. Content changes go through the visual editor as commits to that repository; the latest is from 25 August 2026.
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
          <a href="https://www.kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> live site</a>
          <a href={kg.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
