import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'
import { Icon } from '@/components/icons'

const DESCRIPTION =
  'Digi Convertor turns numbers between binary, decimal, octal and hex in a React/Vite UI, with formula panels for each pair, and a small Flask API on Vercel. Live since 2022; repos archived.'

export const metadata: Metadata = {
  title: 'Digi Convertor',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/digi-convertor' },
  openGraph: {
    type: 'article',
    url: '/projects/digi-convertor',
    title: 'Digi Convertor · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/digi-convertor/convert.webp', width: 2880, height: 1800, alt: 'Digi Convertor converting decimal 42 to binary 101010 with the formula panel open' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digi Convertor · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/digi-convertor/convert.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'formula panels', v: '10' },
  { k: 'front-end TS/TSX lines', v: '2,963' },
  { k: 'API + convert module lines', v: '108' },
]

const API_CODE = `@app.route('/convert/<string:fromType>/<string:toType>/<string:value>', methods=['GET'])
def convert(fromType, toType, value):
    convertor = Convertor()
    # normalise to decimal, then to the target base
    ...
    return jsonify({ "value": value, "msg": f"{fromType} type successfully converted to {toType} type" })`

const VERIFY_LOG = `GET …/convert/Decimal/Binary/42
{"msg":"Decimal type successfully converted to Binary type","value":"101010"}`

const DECISIONS = [
  ['Flask convert API on Vercel', 'doing the maths only in the browser', 'The UI posts to GET /convert/{from}/{to}/{value}. lib/convert.py implements the base transitions; the React app validates digits and renders the matching formula panel locally.'],
  ['Recoil for theme and inputs', 'prop drilling', 'themeAtom, typesAtom and inputAtom hold dark mode, the selected bases and the typed value. Theme preference is stored in localStorage.'],
  ['one component per conversion pair', 'a single generic formula', 'Ten formula components under src/components/formulas cover the directed pairs (binary↔decimal, hex↔binary, and so on), so each explanation can show its own worked example.'],
  ['CORS locked to the front-end origin', 'open CORS only', 'The Flask app initialises Flask-Cors for https://digi-convertor.vercel.app, then still adds Access-Control-Allow-Origin: * on the response — a leftover that should be cleaned up if the API ever moves off archive status.'],
]

const TIMELINE = [
  { date: 'Aug 2022', title: 'Front-end build', body: 'Vite + React + Recoil UI, theme toggle, formula animations (Framer Motion, GSAP, typed.js) and the first API wiring.' },
  { date: '24 Dec 2022', title: 'Server v2 on Vercel', body: 'digi-convertor-server-v2 copies the convert module into a Flask serverless entry and opens CORS for the front-end origin.' },
  { date: '1 Jan 2023', title: 'Last API fix', body: 'Final server commit. The front-end later got an archive README on 27 Dec 2025; both GitHub repos are archived, and the Vercel apps still answer.', current: true },
]

const STACK: [string, string[]][] = [
  ['Frontend', ['React 18', 'TypeScript', 'Vite 3', 'Recoil', 'Framer Motion', 'GSAP']],
  ['API', ['Flask 2.2', 'Flask-Cors', 'Vercel Python runtime']],
  ['Infra', ['Vercel (app + API)']],
]

export default function DigiConvertorPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/digi-convertor
        </div>

        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Digi Convertor</h1>
            <span className="pill" style={{ color: GREEN, fontFamily: MONO }}>● live · archived repos · 2022</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: '0 0 16px' }}>
            A base converter with the working visible. Pick binary, decimal, octal or hex on each side, type a value, and the Flask API returns the conversion while the right-hand panel shows the formula for that pair.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://digi-convertor.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> live site</a>
            <a href="https://github.com/Clupai8o0/digi-convertor-app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> app</a>
            <a href="https://github.com/Clupai8o0/digi-convertor-server-v2" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> api</a>
          </div>
        </div>

        <div data-stagger-item style={{ marginBottom: 16 }}>
          <Shot
            src="/projects/digi-convertor/convert.webp"
            alt="Digi Convertor on desktop: decimal 42 converting to binary 101010, with the decimal-to-binary repeated-division formula panel on the right"
            width={2880}
            height={1800}
            caption="Live site, 3 Nov 2026. Decimal 42 → binary 101010, checked against the API."
            priority
          />
        </div>
        <p data-stagger-item style={{ ...PROSE, fontSize: 13, color: 'var(--muted)', margin: '0 0 32px' }}>
          Shots are the public Vercel front-end talking to digi-convertor-server-v2.vercel.app.
        </p>

        <div data-reveal style={{ marginBottom: 40 }}>
          <Shot
            src="/projects/digi-convertor/phone.webp"
            alt="Digi Convertor on a phone showing the converter card and formula section stacked"
            width={1170}
            height={2532}
            caption="Phone layout: converter above, formula below."
            variant="mobile"
          />
        </div>

        <div data-reveal className="cs-metrics" style={{ marginBottom: 40 }}>
          {METRICS.map((m) => (
            <div key={m.k} style={{ padding: '14px 16px 14px 0' }}>
              <div data-count style={{ fontFamily: DISPLAY, fontSize: 'var(--text-lg)', color: 'var(--accent)', fontWeight: 700, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{m.v}</div>
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{m.k}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 40 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ ...PROSE, margin: 0 }}>
            An early full-stack learning project: a styled converter in the browser and a tiny Python service for the arithmetic. Both GitHub repositories are archived; the deployments still serve traffic.
          </p>
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>The API contract</div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          The front-end expects <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>VITE_API</code> with a trailing slash and calls <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>convert/&#123;from&#125;/&#123;to&#125;/&#123;value&#125;</code>. Bases are the strings Binary, Decimal, Octal and Hexadecimal.
        </p>
        <div data-reveal style={{ marginBottom: 16 }}>
          <CodePre code={API_CODE} lang="python" />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={VERIFY_LOG} lang="log" />
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>Live response from digi-convertor-server-v2.vercel.app, 3 Nov 2026.</p>
        </div>

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

        <div className="section-label" style={{ fontFamily: MONO }}>Timeline</div>
        <div style={{ marginBottom: 40 }}>
          {TIMELINE.map((e, i) => (
            <div key={i} style={{ position: 'relative', marginLeft: 5, paddingLeft: 22, paddingBottom: i === TIMELINE.length - 1 ? 0 : 20 }}>
              <div data-timeline-dot style={{ position: 'absolute', left: -6, top: 4, width: 11, height: 11, borderRadius: 6, background: e.current ? 'var(--accent)' : 'var(--bg)', border: `1.5px solid ${e.current ? 'var(--accent)' : 'var(--muted-2)'}` }} />
              <div style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{e.date}</div>
              <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: 'var(--fg)', marginBottom: 4 }}>{e.title}</div>
              <div style={{ fontFamily: SANS, fontSize: 'var(--text-sm)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 560 }}>{e.body}</div>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Convert in the browser for this size of problem, and keep the API only if it taught deployment — which it did.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Drop the duplicate CORS header and pin a single origin policy.
          </p>
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
          {STACK.map(([label, items]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', width: 80, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--fg-dim)', lineHeight: 1.6 }}>{items.join(' · ')}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 20, flexWrap: 'wrap' }}>
          <a href="https://digi-convertor.vercel.app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="external" size={12} /> digi-convertor.vercel.app</a>
          <a href="https://github.com/Clupai8o0/digi-convertor-app" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> app</a>
          <a href="https://github.com/Clupai8o0/digi-convertor-server-v2" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> api</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
