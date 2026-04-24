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
  { date: 'Feb 2026', title: 'Co-founder, day one', body: 'Rejected WordPress + Shopify theme. Built the full headless Shopify + Next.js 16 frontend from scratch — full control over layout, 3D viewer, and checkout flow.' },
  { date: 'Feb 2026', title: '3D product viewer', body: 'React Three Fiber viewer for 3D-printed NFC keychains. Colour variants switch by updating Three.js material properties on the loaded model — no GLB swap, no reload, no delay.' },
  { date: 'Mar 2026', title: 'Affiliate tracking in headless', body: 'UpPromote hooks into native Shopify checkout. In headless mode those hooks are gone. Solved via Shopify Web Pixel API + cart context events to attribute affiliate clicks correctly.' },
  { date: 'Mar 2026', title: 'B2C → B2B migration', body: 'Full site pivot: catalogue restructure, 301 redirect mapping, and 3D customiser repositioned as a bulk-quote tool. UpPromote affiliate tracking carried over.', current: true },
]

const DECISIONS = [
  ['three.js material update', 'glb swap per variant', "Swapping GLB files on colour change means re-parsing and re-uploading geometry on every click. Updating the material colour is a single property assignment — instant, no network request."],
  ['web pixel + cart events', 'native shopify affiliate hooks', 'Headless checkout breaks UpPromote\'s default event hooks. Shopify Web Pixel runs in a sandboxed iframe with access to cart context — the only reliable way to attribute affiliate referrals in headless.'],
  ['shopify storefront api (graphql)', 'shopify rest admin api', 'Storefront API is the public-facing, read-optimised surface for headless frontends — products, variants, cart mutations, and checkout. Admin API is for backend operations, not product pages.'],
  ['cloudflare r2', 's3 for 3d assets', 'R2 has no egress fees. 3D model files are large and fetched on every product page load — egress adds up fast with S3.'],
]

const VARIANT_LINES = [
  `<span style="color:#71717a">// colour variant switch — no GLB reload</span>`,
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
  const tapcraft = PROJECTS.find(p => p.slug === 'tapcraft')!

  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/tapcraft
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>TapCraft Studio</h1>
            <span className="pill" style={{ color: '#fb923c', borderColor: 'rgba(251,146,60,0.3)', fontFamily: MONO }}>● shipping · co-founder</span>
            <span style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', border: '1px dashed var(--border)', padding: '2px 6px', letterSpacing: 0.04 }}>updating</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            Headless Shopify storefront for 3D-printed NFC keychains — real-time 3D colour variant switching via Three.js material updates (no GLB swaps), headless affiliate tracking via Web Pixel, and a full B2C → B2B site migration.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://tapcraft.shop" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> tapcraft.shop</a>
            <a href="https://github.com/clupai8o0/tapcraft" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> code</a>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: '3D variant switch', v: '0ms' },
            { k: 'glb reloads', v: '0' },
            { k: 'migration', v: 'B2C→B2B' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            Co-founder, Feb 2026–present. TapCraft sells 3D-printed NFC keychains — tap the keychain to a phone and it opens a link. The product is physical but the UX problem is digital: show people exactly what their custom keychain will look like before they order. I built the full headless Shopify frontend, solved two non-trivial headless problems (3D variant switching, affiliate tracking), and led the pivot from consumer to B2B.
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

        {/* 3D variant switching */}
        <div className="section-label" style={{ fontFamily: MONO }}>3D variant switching</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={VARIANT_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Traverse the scene graph, find every mesh, set the material colour. No file fetch, no geometry re-parse, no loading state. The model stays loaded — only the appearance changes. This is the entire colour switching implementation.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {Object.entries(tapcraft.stack).map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://tapcraft.shop" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="external" size={11} /> tapcraft.shop</a>
          <a href="https://github.com/clupai8o0/tapcraft" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
