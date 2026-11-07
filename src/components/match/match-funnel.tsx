'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { WHO, type Who } from '@/lib/match'
import { loadSaved } from './match-store'
import styles from './match.module.css'

/** Dispatch this on window to open the funnel from anywhere. */
export const OPEN_MATCH_EVENT = 't2:open-match'
const STEPS = 4

export function openMatch() {
  window.dispatchEvent(new Event(OPEN_MATCH_EVENT))
}

/** Mounted once in the root layout (inside Suspense, for useSearchParams).
 *  Opens on the event, or on ?match / #match in the URL, including after a
 *  client-side navigation. The modal asks the first question; the rest is
 *  on /match. Someone with saved answers goes straight to /match. */
export function MatchProvider() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const search = useSearchParams()
  const router = useRouter()

  const start = useCallback(() => {
    if (window.location.pathname === '/match') {
      return
    }
    if (loadSaved()) {
      router.push('/match')
      return
    }
    setOpen(true)
  }, [router])

  useEffect(() => {
    window.addEventListener(OPEN_MATCH_EVENT, start)
    return () => window.removeEventListener(OPEN_MATCH_EVENT, start)
  }, [start])

  useEffect(() => {
    function fromUrl() {
      const url = new URL(window.location.href)
      if (!url.searchParams.has('match') && url.hash !== '#match') {
        return
      }
      // A shared link like samridhlimbu.com/?match opens straight into it.
      url.searchParams.delete('match')
      if (url.hash === '#match') {
        url.hash = ''
      }
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
      start()
    }
    fromUrl()
    window.addEventListener('hashchange', fromUrl)
    return () => window.removeEventListener('hashchange', fromUrl)
  }, [pathname, search, start])

  return open ? <MatchDialog onClose={() => setOpen(false)} /> : null
}

function MatchDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const downOnBackdrop = useRef(false)
  const pending = useRef<number | null>(null)
  const titleId = useId()
  const router = useRouter()
  const pathname = usePathname()
  const openedOn = useRef(pathname)
  const [who, setWho] = useState<Who | null>(null)

  const cancelPending = () => {
    if (pending.current !== null) {
      window.clearTimeout(pending.current)
      pending.current = null
    }
  }

  const close = useCallback((how: 'out' | 'leave' = 'out') => {
    const el = ref.current
    if (!el || closing.current) {
      return
    }
    closing.current = true
    cancelPending()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.setAttribute(how === 'leave' ? 'data-leaving' : 'data-closing', '')
    window.setTimeout(() => {
      el.close()
      onClose()
    }, reduce ? 0 : how === 'leave' ? 260 : 140)
  }, [onClose])

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    // Strict mode runs this twice in dev; showModal on an open dialog throws.
    if (!el.open) {
      el.showModal()
    }
    el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
    router.prefetch('/match')
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
      cancelPending()
    }
  }, [router])

  // Once /match has rendered behind it, the modal grows away into the page.
  useEffect(() => {
    if (pathname !== openedOn.current) {
      close('leave')
    }
  }, [pathname, close])

  const pick = (id: Who) => {
    setWho(id)
    cancelPending()
    // A beat to show the selection, then go to the page with the next steps.
    pending.current = window.setTimeout(() => {
      pending.current = null
      router.push(`/match?as=${id}`)
    }, 160)
  }

  // Number keys pick options. A held key or a second press is ignored.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.repeat || pending.current !== null || e.metaKey || e.ctrlKey || e.altKey) {
        return
      }
      const n = Number(e.key)
      if (Number.isInteger(n) && n >= 1) {
        const btn = ref.current?.querySelector<HTMLButtonElement>(`[data-key="${n}"]`)
        if (btn) {
          e.preventDefault()
          btn.click()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={e => {
        e.preventDefault()
        close()
      }}
      onPointerDown={e => {
        downOnBackdrop.current = e.target === ref.current
      }}
      onClick={e => {
        // A click on the dialog element itself is a click on the backdrop.
        // Both ends must be there, so a text drag out of the panel doesn't close it.
        if (e.target === ref.current && downOnBackdrop.current) {
          close()
        }
      }}
    >
      <div className={styles.bar}>
        <span className={styles.barCmd}><b>❯</b> ./match.sh{who ? ` --as ${who}` : ''}</span>
        <span aria-hidden="true">1/{STEPS}</span>
        <button type="button" className={styles.iconBtn} onClick={() => close()} aria-label="Close">
          esc
        </button>
      </div>
      <div className={styles.progress} aria-hidden="true">
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} data-on={i === 0 && who ? '' : undefined} />
        ))}
      </div>

      <div className={styles.body}>
        <p className={styles.kicker}>find the work that fits · 30 seconds</p>
        <h2 id={titleId} className={styles.question} tabIndex={-1}>Hi, I&apos;m Sam. Who&apos;s asking?</h2>
        <p className={styles.sub}>Four quick taps and I&apos;ll show you the projects that fit what you&apos;re after. No email needed.</p>
        <ul className={styles.options}>
          {WHO.map((w, i) => (
            <li key={w.id}>
              <button
                type="button"
                data-key={i + 1}
                className={styles.option}
                aria-pressed={who === w.id}
                disabled={who !== null && who !== w.id}
                onClick={() => pick(w.id)}
              >
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
      </div>
    </dialog>
  )
}
