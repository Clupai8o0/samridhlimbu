import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { Shot } from '@/components/case-study/shot'
import { CodePre } from '@/components/code-pre'

const DESCRIPTION =
  'A voice switch for lights and a fan, built for SIT210 at Deakin in T1 2026. A Mac records a clip, a Raspberry Pi 5 turns it into a command with ElevenLabs and Gemini and speaks a reply, and an Arduino switches the LEDs over Bluetooth Low Energy.'

export const metadata: Metadata = {
  title: 'Voice light controller · SIT210',
  description: DESCRIPTION,
  alternates: { canonical: '/projects/voice-controller' },
  openGraph: {
    type: 'article',
    url: '/projects/voice-controller',
    title: 'Voice light controller · SIT210 · Samridh Limbu',
    description: DESCRIPTION,
    images: [{ url: '/projects/voice-controller/og.webp', width: 1200, height: 630, alt: 'Diagram: a Mac sends audio over TCP to a Raspberry Pi 5, which talks to ElevenLabs and Gemini and writes over BLE to an Arduino that switches the bathroom, hallway and fan LEDs' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voice light controller · SIT210 · Samridh Limbu',
    description: DESCRIPTION,
    images: ['/projects/voice-controller/og.webp'],
  },
}

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'
const GREEN = 'var(--term-green)'

const PROSE = { fontFamily: SANS, fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.65, maxWidth: 640 }

const LOG = {
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

const LOG_CAPTION = { fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', lineHeight: 1.5, marginTop: 8 }

const METRICS = [
  { k: 'devices', v: '3' },
  { k: 'commands the Arduino accepts', v: '9' },
  { k: 'cloud calls per command', v: '3' },
  { k: 'lines in three source files', v: '400' },
]

const PROMPT_CODE = `Available commands:
- bathroom_on / bathroom_off
- hallway_on / hallway_off
- fan_on / fan_off
- all_on / all_off

Rules:
- If the intent is clear, return: {"command": "bathroom_on", "response": "Turning on the bathroom light."}
- If ambiguous or unclear, return: {"command": null, "response": "Sorry, I didn't catch that. Could you say it again?"}
- "response" is what will be spoken back to Linda. Keep it short and natural.
- Return ONLY valid JSON. No markdown, no explanation, no backticks.`

const PARSE_CODE = `def parse_intent(transcript: str) -> dict:
    """Send transcript to Gemini, get back structured command."""
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash-lite",
        config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
        contents=f"User said: \\"{transcript}\\""
    )
    raw = response.text.strip().replace("\`\`\`json", "").replace("\`\`\`", "").strip()
    print(f"[Gemini] {raw}")
    return json.loads(raw)`

const BLE_CODE = `async def send_ble_command(command: str):
    global ble_client
    if ble_client is None or not ble_client.is_connected:
        print("[BLE] Reconnecting...")
        await connect_ble()
    async with ble_lock:
        await ble_client.write_gatt_char(
            CMD_CHAR_UUID,
            command.encode("utf-8"),
            response=True
        )
        print(f"[BLE] Sent: {command}")`

const ARDUINO_CODE = `void handleCommand(String cmd) {
  String response = "";

  if (cmd == "bathroom_on") {
    bathroomState = true;
    digitalWrite(BATHROOM_LED, HIGH);
    response = "OK:bathroom_on";
  // ... five more the same shape (bathroom_off, hallway_on,
  // hallway_off, fan_on, fan_off), then all_on and all_off via setAll()
  } else if (cmd == "status") {
    response = getStatus();
  } else {
    response = "ERR:unknown_command";
  }

  statusCharacteristic.setValue(response);
  Serial.println("CMD: " + cmd + " | RES: " + response);
}`

const HANDLER_LOG = `write "bathroom_on"
  notify: OK:bathroom_on   pins D2 D3 D4 = 1 0 0
write "fan_on"
  notify: OK:fan_on   pins D2 D3 D4 = 1 0 1
write "status"
  notify: STATUS:bathroom=1,hallway=0,fan=1   pins D2 D3 D4 = 1 0 1
write "all_off"
  notify: OK:all_off   pins D2 D3 D4 = 0 0 0
write "status"
  notify: STATUS:bathroom=0,hallway=0,fan=0   pins D2 D3 D4 = 0 0 0
write "hallway_on\\r\\n"
  notify: OK:hallway_on   pins D2 D3 D4 = 0 1 0
write "Bathroom_On"
  notify: ERR:unknown_command   pins D2 D3 D4 = 0 1 0
write "kitchen_on"
  notify: ERR:unknown_command   pins D2 D3 D4 = 0 1 0`

const LOOPBACK_LOG = `[Net] Sending 80044 bytes to 127.0.0.1:3425...
[Net] Sent. Waiting for RPi to process...
sent     80044 bytes  sha256 a6d531f6b680c7b1
received 80044 bytes  sha256 a6d531f6b680c7b1
identical`

const PIPELINE_LOG = `[fenced JSON]
  speak  'Turning on the fan.'
  ble    'fan_on'
[command null]
  speak  "Sorry, I didn't catch that. Could you say it again?"
[text before JSON]
  log    [ERROR] Gemini bad JSON: Expecting value: line 1 column 1 (char 0)
  speak  'Something went wrong. Please try again.'
[name not in sketch]
  speak  'Turning on the kitchen light.'
  ble    'kitchen_on'
[empty transcript]
  speak  "I didn't hear anything. Please try again."
[Arduino out of range, real send_ble_command]
  speak  'Turning on the bathroom light.'
  log    [ERROR] 'NoneType' object has no attribute 'write_gatt_char'
  speak  'Sorry, there was an error.'`

const DECISIONS = [
  ['a model for the meaning', 'keyword matching', 'Gemini maps loose phrasing onto eight fixed commands. One of the examples in the prompt is "I need to go to the bathroom", which should turn the bathroom light on. That sentence has neither "on" nor "off" in it, so a keyword list would have to guess.'],
  ['JSON with a null command', 'free text back', 'The prompt asks for a JSON object and nothing else: a command and a sentence to say. When the request is unclear the command is null, so the Pi only answers and no switch moves.'],
  ['BLE for the last hop', 'Wi-Fi and MQTT', 'Task 4.2D in the same unit switched the Arduino\'s lights through an MQTT broker. Here the Pi connects to the board directly over BLE, so the switch itself needs no broker and no Wi-Fi on the Arduino.'],
  ['plain text commands', 'a byte code', 'A command is a short string like fan_on, 12 bytes at most against the 32 the characteristic allows. The Arduino logs each one as CMD: fan_on | RES: OK:fan_on, so the serial monitor reads like a transcript.'],
  ['the Mac only records', 'one machine doing everything', 'The Mac script imports no AI or Bluetooth library. It records, writes a WAV and sends it. The service calls and the BLE link live on the Pi next to the board.'],
]

const STACK: [string, string[]][] = [
  ['Mac', ['Python', 'sounddevice', 'NumPy', 'SciPy', 'TCP sockets']],
  ['Pi 5', ['Python', 'asyncio', 'bleak', 'google-genai', 'elevenlabs']],
  ['Board', ['Arduino', 'ArduinoBLE', 'three LEDs']],
  ['Services', ['ElevenLabs Scribe v2', 'Gemini 2.5 Flash-Lite', 'ElevenLabs Turbo v2.5']],
]

export default function VoiceControllerPage() {
  return (
    <PageShell>
      <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '36px 20px' }}>

        <PageHeader />

        {/* breadcrumb */}
        <div data-stagger-item style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted)', marginBottom: 16 }}>
          <span style={{ color: 'var(--accent)' }}>❯</span>{' '}
          cd <Link href="/projects" style={{ color: 'var(--fg)', textDecoration: 'none' }}>projects</Link>/voice-controller
        </div>

        {/* Banner */}
        <div data-stagger-item style={{ padding: '24px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', columnGap: 12, rowGap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'var(--text-2xl)', lineHeight: 1.1, margin: 0, letterSpacing: '-0.025em', color: 'var(--fg)' }}>Voice light controller</h1>
            <span className="pill" style={{ fontFamily: MONO }}>uni · SIT210 · T1 2026</span>
          </div>
          <p style={{ ...PROSE, fontSize: 'var(--text-base)', margin: 0 }}>
            You say &ldquo;turn on the bathroom light&rdquo; and the bathroom LED comes on. A Mac records what you say. A Raspberry Pi 5 sends the clip to ElevenLabs for text, asks Gemini which command you meant, and reads a short reply out loud. Then it tells an Arduino over Bluetooth Low Energy which LED to switch.
          </p>
        </div>

        {/* Hero */}
        <div data-stagger-item style={{ maxWidth: 480, margin: '0 auto 24px' }}>
          <Shot
            src="/projects/voice-controller/system.svg"
            alt="System diagram. A Mac running mac_audio_sensor.py records 16 kHz mono WAV and sends it over TCP port 9876 to a Raspberry Pi 5. On the Pi, receive_audio_file, transcribe, parse_intent, speak and send_ble_command run in order; transcribe and speak call ElevenLabs, parse_intent calls Gemini 2.5 Flash-Lite. send_ble_command writes fan_on over BLE to an Arduino named LightController, whose handleCommand switches LEDs on D2 bathroom, D3 hallway and D4 fan, and notifies OK:fan_on back."
            width={400}
            height={680}
            caption="Diagram of the system, with the file, function and pin names from the code."
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
          <p style={{ ...PROSE, margin: '0 0 14px' }}>
            Task 8.1HD in SIT210, Embedded Systems Development, at Deakin. The unit&apos;s tasks share one made-up scenario: Linda, who lives in a retirement village. In task 1.1P she got a button that lights the porch and hallway. Here she asks out loud for the bathroom light, the hallway light or the fan.
          </p>
          <p style={{ ...PROSE, margin: 0 }}>
            The first version, committed late on 10 Apr 2026, was a typed menu on the Pi: enter 1 to 9 and it wrote that command over BLE. The voice version replaced it later that night. It ran on the bench with the real boards for the unit&apos;s demo video. The boards were not available for this write-up, so there are no screenshots. This page shows the code, two diagrams, and the parts I could run on a laptop with no boards and no AI service.
          </p>
        </div>

        {/* One command */}
        <div className="section-label" style={{ fontFamily: MONO }}>One command, start to finish</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          On the Mac you press Enter to start recording and Enter again to stop. The script saves a 16 kHz mono WAV and sends the raw bytes to the Pi on TCP port 9876. There is no length header. The Mac closes the socket and the Pi reads until the stream ends.
        </p>
        <p style={{ ...PROSE, margin: '0 0 20px' }}>
          The Pi then makes three cloud calls in a row: speech to text, text to a command, and a spoken reply. Only after the reply does it write the command to the Arduino, as a BLE write with response.
        </p>
        <div style={{ maxWidth: 480, margin: '0 auto 40px' }}>
          <Shot
            src="/projects/voice-controller/sequence.svg"
            alt="Sequence diagram with five lifelines: Mac, Pi 5, ElevenLabs, Gemini, Arduino. Mac sends WAV to the Pi. The Pi sends audio to ElevenLabs and gets text, sends prompt and text to Gemini and gets JSON. Inside speak(), it sends the reply to ElevenLabs, gets MP3 and calls play(). Inside send_ble_command(), it writes fan_on to the Arduino, which sets D4 high and notifies OK:fan_on."
            width={400}
            height={452}
            caption="The order of calls for one command, taken from process_audio(). The shaded rows are the reply and the switch."
          />
        </div>

        {/* Gemini */}
        <div className="section-label" style={{ fontFamily: MONO }}>Turning words into a command</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Gemini gets a system prompt that lists the commands and asks for JSON only. Part of it:
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={PROMPT_CODE} />
          <div style={LOG_CAPTION}>Lines 22 to 32 of rpi_voice_controller.py, inside SYSTEM_PROMPT. The prompt also has four worked examples.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The prompt says no markdown, but the parser strips code fences anyway before it parses the JSON.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={PARSE_CODE} lang="python" />
          <div style={LOG_CAPTION}>parse_intent() in rpi_voice_controller.py, as committed.</div>
        </div>

        {/* BLE */}
        <div className="section-label" style={{ fontFamily: MONO }}>The Bluetooth link</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          The Arduino advertises as LightController with one service and two characteristics: one the Pi writes commands to, and one the Arduino updates with its result, which the Pi subscribes to. At start-up the Pi scans for that name for up to 10 seconds. Before each write it reconnects if the link has dropped.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={BLE_CODE} lang="python" />
          <div style={LOG_CAPTION}>send_ble_command() in rpi_voice_controller.py, as committed.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          On the board, the loop trims each written string and hands it to one function. Each command sets the status string the Pi is notified of, and prints one line to the serial monitor.
        </p>
        <div data-reveal style={{ marginBottom: 40 }}>
          <CodePre style={LOG} code={ARDUINO_CODE} lang="js" />
          <div style={LOG_CAPTION}>handleCommand() in program.ino, trimmed where the comment says.</div>
        </div>

        {/* What I ran */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I could run without the boards</div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          I ran these on 28 Oct 2026 from a fresh clone. First, the Arduino&apos;s handleCommand() and its state, copied unchanged out of program.ino and compiled on a Mac against a small stand-in for the Arduino library. The stand-in records the pin writes and the status string.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={HANDLER_LOG} />
          <div style={LOG_CAPTION}>Output of the host build, trimmed to the status string and pins after each write; the serial lines are left out. Matching is exact and case-sensitive, after whitespace at either end is trimmed.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Next, the Mac&apos;s save_wav() and send_to_rpi() talking to the Pi&apos;s receive_audio_file() over loopback. A 2.5 second test tone stood in for the microphone, and the port was moved off 9876.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={LOOPBACK_LOG} />
          <div style={LOG_CAPTION}>The first two lines are the sender&apos;s own prints. 80,044 bytes is a 44-byte WAV header plus 2.5 s of 16-bit samples at 16 kHz.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 14px' }}>
          Last, I ran the real process_audio() and parse_intent(), with fakes for ElevenLabs, Gemini and the Bluetooth write that record what would have been said and sent. I typed the Gemini replies myself to reach each code path; none came from Gemini. The last case runs the real send_ble_command() with the board scan stubbed to find nothing. On the Pi that scan would first wait up to 10 seconds.
        </p>
        <div data-reveal style={{ marginBottom: 24 }}>
          <CodePre style={LOG} code={PIPELINE_LOG} />
          <div style={LOG_CAPTION}>Output of the pipeline run, complete. I typed every reply fed to parse_intent() by hand.</div>
        </div>
        <p style={{ ...PROSE, margin: '0 0 40px' }}>
          Two of those cases show the same gap. The reply is spoken before the Arduino answers. If Gemini ever names a command the sketch does not have, the user hears &ldquo;Turning on the kitchen light&rdquo; and nothing happens; the board&apos;s ERR:unknown_command only reaches the Pi&apos;s log. With the board out of range, the user hears the light confirmed and then an error.
        </p>

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

        {/* What I'd do differently */}
        <div className="section-label" style={{ fontFamily: MONO }}>What I&apos;d do differently</div>
        <p style={{ ...PROSE, color: 'var(--muted)', margin: '0 0 40px' }}>
          Check the command against the sketch&apos;s list before saying anything, and speak only after the Arduino&apos;s OK comes back, so the voice never confirms a switch that did not happen. The sketch also answers a status command that the prompt never offers, so asking &ldquo;is the fan on?&rdquo; cannot work yet. And pressing Enter on a laptop is not hands-free; a wake word on the Pi would suit the scenario better.
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
          <Link href="/projects" className="btn btn-ghost" style={{ fontFamily: MONO }}>← back to projects</Link>
        </div>

      </div>
    </PageShell>
  )
}
