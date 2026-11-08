'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { STARTERS } from '@/lib/chat/starters'
import styles from './chat.module.css'

type Msg = { role: 'user' | 'assistant'; content: string; sig?: string }

const STORE_KEY = 'chat:v1'
const MAX_CHARS = 600
const MAX_QUESTIONS = 10 // per conversation; clear to start again

type ChatState = 'loading' | 'on' | 'off' | 'paused' | 'budget'
interface Status { state: ChatState; siteKey: string | null; verified: boolean }

// ── Captcha (Cloudflare Turnstile, invisible unless it needs a click) ──

interface Turnstile
{
  render(el: HTMLElement, opts: Record<string, unknown>): string
  reset(id?: string): void
  remove(id?: string): void
}

declare global {
  interface Window { turnstile?: Turnstile }
}

let turnstileScript: Promise<void> | null = null

function loadTurnstile(): Promise<void>
{
  if (window.turnstile) {
    return Promise.resolve()
  }
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const el = document.createElement('script')
    el.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    el.async = true
    el.onload = () => resolve()
    el.onerror = () => {
      turnstileScript = null
      reject(new Error('captcha did not load'))
    }
    document.head.appendChild(el)
  })
  return turnstileScript
}

/** Renders the widget while a captcha is needed; `take()` waits for a token. */
function useCaptcha(siteKey: string | null, needed: boolean)
{
  const box = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const token = useRef<string | null>(null)
  const waiters = useRef<((t: string | null) => void)[]>([])

  useEffect(() => {
    if (!siteKey || !needed) {
      return
    }
    let gone = false
    const settle = (t: string | null) => {
      const ws = waiters.current.splice(0)
      ws.forEach((w) => w(t))
      return ws.length > 0
    }
    loadTurnstile().then(() => {
      if (gone || !box.current || !window.turnstile) {
        return
      }
      widget.current = window.turnstile.render(box.current, {
        sitekey: siteKey,
        action: 'chat',
        theme: 'dark',
        size: 'flexible',
        appearance: 'interaction-only',
        callback: (t: string) => {
          token.current = settle(t) ? null : t
        },
        'expired-callback': () => {
          token.current = null
        },
        'error-callback': () => {
          token.current = null
          settle(null)
        },
      })
    }).catch(() => settle(null))
    return () => {
      gone = true
      if (widget.current) {
        window.turnstile?.remove(widget.current)
      }
      widget.current = null
      token.current = null
    }
  }, [siteKey, needed])

  const take = useCallback((): Promise<string | null> => {
    const t = token.current
    if (t) {
      token.current = null
      return Promise.resolve(t)
    }
    return new Promise((resolve) => {
      const waiter = (v: string | null) => {
        window.clearTimeout(timer)
        resolve(v)
      }
      // Give up after 30 s, and leave the queue so a later token isn't lost.
      const timer = window.setTimeout(() => {
        waiters.current = waiters.current.filter((w) => w !== waiter)
        resolve(null)
      }, 30000)
      waiters.current.push(waiter)
    })
  }, [])

  // Tokens work once; ask for a fresh one for the next try.
  const reset = useCallback(() => {
    token.current = null
    if (widget.current) {
      window.turnstile?.reset(widget.current)
    }
  }, [])

  return { box, take, reset }
}

function resetDate(): string
{
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).toLocaleDateString('en-AU', { day: 'numeric', month: 'long' })
}

/** Shown in place of the input once the monthly budget is used up. */
function OutOfBudget({ onNavigate }: { onNavigate?: () => void })
{
  return (
    <div className={styles.spent} role="status">
      <p className={styles.spentHead}>
        <span className={styles.spentDot} aria-hidden="true" />
        <span>budget.monthly</span>
        <span className={styles.spentPct}>100%</span>
      </p>
      <div className={styles.meter} aria-hidden="true"><span className={styles.meterFill} /></div>
      <p className={styles.spentText}>
        The chat has used this month&apos;s budget, so it&apos;s resting until {resetDate()}.
      </p>
      <p className={styles.spentText}>
        <Link href="/#contact-heading" onClick={onNavigate}>Write to Sam directly →</Link>
      </p>
    </div>
  )
}

function loadSaved(): Msg[]
{
  try {
    const raw = JSON.parse(sessionStorage.getItem(STORE_KEY) ?? '[]')
    return Array.isArray(raw) ? raw.filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') : []
  } catch {
    return []
  }
}

// Answers use plain text, "- " bullets and markdown links to site paths.
// Only links that start with "/", plus the few outside pages listed here,
// become links; anything else stays text.
const OUTSIDE_LINKS = new Set(['https://clupai.com/start', 'https://www.clupai.com/start'])

function inline(text: string, onNavigate?: () => void): ReactNode[]
{
  const out: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    out.push(text.slice(last, m.index))
    const [, label, href] = m
    if (href.startsWith('/') && !href.startsWith('//')) {
      out.push(<Link key={m.index} href={href} onClick={onNavigate}>{label}</Link>)
    } else if (OUTSIDE_LINKS.has(href.replace(/\/$/, ''))) {
      out.push(<a key={m.index} href={href} target="_blank" rel="noopener">{label} ↗</a>)
    } else {
      out.push(label)
    }
    last = m.index + m[0].length
  }
  out.push(text.slice(last))
  return out
}

function Answer({ text, onNavigate }: { text: string; onNavigate?: () => void })
{
  const blocks: ReactNode[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      blocks.push(<ul key={`l${blocks.length}`}>{list.map((l, i) => <li key={i}>{inline(l, onNavigate)}</li>)}</ul>)
      list = []
    }
  }
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (/^[-*•] /.test(t)) {
      list.push(t.slice(2))
      continue
    }
    flush()
    if (t) {
      blocks.push(<p key={`p${blocks.length}`}>{inline(t.replace(/\*\*/g, ''), onNavigate)}</p>)
    }
  }
  flush()
  return <>{blocks}</>
}

/** The chat itself: history, starters and the input. Used inside the dialog
 *  and on its own. `onNavigate` runs when a visitor follows a link in an answer. */
export function ChatPanel({ onNavigate, autoFocus, page }: { onNavigate?: () => void; autoFocus?: boolean; page?: boolean })
{
  // Only ever rendered after mount (inside the dialog), so sessionStorage is there.
  const [msgs, setMsgs] = useState<Msg[]>(() => (typeof window === 'undefined' ? [] : loadSaved()))
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>({ state: 'loading', siteKey: null, verified: false })
  const abort = useRef<AbortController | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const captcha = useCaptcha(status.siteKey, status.state === 'on' && !status.verified)

  // Is the chat on, and has this visitor passed a captcha already?
  // Retries a few times; if it still fails, the chat shows as off.
  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get('demo')
    const url = `/api/chat${demo ? `?demo=${encodeURIComponent(demo)}` : ''}`
    let gone = false
    let timer = 0
    const load = (tries: number) => {
      fetch(url, { cache: 'no-store' })
        .then((r) => (r.ok ? (r.json() as Promise<Status>) : Promise.reject(new Error(String(r.status)))))
        .then((s) => {
          if (!gone) {
            setStatus(s)
          }
        })
        .catch(() => {
          if (gone) {
            return
          }
          if (tries < 3) {
            timer = window.setTimeout(() => load(tries + 1), 1000 * 2 ** tries)
          } else {
            setStatus({ state: 'off', siteKey: null, verified: false })
          }
        })
    }
    load(0)
    return () => {
      gone = true
      window.clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus({ preventScroll: true })
    }
  }, [autoFocus])

  useEffect(() => {
    const el = logRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [msgs, busy, error])

  useEffect(() => () => abort.current?.abort(), [])

  const save = (list: Msg[]) => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(list))
    } catch {
      // Private mode: the chat still works, it just isn't kept.
    }
  }

  const asked = msgs.filter((m) => m.role === 'user').length

  async function send(text: string)
  {
    const q = text.trim().slice(0, MAX_CHARS)
    if (!q || busy || status.state !== 'on' || asked >= MAX_QUESTIONS) {
      return
    }
    const history: Msg[] = [...msgs, { role: 'user', content: q }]
    setMsgs([...history, { role: 'assistant', content: '' }])
    setInput('')
    setError(null)
    setBusy(true)
    const ctrl = new AbortController()
    abort.current = ctrl
    let answer = ''
    let sig: string | undefined
    let failed: string | null = null
    try {
      let token: string | null = null
      if (!status.verified) {
        token = await captcha.take()
        captcha.reset()
        if (!token) {
          throw new Error("Couldn't confirm you're human. Try again.")
        }
      }
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, ...(token ? { captcha: token } : {}) }),
        signal: ctrl.signal,
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null) as { error?: string; code?: string } | null
        const code = data?.code
        if (code === 'budget' || code === 'off' || code === 'paused') {
          setStatus((s) => ({ ...s, state: code }))
        } else if (code === 'captcha') {
          setStatus((s) => ({ ...s, verified: false }))
        }
        throw new Error(data?.error ?? 'Something went wrong. Try again.')
      }
      if (!status.verified) {
        setStatus((s) => ({ ...s, verified: true }))
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) {
          break
        }
        buf += dec.decode(value, { stream: true })
        let nl: number
        while ((nl = buf.indexOf('\n')) !== -1) {
          const line = buf.slice(0, nl)
          buf = buf.slice(nl + 1)
          if (!line) {
            continue
          }
          const ev = JSON.parse(line) as { t: string; v?: string }
          if (ev.t === 'text' && ev.v) {
            answer += ev.v
            const a = answer
            setMsgs([...history, { role: 'assistant', content: a }])
          } else if (ev.t === 'sig' && ev.v) {
            sig = ev.v
          } else if (ev.t === 'error') {
            failed = ev.v ?? 'Something went wrong. Try again.'
          }
        }
      }
    } catch (err) {
      if (!ctrl.signal.aborted) {
        failed = err instanceof Error ? err.message : 'Something went wrong. Try again.'
      }
    } finally {
      abort.current = null
      setBusy(false)
    }

    if (answer.trim()) {
      const done: Msg[] = [...history, { role: 'assistant', content: answer, ...(sig ? { sig } : {}) }]
      setMsgs(done)
      save(done)
      if (failed) {
        setError(failed)
      }
      return
    }
    // Nothing came back: drop the question and put it back in the box (unless
    // a new one is being typed), so the history stays question/answer pairs.
    setMsgs(msgs)
    setInput((cur) => (cur.trim() ? cur : q))
    setError(failed ?? (ctrl.signal.aborted ? null : 'No answer came back. Try again.'))
  }

  const clear = () => {
    abort.current?.abort()
    setMsgs([])
    setError(null)
    save([])
    inputRef.current?.focus()
  }

  return (
    <div className={styles.panel} data-page={page ? '' : undefined}>
      <div ref={logRef} className={styles.log} aria-live="polite" aria-busy={busy}>
        {msgs.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.hello}>Ask anything about my projects, stack or experience. Answers come from the case studies on this site.</p>
            {status.state === 'on' || status.state === 'loading' ? <ul className={styles.starters}>
              {STARTERS.map((s) => (
                <li key={s}>
                  <button type="button" className={styles.starter} onClick={() => send(s)}>
                    <span aria-hidden="true">❯</span> {s}
                  </button>
                </li>
              ))}
            </ul> : null}
          </div>
        ) : (
          msgs.map((m, i) => (
            <div key={i} className={styles.msg} data-role={m.role}>
              <span className={styles.who} aria-hidden="true">{m.role === 'user' ? '❯' : '●'}</span>
              <span className="sr-only">{m.role === 'user' ? 'You:' : 'Answer:'}</span>
              <div className={styles.text}>
                {m.role === 'user' ? (
                  <p>{m.content}</p>
                ) : m.content ? (
                  <Answer text={m.content} onNavigate={onNavigate} />
                ) : (
                  <p className={styles.thinking}>reading the case studies<span className={styles.caret} aria-hidden="true" /></p>
                )}
              </div>
            </div>
          ))
        )}
        {error ? <p className={styles.error} role="alert">✗ {error}</p> : null}
      </div>

      <div ref={captcha.box} className={styles.captcha} />
      {status.state === 'budget' ? (
        <OutOfBudget onNavigate={onNavigate} />
      ) : status.state === 'off' || status.state === 'paused' ? (
        <p className={styles.offNote} role="status">
          The chat is {status.state === 'paused' ? 'paused' : 'off'} right now.{' '}
          <Link href="/#contact-heading" onClick={onNavigate}>Write to Sam directly →</Link>
        </p>
      ) : asked >= MAX_QUESTIONS && !busy ? (
        <p className={styles.offNote} role="status">
          That&apos;s {MAX_QUESTIONS} questions in this chat. Clear it to start a new one.
        </p>
      ) : (
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <label htmlFor="chat-input" className="sr-only">Your question</label>
        <span className={styles.prompt} aria-hidden="true">❯</span>
        <textarea
          id="chat-input"
          ref={inputRef}
          className={styles.input}
          rows={1}
          value={input}
          maxLength={MAX_CHARS}
          placeholder="Ask about my work…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              send(input)
            }
          }}
        />
        {busy ? (
          <button type="button" className={styles.send} onClick={() => abort.current?.abort()}>stop</button>
        ) : (
          <button type="submit" className={styles.send} disabled={!input.trim() || status.state === 'loading'}>send ↵</button>
        )}
      </form>
      )}
      <div className={styles.note}>
        <span>AI answers from this site. They can be wrong; the case studies are the source.</span>
        {msgs.length > 0 && !busy ? (
          <button type="button" className={styles.clear} onClick={clear}>clear</button>
        ) : null}
      </div>
    </div>
  )
}
