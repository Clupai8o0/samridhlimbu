'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import { sendMatch } from '@/app/actions'
import { ChatPanel } from '@/components/chat/chat-panel'
import {
  MAX_TRAITS, ROLES, STACKS, TRAITS, WHO,
  matchProjects,
  type Answers, type Role, type Stack, type Trait, type Who,
} from '@/lib/match'
import { loadSaved, saveAnswers, clearSaved } from './match-store'
import styles from './match.module.css'

const STEPS = 4

type Draft = { who?: Who; role?: Role; traits: Trait[]; stacks: Stack[] }

const ROLE_QUESTION: Record<Who, string> = {
  hiring: 'What’s the role?',
  engineer: 'What do you work on?',
  client: 'What do you need built?',
  browsing: 'What are you into?',
}

function isWho(v: string | null): v is Who {
  return WHO.some(w => w.id === v)
}

const noop = () => () => {}

/** Steps 2–4 and the results, on /match. The modal asks step 1 and sends
 *  people here as /match?as=<who>. The start depends on localStorage, so it
 *  renders only after mount; the server sends an empty slot. */
export function MatchFlow() {
  const mounted = useSyncExternalStore(noop, () => true, () => false)
  return mounted ? <Flow /> : null
}

function Flow() {
  const search = useSearchParams()
  const as = search.get('as')
  const [init] = useState(() => {
    // Coming from the modal: start fresh at step 2 with their answer.
    if (isWho(as)) {
      return { step: 1, draft: { who: as, traits: [], stacks: [] } as Draft }
    }
    // A return visit lands on the saved results; a cold visit starts at step 1.
    const saved = loadSaved()
    return saved ? { step: STEPS, draft: saved as Draft } : { step: 0, draft: { traits: [], stacks: [] } as Draft }
  })
  const rootRef = useRef<HTMLDivElement>(null)
  const pending = useRef<number | null>(null)
  const titleId = useId()
  const [step, setStep] = useState(init.step)
  const [dir, setDir] = useState<'fwd' | 'back'>('fwd')
  const [draft, setDraft] = useState<Draft>(init.draft)
  const first = useRef(true)

  const cancelPending = () => {
    if (pending.current !== null) {
      window.clearTimeout(pending.current)
      pending.current = null
    }
  }

  useEffect(() => () => cancelPending(), [])

  // Drop ?as= once read, so a reload or a shared link shows the saved results
  // instead of restarting at step 2.
  useEffect(() => {
    if (as) {
      window.history.replaceState(window.history.state, '', '/match')
    }
  }, [as])

  // Each step replaces the buttons, so focus moves to the new question. Not on
  // first paint: the page's own heading and entrance come first.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    rootRef.current?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
    rootRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [step])

  const go = (next: number) => {
    cancelPending()
    setDir(next < step ? 'back' : 'fwd')
    setStep(next)
    if (next === STEPS && draft.who && draft.role) {
      saveAnswers(draft as Answers)
    }
  }

  const pickOne = <K extends 'who' | 'role'>(key: K, value: Draft[K]) => {
    setDraft(d => ({ ...d, [key]: value }))
    const target = step + 1
    cancelPending()
    pending.current = window.setTimeout(() => {
      pending.current = null
      setDir('fwd')
      setStep(target)
    }, 160)
  }

  const toggle = <K extends 'traits' | 'stacks'>(key: K, value: Draft[K][number], max?: number) => {
    setDraft(d => {
      const list = d[key] as string[]
      if (list.includes(value)) {
        return { ...d, [key]: list.filter(x => x !== value) }
      }
      if (max && list.length >= max) {
        return d
      }
      return { ...d, [key]: [...list, value] }
    })
  }

  const restart = () => {
    clearSaved()
    cancelPending()
    setDraft({ traits: [], stacks: [] })
    setDir('back')
    setStep(0)
  }

  // Number keys pick options, as in the modal.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement
      if (e.repeat || pending.current !== null || e.metaKey || e.ctrlKey || e.altKey || t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) {
        return
      }
      if (document.querySelector('dialog[open]')) {
        return
      }
      const n = Number(e.key)
      if (Number.isInteger(n) && n >= 1) {
        const btn = rootRef.current?.querySelector<HTMLButtonElement>(`[data-key="${n}"]`)
        if (btn && !btn.disabled) {
          e.preventDefault()
          btn.click()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const answers: Answers | null = draft.who && draft.role
    ? { who: draft.who, role: draft.role, traits: draft.traits, stacks: draft.stacks }
    : null

  const cmd = ['./match.sh', draft.who && `--as ${draft.who}`, draft.role && `--role ${draft.role}`]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div ref={rootRef} className={styles.panel}>
        <div className={styles.bar}>
          {step > 0 && step < STEPS ? (
            <button type="button" className={styles.iconBtn} onClick={() => go(step - 1)} aria-label="Back">
              ←
            </button>
          ) : null}
          <span className={styles.barCmd}><b>❯</b> {cmd}</span>
          <span aria-hidden="true">{step < STEPS ? `${step + 1}/${STEPS}` : 'done'}</span>
        </div>
        <div className={styles.progress} aria-hidden="true">
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} data-on={i < step || step === STEPS ? '' : undefined} />
          ))}
        </div>

        <div key={step} className={styles.body} data-dir={dir}>
          {step === 0 && (
            <>
              <p className={styles.kicker}>find the work that fits · 30 seconds</p>
              <h2 id={titleId} className={styles.question} tabIndex={-1}>Hi, I&apos;m Sam. Who&apos;s asking?</h2>
              <p className={styles.sub}>Four quick taps and I&apos;ll show you the projects that fit what you&apos;re after. No email needed.</p>
              <ul className={styles.options}>
                {WHO.map((w, i) => (
                  <li key={w.id}>
                    <button type="button" data-key={i + 1} className={styles.option} aria-pressed={draft.who === w.id} onClick={() => pickOne('who', w.id)}>
                      <span className={styles.optionKey}>{i + 1}</span>
                      <span className={styles.optionLabel}>
                        {w.label}
                        <span className={styles.optionHint}>{w.hint}</span>
                      </span>
                      <span className={styles.tick} aria-hidden="true">✓</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 1 && (
            <>
              <p className={styles.kicker}>step 2 · pick one</p>
              <h2 id={titleId} className={styles.question} tabIndex={-1}>{ROLE_QUESTION[draft.who ?? 'hiring']}</h2>
              <ul className={styles.options} data-grid="">
                {ROLES.map((r, i) => (
                  <li key={r.id}>
                    <button type="button" data-key={i + 1} className={styles.option} aria-pressed={draft.role === r.id} onClick={() => pickOne('role', r.id)}>
                      <span className={styles.optionKey}>{i + 1}</span>
                      <span className={styles.optionLabel}>{r.label}</span>
                      <span className={styles.tick} aria-hidden="true">✓</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 2 && (
            <>
              <p className={styles.kicker}>step 3 · pick up to {MAX_TRAITS}</p>
              <h2 id={titleId} className={styles.question} tabIndex={-1}>What matters most?</h2>
              <ul className={styles.options} data-grid="">
                {TRAITS.map((t, i) => {
                  const on = draft.traits.includes(t.id)
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        data-key={i + 1}
                        className={styles.option}
                        aria-pressed={on}
                        disabled={!on && draft.traits.length >= MAX_TRAITS}
                        onClick={() => toggle('traits', t.id, MAX_TRAITS)}
                      >
                        <span className={styles.optionKey}>{i + 1}</span>
                        <span className={styles.optionLabel}>{t.label}</span>
                        <span className={styles.tick} aria-hidden="true">✓</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <div className={styles.foot}>
                <span aria-live="polite">{draft.traits.length}/{MAX_TRAITS} picked</span>
                <button type="button" className={styles.btn} onClick={() => go(3)}>
                  {draft.traits.length ? 'Next →' : 'Skip →'}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className={styles.kicker}>step 4 · optional</p>
              <h2 id={titleId} className={styles.question} tabIndex={-1}>Any stack you use?</h2>
              <p className={styles.sub}>Pick any, or skip.</p>
              <ul className={styles.options} data-grid="">
                {STACKS.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      data-key={i < 9 ? i + 1 : undefined}
                      className={styles.option}
                      aria-pressed={draft.stacks.includes(s.id)}
                      onClick={() => toggle('stacks', s.id)}
                    >
                      <span className={styles.optionKey}>{i < 9 ? i + 1 : ''}</span>
                      <span className={styles.optionLabel}>{s.label}</span>
                      <span className={styles.tick} aria-hidden="true">✓</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className={styles.foot}>
                <span>{draft.stacks.length ? `${draft.stacks.length} picked` : ''}</span>
                <button type="button" className={styles.btn} onClick={() => go(4)}>
                  Show my matches →
                </button>
              </div>
            </>
          )}

          {step === STEPS && answers && (
            <Results answers={answers} titleId={titleId} onRestart={restart} />
          )}
        </div>
      </div>

      {step === STEPS && answers && (
        <section id="ask" className={styles.ask} aria-labelledby={`${titleId}-ask`}>
          <h2 id={`${titleId}-ask`} className={styles.askTitle}>Questions about these?</h2>
          <ChatPanel page />
        </section>
      )}
    </>
  )
}

function Results({ answers, titleId, onRestart }: {
  answers: Answers
  titleId: string
  onRestart: () => void
}) {
  const picks = matchProjects(answers)
  const role = ROLES.find(r => r.id === answers.role)?.label ?? ''
  const hiring = answers.who === 'hiring'

  return (
    <>
      <p className={styles.kicker}>{picks.length} matches · {role.toLowerCase()}</p>
      <h2 id={titleId} className={styles.question} tabIndex={-1}>
        {hiring ? 'Here’s the work that fits the role.' : 'Here’s what fits.'}
      </h2>
      <ol className={styles.results}>
        {picks.map((p, i) => (
          <li key={p.slug}>
            <Link href={`/projects/${p.slug}`} className={styles.result} style={{ '--i': i } as React.CSSProperties}>
              <span className={styles.resultHead}>
                <span className={styles.rank}>0{i + 1}</span>
                <span className={styles.resultName}>{p.name}</span>
                <span className={styles.resultArrow} aria-hidden="true">→</span>
              </span>
              <p className={styles.resultBlurb}>{p.blurb}</p>
              {p.reasons.length > 0 && (
                <span className={styles.reasons}>
                  {p.reasons.map(r => <span key={r} className={styles.reason}>✓ {r}</span>)}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>

      <InboxForm answers={answers} hiring={hiring} />

      <div className={styles.alt}>
        <a href="/api/resume" className={styles.btnGhost}>Resume PDF</a>
        <Link href="/projects" className={styles.btnGhost}>All projects</Link>
        <a href="#ask" className={styles.btnGhost}>Ask about them</a>
        <button type="button" className={styles.linkBtn} onClick={onRestart} style={{ marginLeft: 'auto' }}>
          ↺ retake
        </button>
      </div>
    </>
  )
}

function InboxForm({ answers, hiring }: { answers: Answers; hiring: boolean }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [trap, setTrap] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') {
      return
    }
    const to = email
    setStatus('sending')
    setErr('')
    let res: Awaited<ReturnType<typeof sendMatch>>
    try {
      res = await sendMatch({ email: to, name, note, answers, website: trap })
    } catch {
      res = { ok: false, error: 'send failed, try samridh@samridhlimbu.com' }
    }
    if (res.ok) {
      setSentTo(to)
      setStatus('sent')
    } else {
      setStatus('error')
      setErr(res.error)
    }
  }

  if (status === 'sent') {
    return (
      <div className={styles.inbox} role="status">
        <p className={styles.inboxTitle}><span className={styles.ok}>✓</span> Sent to {sentTo}</p>
        <p className={styles.inboxSub}>The shortlist is on its way, and I&apos;ve got your details. I&apos;ll reply within one business day.</p>
      </div>
    )
  }

  return (
    <form className={styles.inbox} onSubmit={submit}>
      <p className={styles.inboxTitle}>{hiring ? 'Want this in your inbox?' : 'Send me this list'}</p>
      <p className={styles.inboxSub}>
        Optional. You get the shortlist by email, and I see what you&apos;re looking for so I can reply properly.
      </p>
      <div className={styles.fields}>
        <div className={styles.fieldsRow}>
          <input
            id={`${id}-email`}
            className={styles.field}
            readOnly={status === 'sending'}
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@company.com"
            aria-label="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            id={`${id}-name`}
            className={styles.field}
            readOnly={status === 'sending'}
            type="text"
            autoComplete="organization"
            placeholder={hiring ? 'name or company (optional)' : 'name (optional)'}
            aria-label="Name or company, optional"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <textarea
          id={`${id}-note`}
          className={styles.field}
          readOnly={status === 'sending'}
          rows={2}
          placeholder={hiring ? 'a line about the role (optional)' : 'anything to add? (optional)'}
          aria-label="Note, optional"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
        <div className={styles.honeypot} aria-hidden="true">
          {/* An odd name on purpose: autofill and password managers leave it alone. */}
          <input tabIndex={-1} autoComplete="off" name="hp_reach_by_fax" value={trap} onChange={e => setTrap(e.target.value)} />
        </div>
      </div>
      <div className={styles.formFoot}>
        <span aria-live="polite">
          {status === 'error' && <span role="alert" className={styles.err}>✗ {err}</span>}
        </span>
        <button type="submit" className={styles.btn} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Email me the list'}
        </button>
      </div>
    </form>
  )
}
