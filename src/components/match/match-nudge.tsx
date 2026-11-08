'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { openChat } from '@/components/chat/chat-dialog'
import { openMatch } from './match-funnel'
import { loadSaved, markNudgeDone, nudgeDoneAt, NUDGE_DONE_EVENT } from './match-store'
import { BUILD_CHECK_URL } from './build-check'
import styles from './nudge.module.css'

// A small card in the bottom-left corner that tells visitors the match
// funnel and the chat exist. It never blocks the page or takes focus, shows
// once per page load after a short wait, and stays away for a month once
// closed, or once the funnel or chat is opened any way (match-store.ts).

const QUIET_MS = 30 * 24 * 3600 * 1000
const DELAY_MS = 5000
const LEAVE_MS = 200
const OVERLAYS = 'dialog[open], [role="dialog"], .t2-cmd-backdrop, .t2-nav-drawer'

const quiet = () => Date.now() - nudgeDoneAt() < QUIET_MS

export function MatchNudge()
{
  const pathname = usePathname()
  const [shown, setShown] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const done = useRef(false)
  const closing = useRef(false)

  useEffect(() => {
    function found()
    {
      done.current = true
      if (!closing.current) {
        setShown(false)
      }
    }
    window.addEventListener(NUDGE_DONE_EVENT, found)
    return () => window.removeEventListener(NUDGE_DONE_EVENT, found)
  }, [])

  const onMatch = pathname === '/match'

  useEffect(() => {
    if (onMatch || done.current || quiet() || loadSaved()) {
      return
    }
    const t = window.setTimeout(() => {
      if (!done.current && !quiet() && !document.querySelector('dialog[open]')) {
        setShown(true)
      }
    }, DELAY_MS)
    return () => window.clearTimeout(t)
  }, [onMatch])

  const close = useCallback((then?: () => void) => {
    if (closing.current) {
      return
    }
    closing.current = true
    done.current = true
    markNudgeDone()
    const finish = () => {
      setShown(false)
      setLeaving(false)
      closing.current = false
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish()
    } else {
      setLeaving(true)
      window.setTimeout(finish, LEAVE_MS)
    }
    then?.()
  }, [])

  // Escape closes it from anywhere, unless an overlay (a dialog, ⌘K, the
  // mobile menu, the contents panel) is open and the key is meant for that.
  useEffect(() => {
    if (!shown) {
      return
    }
    function onKey(e: KeyboardEvent)
    {
      if (e.key === 'Escape' && !e.defaultPrevented && !document.querySelector(OVERLAYS)) {
        close()
      }
    }
    // Capture phase: runs before an overlay's own handler removes it.
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [shown, close])

  if (!shown || onMatch) {
    return null
  }

  return (
    <aside
      className={styles.nudge}
      data-leaving={leaving ? '' : undefined}
      aria-label="Find the projects that fit your role"
    >
      <div className={styles.head}>
        <span className={styles.dot} aria-hidden="true">●</span>
        <span className={styles.kicker}>hiring?</span>
        <button type="button" className={styles.x} onClick={() => close()} aria-label="Close">×</button>
      </div>
      <p className={styles.title}>See which of my projects fit your role.</p>
      <p className={styles.sub}>4 taps, no sign-up.</p>
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={() => close(openMatch)}>
          match my work →
        </button>
        <button type="button" className={styles.ask} onClick={() => close(openChat)}>
          or ask a question
        </button>
      </div>
      <a className={styles.build} href={BUILD_CHECK_URL} target="_blank" rel="noopener" onClick={() => close()}>
        Need something built? <span>clupai.com/start ↗</span>
      </a>
    </aside>
  )
}
