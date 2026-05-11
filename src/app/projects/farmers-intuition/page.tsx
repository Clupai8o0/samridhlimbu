import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { Icon } from '@/components/icons'
import { CodeBlock } from '@/components/code-block'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'

const TIMELINE = [
  { date: 'Mar 2026 · h+0', title: 'Hack48 kickoff', body: 'Advertised as a 48-hour hackathon. Problem space: precision agriculture. Farmers make irrigation decisions based on gut feel and weather apps — neither is calibrated to soil or crop state.' },
  { date: 'Mar 2026 · h+2', title: 'Investors cut the clock', body: 'The investor panel reduced the build window from 48 hours to 20. Every scope decision after this point assumed less than a day of build time remaining.' },
  { date: 'Mar 2026 · h+6', title: 'Two-layer ML engine', body: 'Layer 1: prediction model (soil moisture, weather forecast, crop type → irrigation need). Layer 2: recommendation engine that converts the prediction into a plain-English action.' },
  { date: 'Mar 2026 · h+14', title: '"Sage" voice assistant', body: 'ElevenLabs for voice synthesis. Farmers ask questions in natural language; Gemini handles intent and context; Sage speaks the answer back. Designed for use without looking at a screen.' },
  { date: 'Mar 2026 · h+20', title: 'Submission', body: 'FastAPI backend, two-layer ML engine, and voice assistant delivered inside the compressed 20-hour window.', current: true },
]

const DECISIONS = [
  ['two-layer ml', 'single end-to-end model', 'Splitting prediction from recommendation keeps each layer independently improvable. The prediction layer can be swapped for a better soil model without touching the language layer.'],
  ['voice-first interface', 'dashboard ui', "Farmers don't carry laptops in paddocks. A voice interface (ElevenLabs + Gemini) works on a phone in a pocket — ask a question, get an answer, keep working."],
  ['fastapi', 'django / flask', 'FastAPI gives async-native endpoints and automatic OpenAPI docs. In a hackathon, the docs double as a team contract — frontend and ML layers agree on the schema from hour one.'],
  ['gemini', 'fine-tuned local model', '20-hour constraint: no time to fine-tune. Gemini handles natural-language understanding out of the box; the ML engine handles domain prediction. Clear separation of responsibilities.'],
]

const PIPELINE_LINES = [
  `<span style="color:#71717a"># layer 1: predict irrigation need</span>`,
  `prediction = model.<span style="color:#60a5fa">predict</span>({`,
  `  <span style="color:#86efac">"soil_moisture"</span>: sensor_reading,`,
  `  <span style="color:#86efac">"forecast_mm"</span>:   weather_api_data,`,
  `  <span style="color:#86efac">"crop_type"</span>:     profile.crop,`,
  `})`,
  ``,
  `<span style="color:#71717a"># layer 2: convert to natural-language advice</span>`,
  `advice = gemini.<span style="color:#60a5fa">generate</span>(`,
  `  prompt=<span style="color:#60a5fa">build_prompt</span>(prediction, profile)`,
  `)`,
]

export default function FarmersIntuitionPage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        {/* breadcrumb */}
        <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/farmers-intuition
        </div>

        {/* Banner */}
        <div style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Farmers Intuition</h1>
            <span className="pill" style={{ color: '#f59e0b', borderColor: 'rgba(245,158,11,0.3)', fontFamily: MONO }}>● hack48 · <span style={{ textDecoration: 'line-through', opacity: 0.55 }}>48h</span> 20h</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            AI precision irrigation advisory platform built at Hack48 — billed as 48 hours, cut to 20 by the investor panel mid-event. Two-layer ML engine (prediction + recommendation) paired with a voice assistant named Sage — farmers ask questions in natural language and get actionable irrigation advice spoken back.
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <a href="https://github.com/clupai8o0/farmers-intuition" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> frontend</a>
            <a href="https://github.com/Clupai8o0/Farmers_Intuition_API" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> api</a>
          </div>
        </div>

        {/* Hero media */}
        <div style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <video
            src="/projects/farmers-intuition/demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', display: 'block' }}
          />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'build time', node: (<><span style={{ textDecoration: 'line-through', opacity: 0.4, marginRight: 6, fontWeight: 500 }}>48h</span>20h</>) },
            { k: 'ml layers', node: '2' },
            { k: 'voice assistant', node: 'Sage' },
          ].map((m, i) => (
            <div key={m.k} style={{ padding: '14px 16px', borderLeft: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ fontFamily: DISPLAY, fontSize: 20, color: 'var(--accent)', fontWeight: 700, letterSpacing: -0.02 }}>{m.node}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.08 }}>{m.k}</div>
            </div>
          ))}
        </div>

        {/* Context */}
        <div style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ fontFamily: MONO }}>Context</div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, margin: 0 }}>
            Hack48, March 2026. The problem: farmers make irrigation decisions based on intuition and weather apps — neither accounts for actual soil moisture or crop state. Farmers Intuition replaces the guesswork with a two-layer pipeline: a prediction model that reads sensor and forecast data, and a language layer that turns the prediction into a spoken recommendation via the Sage voice assistant.
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

        {/* Pipeline */}
        <div className="section-label" style={{ fontFamily: MONO }}>The two-layer pipeline</div>
        <div style={{ marginBottom: 12 }}>
          <CodeBlock lines={PIPELINE_LINES} />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          Layer 1 handles domain knowledge — soil, weather, crop type. Layer 2 handles language. Neither layer tries to do both. In a 48-hour build this division mattered: team members could work on each layer independently against a shared schema.
        </p>

        {/* Stack */}
        <div className="section-label" style={{ fontFamily: MONO }}>Stack</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 28 }}>
          {[
            { label: 'Backend', items: 'FastAPI · Python' },
            { label: 'AI / ML', items: 'Google Gemini · custom prediction model' },
            { label: 'Voice', items: 'ElevenLabs (Sage)' },
          ].map(({ label, items }) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: 0.08, width: 72, flexShrink: 0 }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>{items}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <a href="https://github.com/clupai8o0/farmers-intuition" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> frontend</a>
          <a href="https://github.com/Clupai8o0/Farmers_Intuition_API" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> api</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
