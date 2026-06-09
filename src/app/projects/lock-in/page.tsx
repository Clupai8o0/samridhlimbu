import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Icon } from '@/components/icons'

export const metadata: Metadata = {
  title: 'Lock-In · Embedded Focus Tracker',
  description:
    'A desk-side embedded focus tracker built with Arduino + Raspberry Pi. Five-state FSM, Gemini vision, boot-on-power. Built in a weekend for Deakin SIT210.',
  alternates: { canonical: 'https://samridhlimbu.com/projects/lock-in' },
  openGraph: { url: 'https://samridhlimbu.com/projects/lock-in', title: 'Lock-In · Samridh Limbu' },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = '#4ade80'
const AMBER = '#f59e0b'

const FSM_STATES = [
  { state: 'AWAY', color: '#71717a', desc: 'No one at the desk for 5 min. LEDs off.' },
  { state: 'IDLE', color: AMBER, desc: 'Person detected at desk. Waiting for button press to start.' },
  { state: 'FOCUS', color: GREEN, desc: 'Session active. Gemini vision polling every 75 s.' },
  { state: 'DEGRADING', color: '#ef4444', desc: 'Distraction detected. Buzzer nagging.' },
  { state: 'BREAK', color: '#60a5fa', desc: 'Break timer running. Yellow blink.' },
]

const HARDWARE = [
  ['Arduino UNO', 'Sensor hub + LED/buzzer driver'],
  ['Raspberry Pi 5', 'FSM orchestrator + Flask dashboard + MQTT broker'],
  ['PIR HC-SR501', 'Presence detection (INT0)'],
  ['HC-SR04', 'Distance to screen'],
  ['DHT22', 'Room temperature + humidity'],
  ['LDR + 10 kΩ', 'Ambient light (voltage divider, A0)'],
  ['3× LED + 220 Ω', 'Red / yellow / green state output'],
  ['Passive piezo', 'Buzzer patterns via tone()'],
  ['Push button', 'Session control (INT1, active-low)'],
]

const DECISIONS = [
  ['pure-logic FSM', 'FSM with I/O', 'No time.time(), no globals, no threads inside the FSM. The orchestrator pushes events in, gets a list of Actions back. Result: 13 FSM unit tests that run in microseconds with a FakeClock. No serial port, no network required.'],
  ['return None on any error', 'raise exceptions', 'camera_client.capture() returns None on timeout, HTTP error, or connection drop. The orchestrator treats None as a normal code path. No exception flows, no "is it alive?" branching, no special cases. The dashboard reads the online flag instead.'],
  ['laptop Flask server over ESP32-CAM', 'dedicated camera hardware', 'The ESP32-CAM kept dropping frames and returning blurry JPEGs under desk lamps. A spare laptop serving GET /capture is more reliable and costs nothing extra. The Pi pulls frames on its own schedule.'],
  ['systemd services', 'manual startup', 'Two units (lock-in-orchestrator and lock-in-dashboard) start on boot and restart on failure. The Pi becomes a fully autonomous appliance: power it on and it just works.'],
]

export default function LockInPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 28px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginBottom: 14 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd projects/<Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>lock-in</Link>
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '22px 0', borderTop: '1px solid var(--accent)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 36, margin: 0, letterSpacing: -0.025, color: 'var(--fg)' }}>Lock-In</h1>
            <span className="pill" style={{ color: AMBER, borderColor: 'rgba(245,158,11,0.3)', fontFamily: MONO }}>● embedded · arduino + pi</span>
            <span style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', border: '1px dashed var(--border)', padding: '2px 6px', letterSpacing: 0.04 }}>SIT210</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.55, maxWidth: 580, margin: '0 0 16px' }}>
            A desk-side focus tracker that watches the physical world instead of the laptop. Arduino reads presence, distance, temperature, and light at 1 Hz. Raspberry Pi runs a five-state FSM driven by sensor frames, button events, and a Gemini vision call every 75 s. Built over a weekend. Boot-on-power via systemd. Total parts cost under AU$70.
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <a href="https://github.com/clupai8o0/lock-in-complete" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          </div>
        </div>

        {/* Dashboard screenshot */}
        <div data-stagger-item style={{ marginBottom: 16, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <Image
            src="/projects/lock-in/dashboard.webp"
            alt="Lock-In Flask dashboard showing IDLE state, pomodoro ring, distraction count, and system status pills"
            width={1400}
            height={1050}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Circuit diagram */}
        <div data-stagger-item style={{ marginBottom: 28, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-2)' }}>
          <Image
            src="/projects/lock-in/circuit.webp"
            alt="Arduino Uno wiring diagram showing all sensors, LEDs, buzzer, and USB serial connection to Raspberry Pi"
            width={1400}
            height={700}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 28 }}>
          {[
            { k: 'FSM states', v: '5' },
            { k: 'tests (4 suites)', v: '51' },
            { k: 'parts cost', v: 'AU$70' },
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
            Solo project, Deakin SIT210/730 Embedded Systems Development (Task 10.1D: Project Teaching Case). The constraint was deliberate: build something you&apos;d actually use, then write a Hackster.io-style how-to article that forces you to explain every decision to a stranger. The article became the best debugging session I had on the project. Re-reading every module from a stranger&apos;s perspective surfaced dead imports, a near-duplicate JSON serialisation call, and a sensor threshold that had been wrong since day two.
          </p>
        </div>

        {/* FSM states */}
        <div className="section-label" style={{ fontFamily: MONO }}>Finite state machine</div>
        <div style={{ position: 'relative', paddingLeft: 22, marginBottom: 28 }}>
          <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
          {FSM_STATES.map((s, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: 16 }}>
              <div style={{ position: 'absolute', left: -22, top: 4, width: 11, height: 11, borderRadius: 6, background: 'var(--bg)', border: `1.5px solid ${s.color}` }} />
              <div style={{ fontFamily: MONO, fontSize: 12, color: s.color, marginBottom: 2 }}>{s.state}</div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Hardware */}
        <div className="section-label" style={{ fontFamily: MONO }}>Hardware</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 28 }}>
          {HARDWARE.map(([part, role], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, padding: '9px 0', borderBottom: '1px solid var(--border)', alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--fg)' }}>{part}</span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: 'var(--muted)' }}>{role}</span>
            </div>
          ))}
        </div>

        {/* Key decisions */}
        <div className="section-label" style={{ fontFamily: MONO }}>Key decisions</div>
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

        {/* Code structure */}
        <div className="section-label" style={{ fontFamily: MONO }}>Code structure</div>
        <div style={{ fontFamily: MONO, fontSize: 11, background: 'var(--bg-2)', border: '1px solid var(--border)', padding: '14px 16px', marginBottom: 12, lineHeight: 1.8, color: 'var(--fg-dim)' }}>
          {[
            ['config.py', 'env vars → dataclass'],
            ['database.py', 'SQLite schema + queries'],
            ['serial_reader.py', 'async Arduino bridge, auto-reconnect'],
            ['camera_client.py', 'async HTTP /capture client'],
            ['vision_judge.py', 'Gemini call + strict JSON parser'],
            ['fsm.py', 'finite state machine: pure logic, no I/O'],
            ['mqtt_bus.py', 'async MQTT pub/sub, survives broker outages'],
            ['sd_notify.py', 'systemd watchdog/ready notifier, zero deps'],
            ['orchestrator.py', '8 asyncio tasks: serial, tick, vision, retention, mqtt, publish, watchdog'],
            ['dashboard/app.py', 'Flask + SSE fan-out over MQTT snapshot topic'],
          ].map(([file, desc]) => (
            <div key={file} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16 }}>
              <span style={{ color: 'var(--accent)' }}>{file}</span>
              <span style={{ color: 'var(--muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 28 }}>
          One rule kept the project from sprawling: each file does exactly one thing. The FSM is the most important: pure logic means testable in microseconds with a FakeClock, no mocking of serial ports or HTTP clients. MQTT is the primary IPC channel between the orchestrator and dashboard; both sides fall back to on-disk <code>snapshot.json</code> if the broker is offline.
        </p>

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }}>
          The cleanest lesson: handling absence is cheaper than handling exceptions. As soon as every client module returned None on any error and the orchestrator treated that as a normal code path, the rest of the system became simpler. No special cases, no &quot;is this still alive?&quot; branching. I&apos;d apply that convention from the very first file on the next embedded project, rather than discovering it halfway through.
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <a href="https://github.com/clupai8o0/lock-in-complete" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO, fontSize: 10 }}><Icon name="github" size={11} /> source</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO, fontSize: 10 }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
