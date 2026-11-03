import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { pageJsonLd } from '@/lib/seo'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'
import { Icon } from '@/components/icons'

const DESCRIPTION =
  'SIT225 Data Capture Technologies prototype: an Arduino Nano 33 IoT streams PPG, IMU and ambient readings over MQTT to a Raspberry Pi, which runs rule-based HRV and posture workers and nudges stretch or breathing breaks through Streamlit and a Windows toast client.'

export const metadata: Metadata = {
  title: 'Mindful break recommender · SIT225',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/mindful-break' },
  openGraph: {
    type: 'article',
    url: '/projects/mindful-break',
    title: 'Mindful break recommender · SIT225 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/mindful-break/og.webp', width: 1440, height: 840, alt: 'Diagram: Arduino sensors publish over MQTT to Pi workers, then Streamlit and a Windows notifier' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindful break recommender · SIT225 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/mindful-break/og.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const METRICS = [
  { k: 'Python + sketch lines', v: '2,114' },
  { k: 'Pi worker scripts', v: '6' },
  { k: 'sensor streams', v: '3' },
  { k: 'prompt kinds', v: '2' },
]

const TOPIC_CODE = `SUB_TOPIC = "mbreak/+/sensors/#"   # matches your sketch topics

def _bucket_for_topic(topic: str) -> str:
    # mbreak/<device_id>/sensors/{ppg|imu|env}
    parts = topic.split("/")
    ...`

const RULE_CODE = `def maybe_slouch(self, dev: str, rw: RuleWindow):
    if not self.can_prompt(rw) or self.any_active(dev): return
    rw.active_notify_id = self.emit_notify(
        dev, "Slouch detected", "Try a 10s stretch?", "stretch", 10, "slouch"
    )

def maybe_hrv_low(self, dev: str, rw: RuleWindow):
    if not self.can_prompt(rw) or self.any_active(dev): return
    rw.active_notify_id = self.emit_notify(
        dev, "Low HRV", "30s mindful breathing?", "breathing", 30, "hrv_low"
    )`

const DECISIONS = [
  ['MQTT topic schema per device', 'one flat topic', 'Streams land under mbreak/<device_id>/sensors/{ppg,imu,env}. Workers subscribe with wildcards, and the device id is parsed out of the topic so more than one board can share a broker.'],
  ['separate worker processes', 'one monolith loop', 'ingest, hrv_worker, posture_worker, env_worker and recommender each run as their own Python process. A crashed HRV worker does not take the dashboard with it, and each one can be restarted alone.'],
  ['rule-based prompts', 'a trained classifier', 'Low HRV or sustained slouch fires a stretch or breathing toast. Cooldowns and an active-notify check stop back-to-back prompts. No model weights ship with the repo.'],
  ['complementary filter + EMA for posture', 'raw accelerometer angles', 'posture_worker fuses accelerometer and gyro, then flags a sustained slouch past a calibrated pitch. The README marks the thresholds as calibration-dependent.'],
]

const TIMELINE = [
  { date: 'Jul–Sep 2025', title: 'Weekly SIT225 builds', body: 'The unit repo (SIT225_2025T2) holds week 1 through week 8 worksheets, Streamlit and Bokeh experiments, and a final-project commit on 4 Oct 2025.' },
  { date: '11 Dec 2025', title: 'Standalone product repo', body: 'mindful-break-recommender-system was initialised with the Arduino sketch, the six Pi scripts and the Windows notifier, plus a README that describes the pilot and its limits.', current: true },
]

const STACK: [string, string[]][] = [
  ['Edge', ['Arduino Nano 33 IoT', 'WiFiNINA', 'ArduinoMqttClient', 'MAX30102', 'MPU6050 / LSM6DS3', 'DHT11', 'LDR']],
  ['Pi', ['Python 3', 'paho-mqtt', 'Streamlit', 'NDJSON logs']],
  ['Desktop', ['Windows toast notifier', 'Start / Postpone / Skip']],
  ['Broker', ['MQTT (Mosquitto-class)']],
]

export default function MindfulBreakPage() {
  return (
    <PageShell jsonLd={pageJsonLd(metadata)}>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/mindful-break
        </div>

        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Mindful break recommender</h1>
            <span className="pill" style={{ fontFamily: MONO }}>uni · SIT225 · 2025</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            A desk-side IoT prototype for Deakin&apos;s SIT225 Data Capture Technologies unit. An Arduino Nano 33 IoT reads heart-related PPG, posture from an IMU, and room temperature, humidity and light, then publishes them over MQTT. A Raspberry Pi turns those streams into HRV and posture states and, when the rules fire, asks for a short stretch or a breathing break.
          </p>
        </div>

        <div data-stagger-item style={{ marginBottom: 24 }}>
          <Shot
            src="/projects/mindful-break/system.svg"
            alt="System diagram: Arduino sensors publish MQTT topics to Pi ingest and HRV, posture and environment workers; the recommender feeds a Streamlit dashboard and a Windows toast notifier"
            width={720}
            height={420}
            caption="Diagram of the pipeline. File and topic names match the repo."
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
          <p style={{ ...PROSE, margin: '0 0 14px' }}>
            The work lives in two places. The unit worksheets are in <code style={{ fontFamily: MONO, fontSize: '0.9em' }}>SIT225_2025T2</code>. The cleaned project, with the sketch, Pi services and Windows client, is the archived public repo linked below. There is no live deployment: the stack needs the board, a broker and the Pi.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            The README describes a single-participant pilot across four structured sessions, with end-to-end latency on the Pi in the tens to low hundreds of milliseconds. Those figures are not re-measured here; the page sticks to what the code shows.
          </p>
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>MQTT and the workers</div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          ingest subscribes to every sensor topic under a device and appends NDJSON. hrv_worker listens on PPG, finds peaks and publishes AVNN, SDNN and RMSSD. posture_worker and env_worker do the same for IMU and ambient readings. recommender fuses those metrics into prompts.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={TOPIC_CODE} lang="python" />
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>From pi/ingest.py — topic shape shared with the sketch.</p>
        </div>

        <div className="section-label" style={{ fontFamily: MONO }}>When a break fires</div>
        <p style={{ ...PROSE, margin: '0 0 16px' }}>
          Two prompt kinds ship in the recommender: a 10-second stretch on sustained slouch, and 30 seconds of breathing on low HRV. can_prompt enforces a cooldown; any_active blocks a second toast while one is still open.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre code={RULE_CODE} lang="python" />
          <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8, lineHeight: 1.5 }}>From pi/recommender.py — the two emit paths.</p>
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
            Keep Wi-Fi and MQTT credentials out of the sketch. They are hard-coded in the archived Arduino file; they should be rotated and loaded from a local config that never gets committed.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Default every worker to localhost. Some scripts still ship with LAN IP defaults from the desk setup.
          </p>
          <p style={{ ...PROSE, color: 'var(--muted)', margin: 0 }}>
            Treat PPG motion artefacts as a first-class failure. The README already flags low-cost PPG under movement; a fault state for that case would stop bad HRV from firing breaks.
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
          <a href="https://github.com/Clupai8o0/mindful-break-recommender-system" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> project repo</a>
          <a href="https://github.com/Clupai8o0/SIT225_2025T2" target="_blank" rel="noopener noreferrer" className="btn" style={{ fontFamily: MONO }}><Icon name="github" size={12} /> unit worksheets</a>
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
