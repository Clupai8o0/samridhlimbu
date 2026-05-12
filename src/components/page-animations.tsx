'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Mounted once globally inside <PageShell>. Re-runs on every navigation
 * because the pathname is used as a key on the parent <main>.
 *
 * Behavior:
 *   - [data-stagger] container: children with [data-stagger-item] fade-up in
 *     sequence on mount. If a page doesn't declare a stagger root, the first
 *     direct content wrapper inside <main> is auto-staggered (first 3
 *     children).
 *   - [data-reveal]: fades up as it enters the viewport.
 *   - `.section-label`: auto-revealed. The element immediately following each
 *     section-label is also revealed; if that element has 3+ direct children
 *     (timelines, decision rows, archive rows), its children stagger-reveal
 *     instead so each row fades up sequentially.
 *
 * Honors prefers-reduced-motion.
 */

type Mode = 'single' | 'stagger-kids'

const SINGLE_TRANSITION =
  'opacity 520ms cubic-bezier(0.16, 1, 0.3, 1), transform 520ms cubic-bezier(0.16, 1, 0.3, 1)'
const KID_TRANSITION =
  'opacity 480ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)'

export function PageAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const main = document.querySelector<HTMLElement>('main.t2-main') ?? document.body

    // ----- Stagger entrance ------------------------------------------------
    let items = Array.from(
      main.querySelectorAll<HTMLElement>('[data-stagger] > [data-stagger-item]')
    )
    if (!items.length) {
      items = Array.from(main.querySelectorAll<HTMLElement>('[data-stagger-item]'))
    }
    if (!items.length) {
      const wrapper = main.querySelector<HTMLElement>(':scope > div')
      if (wrapper) {
        items = Array.from(wrapper.children).slice(0, 3) as HTMLElement[]
      }
    }

    items.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      el.style.transition =
        'opacity 540ms cubic-bezier(0.16, 1, 0.3, 1), transform 540ms cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.transitionDelay = `${80 + i * 70}ms`
    })
    const raf = requestAnimationFrame(() => {
      items.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    })

    // ----- Scroll reveal ---------------------------------------------------
    const modeByEl = new Map<HTMLElement, Mode>()

    main.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      modeByEl.set(el, 'single')
    })

    Array.from(main.querySelectorAll<HTMLElement>('.section-label')).forEach((label) => {
      if (!modeByEl.has(label)) modeByEl.set(label, 'single')
      const next = label.nextElementSibling
      if (
        next instanceof HTMLElement &&
        !next.classList.contains('section-label') &&
        !modeByEl.has(next)
      ) {
        const kids = Array.from(next.children).filter(
          (c): c is HTMLElement => c instanceof HTMLElement
        )
        modeByEl.set(next, kids.length >= 3 ? 'stagger-kids' : 'single')
      }
    })

    // Set initial hidden state.
    for (const [el, mode] of modeByEl) {
      if (mode === 'stagger-kids') {
        const kids = Array.from(el.children) as HTMLElement[]
        kids.forEach((k, i) => {
          k.style.opacity = '0'
          k.style.transform = 'translateY(12px)'
          k.style.transition = KID_TRANSITION
          k.style.transitionDelay = `${i * 60}ms`
        })
      } else {
        el.style.opacity = '0'
        el.style.transform = 'translateY(14px)'
        el.style.transition = SINGLE_TRANSITION
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          const mode = modeByEl.get(el) ?? 'single'
          if (mode === 'stagger-kids') {
            const kids = Array.from(el.children) as HTMLElement[]
            kids.forEach((k) => {
              k.style.opacity = '1'
              k.style.transform = 'translateY(0)'
            })
          } else {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
          }
          io.unobserve(el)
        }
      },
      { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    for (const el of modeByEl.keys()) io.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [pathname])

  return null
}
