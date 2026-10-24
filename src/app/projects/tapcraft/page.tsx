import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'
import { Shot } from '@/components/case-study/shot'
import { PROJECTS } from '@/lib/data'

const DESCRIPTION =
  'Co-founder of TapCraft Studio, Feb–Oct 2026. Built the headless Shopify + Next.js 16 storefront for 3D-printed NFC keychains, with real-time 3D colour switching and headless affiliate tracking.'

export const metadata: Metadata = {
  title: 'TapCraft Studio · headless Shopify storefront',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/tapcraft' },
  openGraph: {
    type: 'article',
    url: '/projects/tapcraft',
    title: 'TapCraft Studio · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/tapcraft/desktop.webp', width: 2400, height: 1500, alt: 'The TapCraft Studio storefront at tapcraft.shop' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TapCraft Studio · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/tapcraft/desktop.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'
const AMBER = '#fb923c'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'GLB reloads per colour change', v: '0' },
  { k: 'site migration', v: 'B2C→B2B' },
  { k: 'co-founder, 2026', v: 'Feb–Oct' },
]

const TIMELINE = [
  { date: 'Feb 2026', title: 'Headless from day one', body: 'Ruled out WordPress and a stock Shopify theme. Built the headless Shopify + Next.js 16 frontend from scratch for full control over layout, the 3D viewer and checkout.' },
  { date: 'Feb 2026', title: '3D product viewer', body: 'A React Three Fiber viewer for the keychains. Colour variants changed the material on the loaded model, so there was no GLB swap and no reload.' },
  { date: 'Mar 2026', title: 'Affiliate tracking, headless', body: 'UpPromote hooks into the native Shopify checkout, and headless mode removes those hooks. Web Pixel and cart context events got attribution working again.' },
  { date: 'Mar 2026', title: 'B2C to B2B', body: 'Restructured the catalogue, mapped 301 redirects and turned the 3D customiser into a bulk-quote tool. Affiliate tracking carried over.' },
  { date: 'Oct 2026', title: 'Ended', body: 'My co-founder role ended in October 2026. The store is still up at tapcraft.shop.', current: true },
]

const DECISIONS = [
  ['three.js material update', 'GLB swap per variant', 'Swapping GLB files on every colour change means fetching and parsing geometry each click. Setting the material colour is one property assignment, with no network request.'],
  ['web pixel + cart events', 'native Shopify affiliate hooks', "A headless checkout breaks UpPromote's default hooks. Shopify Web Pixel runs sandboxed with access to cart context, which made it the reliable way to attribute referrals."],
  ['storefront API (GraphQL)', 'admin REST API', 'The Storefront API is the public, read-optimised surface for headless frontends: products, variants, cart mutations and checkout. The Admin API is for back-office work.'],
  ['cloudflare R2', 'S3 for 3D assets', 'R2 has no egress fees. The 3D models are large and load on every product page, so S3 egress would have added up.'],
]

const VARIANT_LINES = [
  `<span style="color:#a1a1aa">// colour variant switch, no GLB reload</span>`,
  `<span style="color:#c084fc">function</span> <span style="color:#60a5fa">applyVariant</span>(scene, hex) {`,
  `  scene.<span style="color:#60a5fa">traverse</span>(obj => {`,
  `    <span style="color:#c084fc">if</span> (obj.isMesh && obj.material) {`,
  `      obj.material.color.<span style="color:#60a5fa">set</span>(hex)`,
  `      obj.material.needsUpdate = <span style="color:#fcd34d">true</span>`,
  `    }`,
  `  })`,
  `}`,
]

export default function TapcraftPage() {
  const tapcraft = PROJECTS.find(p => p.slug === 'tapcraft')

  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/tapcraft
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>TapCraft Studio</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(251,146,60,0.3)', fontFamily: MONO }}>○ ended · Feb–Oct 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            I co-founded TapCraft Studio and built its headless Shopify storefront for 3D-printed NFC keychains. The 3D viewer switched colour variants in real time with Three.js material updates, affiliate tracking worked without a native theme, and I led the move from consumer sales to B2B. The store is still up.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://tapcraft.shop" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tapcraft.shop</a>
          </div>
        </div>

        {/* Hero shot */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/tapcraft/desktop.webp"
            alt="The TapCraft Studio home page: headline 'Tap Into the Future' with catalogue and contact buttons, above a video of a 3D printer bed"
            width={2400}
            height={1500}
            caption="tapcraft.shop, still live."
            priority
          />
        </div>

        {/* Metrics */}
        <div data-reveal style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            Co-founder, Feb–Oct 2026. TapCraft sells 3D-printed NFC keychains: tap one to a phone and it opens a link. The product is physical, but the hard part was digital: showing people exactly what their custom keychain would look like before they ordered. I built the whole frontend, solved the two headless problems below, and led the pivot to B2B.
          </p>
        </div>

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20, borderLeft: '1px solid var(--border)' }}>
              <div style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--muted)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--muted)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
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

        {/* 3D variant switching */}
        <div className="section-label" style={{ fontFamily: MONO }}>3D variant switching</div>
        <div style={{ marginBottom: 14 }}>
          <CodeBlock lines={VARIANT_LINES} filename="colour variant switch" lang="ts" />
        </div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Walk the scene graph, find every mesh, set the material colour. No file fetch, no geometry parse, no loading state. The viewer also rendered on demand (<code style={{ fontFamily: MONO, fontSize: 'var(--text-xs)' }}>frameloop=&quot;demand&quot;</code>) instead of every frame, to keep GPU load down.
        </p>

        {/* Mobile shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/tapcraft/mobile.webp"
            alt="The TapCraft Studio home page on a phone, with the headline and buttons stacked above the 3D printer video"
            width={1170}
            height={2532}
            caption="The store at 390px."
            variant="mobile"
          />
        </div>

        {/* Stack */}
        {tapcraft ? (
          <>
            <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
              {Object.entries(tapcraft.stack).map(([label, items]) => (
                <div key={label} style={{ display: 'flex', columnGap: 12, rowGap: 2, alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{(items as string[]).join(' · ')}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://tapcraft.shop" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tapcraft.shop</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
