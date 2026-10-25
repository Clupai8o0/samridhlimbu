'use client'

import { useEffect, useRef } from 'react'
import styles from './home.module.css'

// Half the spotlight window (.spot is 440px square).
const SPOT_R = 220

/**
 * Dot grid behind the hero. On a mouse, an accent spotlight follows the
 * pointer while it is over the grid. Static on touch and reduced motion.
 *
 * Only transforms change per frame: the window moves to the pointer and the
 * dots inside it move back by the same amount, so they stay on the grid.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const spot = spotRef.current
    const dots = dotsRef.current
    if (!el || !spot || !dots) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let x = -1
    let y = -1
    let frame = 0
    const paint = () => {
      frame = 0
      const r = el.getBoundingClientRect()
      const inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
      el.toggleAttribute('data-active', inside)
      if (inside) {
        // Whole pixels keep the dots crisp and exactly on the grid.
        const tx = Math.round(x - r.left - SPOT_R)
        const ty = Math.round(y - r.top - SPOT_R)
        spot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
        dots.style.transform = `translate3d(${-tx}px, ${-ty}px, 0)`
      }
    }
    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(paint)
      }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x = e.clientX
      y = e.clientY
      schedule()
    }
    const onLeave = () => {
      x = -1
      y = -1
      schedule()
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', schedule, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', schedule)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className={styles.backdrop} aria-hidden="true">
      <div ref={spotRef} className={styles.spot}>
        <div ref={dotsRef} className={styles.spotDots} />
      </div>
    </div>
  )
}
