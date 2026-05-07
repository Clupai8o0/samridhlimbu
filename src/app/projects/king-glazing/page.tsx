import Image from 'next/image'
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
  { date: 'Apr 2026', title: 'Engagement starts — rebrand evaluation', body: 'Client had an existing site under "The Glass Discounters" brand. Lighthouse: Performance 57 mobile, LCP 13.1s. Brief: new brand (King Double Glazing), new site, new positioning — full restart.' },
  { date: 'Apr 2026', title: 'Stack decision: Next.js 16 from scratch', body: 'Next.js 16 + Tailwind v4 + Neon + Drizzle + Resend. Full control over the Instant Estimate Tool UX and CMS integration. No WordPress, no page builder.' },
  { date: 'Apr 2026', title: 'Funnel pivot — 27 routes → 5 pages', body: 'Original plan was a 27-route SEO content cluster with suburb pages and a blog. Mid-project pivot to a tight 5-page conversion funnel with the Instant Estimate Tool as the primary CTA. SEO infrastructure preserved for future expansion.' },
  { date: 'May 2026', title: 'TinaCMS integration + launch', body: 'Content migrated to TinaCMS (git-based JSON). Visual editor live via Tina Cloud. Full ecosystem handed to client. Lighthouse: Performance 99 · SEO 100 · Best Practices 100 on desktop.', current: true },
]

const DECISIONS = [
  ['next.js 16', 'wordpress', "WordPress couldn't support the Instant Estimate Tool UX without heavy plugin stacks. Next.js 16 App Router gave full control over the multi-step calculator, server actions for lead capture, and zero plugin bloat dragging down Core Web Vitals."],
  ['price-first estimate tool', 'contact-first quote form', "Standard trades sites gate the price behind a callback. The Instant Estimate Tool shows a price range before asking for contact details — qualify first, capture second. Filters tyre-kickers before they reach the owner's phone."],
  ['5-page conversion funnel', '27-route seo cluster', 'The SEO content plan was killed mid-build. The client needed leads in 30 days, not 6 months. A tight funnel pointing every visitor to the estimate tool converts faster. The SEO infrastructure (schema, sitemap, suburb template) is preserved for when the time is right.'],
  ['tinacms (git-based)', 'sanity cms', 'TinaCMS stores content as JSON files committed to the git repo — no external CDN, no separate database. Visual editor via Tina Cloud. Content is version-controlled with code. Simpler handoff for a non-technical client.'],
  ['resend + token confirmation', 'smtp / contact form plugin', 'Two-step quote confirmation: customer receives a link, clicks to confirm, then KDG gets the lead notification. Filters junk submissions before they reach the owner. DKIM/SPF/DMARC configured from day one.'],
]

const ESTIMATE_LINES = [
  `<span style="color:#71717a">// server action — quote submission + token confirmation</span>`,
  `<span style="color:#c084fc">export async function</span> <span style="color:#60a5fa">submitQuote</span>(data: QuoteInput) {`,
  `  <span style="color:#c084fc">const</span> token = crypto.<span style="color:#60a5fa">randomUUID</span>()`,
  `  <span style="color:#c084fc">await</span> db.<span style="color:#60a5fa">insert</span>(quotes).<span style="color:#60a5fa">values</span>({ ...data, status: <span style="color:#86efac">'pending'</span>, confirmToken: token })`,
  `  <span style="color:#c084fc">await</span> resend.emails.<span style="color:#60a5fa">send</span>({`,
  `    to: data.email,`,
  `    react: <QuoteConfirmation token={token} />,`,
  `  })`,
  `  <span style="color:#71717a">// KDG only notified after customer confirms —  filters junk</span>`,
  `}`,
]

export default function KingGlazingPage() {
  const kg = PROJECTS.find(p => p.slug === 'king-glazing')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/king-glazing
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>King Double Glazing</h1>
            <span className="pill" style={{ color: GREEN, borderColor: 'rgba(74,222,128,0.3)', fontFamily: MONO }}>● live · freelance</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Rebrand and full rebuild from The Glass Discounters to King Double Glazing. Conversion-first architecture built around a self-serve Instant Estimate Tool — price before contact details, not after. Desktop Lighthouse: Performance 99 · SEO 100 · Best Practices 100.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> live site</a>
            <a href={kg.github} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'desktop performance', v: '99' },
            { k: 'SEO score', v: '100' },
            { k: 'desktop LCP', v: '1.0s' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Screenshot */}
        <div style={{ marginBottom: 28 }}>
          <a href="https://kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <Image
              src="/projects/kdg/homepage.webp"
              alt="King Double Glazing homepage"
              width={1456}
              height={816}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
            <div style={{ position: 'absolute', inset: 0, background: 'transparent', transition: 'background 0.15s' }} />
          </a>
          <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', marginTop: 6, textAlign: 'center', letterSpacing: 0.06 }}>kingdoubleglazing.com.au — homepage</div>
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            Freelance technical lead, Apr–May 2026. King Double Glazing is a Melbourne retrofit double glazing business — they upgrade existing window frames with insulated glass units rather than replacing the whole window. The brief was a full rebrand from The Glass Discounters plus a new site. The actual deliverable is a conversion funnel built around one insight: show the price before asking for the phone number.
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
              <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.55, maxWidth: 460 }}>{e.body}</div>
            </div>
          ))}
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

        {/* Estimate tool */}
        <div className="section-label" style={{ fontFamily: MONO }}>Instant estimate tool — token confirmation flow</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={ESTIMATE_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          The multi-step calculator produces a price range in under 60 seconds. On submit, the customer receives a confirmation link — KDG only gets the lead notification after they click it. Junk submissions are filtered at the email layer before they reach the owner&apos;s inbox.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {Object.entries(kg.stack).map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://kingdoubleglazing.com.au" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> live site</a>
          <a href={kg.github} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
