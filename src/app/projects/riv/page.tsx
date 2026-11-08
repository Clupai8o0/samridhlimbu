import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'
import { Icon } from '@/components/icons'

const DESCRIPTION =
  'RIV is an Electron desktop app for artists: add local folders, scan them for images, and flip through a shuffled reference set on a timer. Alpha from 2023; repo archived.'

export const metadata: Metadata = {
  title: 'RIV · random image viewer',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/riv' },
  openGraph: {
    type: 'article',
    url: '/projects/riv',
    title: 'RIV · random image viewer · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/riv/og.webp', width: 1440, height: 720, alt: 'Diagram: Electron renderer, preload IPC bridge, main process, path library and recursive image scanner' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RIV · random image viewer · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/riv/og.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'hand-written JS lines', v: '388' },
  { k: 'IPC handlers', v: '6' },
  { k: 'timer presets', v: '6' },
]

const PRELOAD_CODE = `const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ctx", {
  getPaths: () => ipcRenderer.invoke("get-paths"),
  deletePath: (id) => ipcRenderer.send("delete-path", id),
  addPath: (path) => ipcRenderer.send("add-path", path),
  setImages: (path) => ipcRenderer.send("set-images", path),
  getImage: () => ipcRenderer.invoke("get-image"),
  nextImage: () => ipcRenderer.invoke("next-image"),
  prevImage: () => ipcRenderer.invoke("prev-image"),
});`

const SCAN_CODE = `if (includes(joinedPath, [".jpg", ".png", ".jpeg", ".gif", ".webp"])) {
  // collect into the session list
}`

const DECISIONS = [
  ['contextBridge for a small ctx API', 'nodeIntegration in the renderer', 'preload.js exposes window.ctx. The renderer never gets a raw require("fs"); folder and image work goes through IPC handlers in main.js.'],
  ['data.json for the path library', 're-entering folders every launch', 'utils/path.js reads and writes a gitignored data.json beside the app. Invalid paths stay in the list and are flagged when they fail.'],
  ['recursive scan + shuffle per session', 'alphabetical walk only', 'utils/viewer.js walks the tree for five image extensions. The viewer order is randomised for the session so figure-drawing practice does not repeat the same sequence.'],
  ['Electron Forge makers', 'a manual zip', 'package.json wires Squirrel, ZIP, DEB and RPM makers, with a GitHub publisher aimed at draft releases under Clupai8o0/riv.'],
]

const TIMELINE = [
  { date: '30 Mar 2023', title: 'v0.1.0', body: 'First packaged alpha and publish setup.' },
  { date: '5 Jun 2023', title: 'Experimental version bump', body: 'Version marked experimental after the first usable viewer.' },
  { date: '26 Dec 2025', title: 'Archive README', body: 'Final README. The GitHub repo is archived; status in package.json remains 0.1.0-alpha.', current: true },
]

const STACK: [string, string[]][] = [
  ['App', ['Electron 23', 'Electron Forge', 'JavaScript']],
  ['UI', ['HTML', 'Tailwind CSS', 'uuid']],
  ['Disk', ['data.json path library', 'recursive folder scan']],
]

export default function RivPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/riv
        </div>

        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>RIV</h1>
            <span className="pill" style={{ fontFamily: MONO }}>archived · 2023</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            Random Image Viewer: a small Electron app for artists who keep reference folders on disk. Paste a folder path, open it, and step through a shuffled set of images, optionally on a timer (30 seconds up to 30 minutes).
          </p>
        </div>

        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/riv/system.svg"
            alt="Architecture diagram: renderer HTML and JS call window.ctx from preload, IPC reaches main.js, which uses utils/path.js for data.json and utils/viewer.js to scan image folders"
            width={720}
            height={360}
            caption="How the renderer, preload bridge and main process split the work. No app screenshots here: this page is drawn from the source, not a live Electron session."
            priority
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
            Built for figure-drawing practice without a browser tab. There are no automated tests in package.json. The useful surface area is the main process, preload bridge, path library and viewer — about 388 lines of hand-written JavaScript outside the generated Tailwind stylesheet.
          </p>
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>IPC surface</div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          main.js registers get-paths, get-image, next-image, prev-image, plus add-path, delete-path and set-images. The renderer only talks to those names through preload.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre code={PRELOAD_CODE} lang="javascript" />
        </div>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={SCAN_CODE} lang="javascript" />
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>From utils/viewer.js — extensions the scanner accepts.</p>
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
            Never put a GitHub auth token in package.json scripts. The archived publish script still contains one; it should be revoked and the history cleaned if the token was ever valid.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Prefer a folder picker dialog over paste-a-path. The UI warns about spaces in paths; a native dialog would avoid that class of mistake.
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
          <a href="https://github.com/Clupai8o0/riv" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
