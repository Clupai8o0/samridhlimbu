import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'
import { PROJECTS } from '@/lib/data'

const DESCRIPTION =
  'Co-founder of TapCraft Studio, Feb–Oct 2026. I built the headless Shopify store for our 3D-printed NFC keychains in Next.js 16. Its React Three Fiber configurator came from the starting scaffold and was kept behind a redirect; the March build of the store is still live.'

export const metadata: Metadata = {
  title: 'TapCraft Studio · headless Shopify store',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/tapcraft' },
  openGraph: {
    type: 'article',
    url: '/projects/tapcraft',
    title: 'TapCraft Studio · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/tapcraft/configurator.webp', width: 2880, height: 1656, alt: 'The TapCraft 3D NFC tag configurator with a blue keychain on a grid and the colour tab open' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TapCraft Studio · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/tapcraft/configurator.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'
const AMBER = '#fb923c'

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
  { k: 'store pages buyers can reach', v: '7' },
  { k: 'B2B rebuild page routes', v: '21' },
  { k: 'lines in the Blender script', v: '510' },
]

const MODEL_CODE = `const isRound = shape === "round-tag";

return (
  <group position={[0, t / 2 + 0.01, 0]}>
    {isRound ? (
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[w / 2, w / 2, t, 64]} />
        <meshPhysicalMaterial color={color} {...materialProps} />
      </mesh>
    ) : (
      <RoundedBox ref={meshRef} args={[w, t, h]} radius={Math.max(radius, 0.005)} smoothness={4}>
        <meshPhysicalMaterial color={color} {...materialProps} />
      </RoundedBox>
    )}
  </group>
);`

const CHECKOUT_CODE = `const handleCheckout = useCallback(() => {
  if (!checkoutUrl) return;

  try {
    const url = new URL(checkoutUrl);
    if (typeof upTag !== "undefined") {
      const linker = upTag("app", "linker");
      if (linker) url.searchParams.set("_upl", linker);
    }
    window.location.href = url.toString();
  } catch {
    window.location.href = checkoutUrl;
  }
}, [checkoutUrl]);`

const TIMELINE = [
  { date: '7 Feb 2026', title: 'Scaffold', body: 'Started from a Claude Code scaffold in my own repo. It already had the configurator, the 3D viewer and a Shopify client that falls back to mock products.' },
  { date: '12–13 Feb 2026', title: 'Home page', body: 'Reworked the home page design over two days in a separate repo, partly with Claude Code.' },
  { date: '15 Feb 2026', title: 'Store goes into the shared repo', body: 'Connected the Storefront API and built the product pages, then the cart and checkout. That evening a redirect sent /customize to the contact page. Apart from about an hour on 1 March, it has been there since.' },
  { date: '1–2 Mar 2026', title: 'Affiliate tracking', body: 'Added the UpPromote script and the checkout linker. An affiliates page went up and came down the same day. The last commit, on 2 March, is the build tapcraft.shop still serves.' },
  { date: 'Apr–Jul 2026', title: 'B2B rebuild', body: 'A new site for business orders: 21 page routes, a quote form checked with Zod, and a hero keychain made by a Blender script. It has a preview deployment and never replaced the store.' },
  { date: 'Oct 2026', title: 'Ended', body: 'My co-founder role ended.', current: true },
]

const DECISIONS = [
  ['headless on the Storefront API', 'a Shopify theme', 'Shopify still holds the products, the cart and the checkout. Everything else is a Next.js app in our own repo, so the pages, metadata and tracking are ordinary code.'],
  ['a Shopify cart', 'a cart kept by the site', 'The site keeps only the cart ID in localStorage. After every add, update or remove, Shopify sends the whole cart back with its lines, prices and checkout URL, and the drawer shows that.'],
  ['an affiliate ID on the checkout link', 'losing the referral at checkout', 'Checkout runs on Shopify\'s domain, so the referral would be lost on the way there. The cart adds UpPromote\'s linker value to the checkout URL before it redirects.'],
  ['a keychain modelled by script', 'modelling it by hand', 'For the B2B rebuild, a 510-line Blender Python script builds the keychain in millimetres: a top plate with a TC relief, a 25 mm NTAG215 inlay and a base with a pocket for it. It exports a Draco-compressed GLB, so changing a size means running the script again.'],
]

export default function TapcraftPage() {
  const tapcraft = PROJECTS.find(p => p.slug === 'tapcraft')

  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/tapcraft
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>TapCraft Studio</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(251,146,60,0.3)', fontFamily: MONO }}>○ ended · Feb–Oct 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 18px' }}>
            I co-founded TapCraft Studio, which sells 3D-printed NFC keychains made in Melbourne, and built its store: a Next.js 16 site on Shopify&apos;s Storefront API, with the cart and checkout on Shopify. The site also has a 3D configurator where shape, material and colour change the model in place. It came with the Claude Code scaffold I started from and was kept behind a redirect to the contact page. The store is still live.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://tapcraft.shop" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tapcraft.shop</a>
          </div>
        </div>

        {/* Hero: the configurator */}
        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/tapcraft/configurator.webp"
            alt="The TapCraft 3D NFC Tag Configurator: a blue keychain on a grid, with tabs for shape, colour, material, NFC, text and upload, and the colour tab open on #1E73FF"
            width={2880}
            height={1656}
            caption="The configurator with TapCraft Blue picked. The configurator shots come from a local copy of the live store's code, running on mock data; on tapcraft.shop this page redirects to Contact."
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
            TapCraft had two co-founders. The product is a keychain with an NFC chip inside: tap it on a phone and it opens a link. I connected the scaffold&apos;s catalogue to Shopify, then wrote the product pages, cart, checkout and affiliate tracking myself. My co-founder added the analytics tag and the favicon.
          </p>
        </div>

        {/* The configurator */}
        <div className="section-label" style={{ fontFamily: MONO }}>The 3D configurator</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          I barely touched the configurator. I moved its swatches to the brand blue and its tab animation to GSAP, and the 3D code is still as generated. It draws the tag from numbers instead of loading a model file. Five shapes are one rounded box sized from width, height, thickness and corner radius; the round tag is a disc. Picking a colour changes a prop on the material of the mesh already in the scene, so nothing is downloaded. Materials set roughness and metalness, and PETG and resin add clearcoat, so resin looks glossier than wood-filled PLA.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/tapcraft/colour-switch.webp"
            alt="The same keychain rendered three times on a light grid: in blue, in orange and in green"
            width={2460}
            height={560}
            caption="Three swatches picked in turn: TapCraft Blue, Coral (an orange) and Forest Green. Each frame is a fresh page load with the same camera."
          />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={CODE} code={MODEL_CODE} lang="tsx" />
          <div style={CODE_CAPTION}>The model as the scaffold generated it, from src/components/customize/ThreeDViewerCanvas.tsx, trimmed. Colour and material arrive as props.</div>
        </div>

        {/* Phone shot */}
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/tapcraft/configurator-phone.webp"
            alt="The configurator on a phone: the keychain in gold above the shape, colour, material, NFC, text and upload tabs, with #ca8a04 selected"
            width={1170}
            height={2320}
            caption="On a phone, with Gold picked. The model sits above the tabs."
            variant="mobile"
          />
        </div>

        {/* The store */}
        <div className="section-label" style={{ fontFamily: MONO }}>The store</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Products come from the Storefront API over GraphQL, including custom fields for the material, NFC chip, production time and size. The cart is a Shopify cart. Product pages add lines and the drawer updates and removes them, all through the Cart API, and the Checkout button sends the buyer to Shopify&apos;s own checkout page with any affiliate ID attached.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={CODE} code={CHECKOUT_CODE} lang="tsx" />
          <div style={CODE_CAPTION}>From src/components/cart/CartDrawer.tsx: the UpPromote linker goes onto Shopify&apos;s checkout URL as _upl.</div>
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/tapcraft/desktop.webp"
            alt="The TapCraft Studio home page: headline 'Tap Into the Future' with catalogue and contact buttons, above a video of a 3D printer bed"
            width={2400}
            height={1500}
            caption="tapcraft.shop, the live store. Captured before this rewrite; the home page hero still matched on 28 October 2026."
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

        {/* Timeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--muted)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--muted)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Ship the configurator small or cut it. Its text and upload tabs never drew anything on the model; a version with only shape and colour could have gone live in February.
        </p>

        {/* Stack */}
        {tapcraft ? (
          <>
            <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
              {Object.entries(tapcraft.stack).map(([label, items]) => (
                <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{(items as string[]).join(' · ')}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://tapcraft.shop" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> tapcraft.shop</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
