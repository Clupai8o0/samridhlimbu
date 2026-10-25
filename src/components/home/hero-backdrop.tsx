'use client'

import { useEffect, useRef } from 'react'
import styles from './home.module.css'

/**
 * Dot grid behind the hero. On a mouse, an accent spotlight follows the
 * pointer while it is over the grid. Static on touch and reduced motion.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
        el.style.setProperty('--mx', `${(x - r.left).toFixed(1)}px`)
        el.style.setProperty('--my', `${(y - r.top).toFixed(1)}px`)
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

  return <div ref={ref} className={styles.backdrop} aria-hidden="true" />
}
