'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { STARTERS } from '@/lib/chat/starters'
import styles from './chat.module.css'

type Msg = { role: 'user' | 'assistant'; content: string }

const STORE_KEY = 'chat:v1'
const MAX_CHARS = 600

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
// Only links that start with "/" become links; anything else stays text.
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
  const abort = useRef<AbortController | null>(null)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  async function send(text: string)
  {
    const q = text.trim().slice(0, MAX_CHARS)
    if (!q || busy) {
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
    let failed: string | null = null
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null) as { error?: string } | null
        throw new Error(data?.error ?? 'Something went wrong. Try again.')
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
      const done: Msg[] = [...history, { role: 'assistant', content: answer }]
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
            <ul className={styles.starters}>
              {STARTERS.map((s) => (
                <li key={s}>
                  <button type="button" className={styles.starter} onClick={() => send(s)}>
                    <span aria-hidden="true">❯</span> {s}
                  </button>
                </li>
              ))}
            </ul>
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
          <button type="submit" className={styles.send} disabled={!input.trim()}>send ↵</button>
        )}
      </form>
      <div className={styles.note}>
        <span>AI answers from this site. They can be wrong; the case studies are the source.</span>
        {msgs.length > 0 && !busy ? (
          <button type="button" className={styles.clear} onClick={clear}>clear</button>
        ) : null}
      </div>
    </div>
  )
}
