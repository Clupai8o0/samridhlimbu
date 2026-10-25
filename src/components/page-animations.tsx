'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Mounted once globally inside <PageShell>. Re-runs on every navigation
 * because the pathname is used as a key on the parent <main>.
 *
 * Behavior:
 *   - [data-stagger] container: children with [data-stagger-item] fade up
 *     out of a light blur in sequence on mount (items holding an image skip
 *     the blur). If a page doesn't declare a stagger root, the first direct
 *     content wrapper inside <main> is auto-staggered (first 3 children).
 *     Anything below waits for the entrance to land, and anything inside an
 *     entrance item waits for that item.
 *   - [data-reveal]: fades up as it enters the viewport.
 *     [data-reveal="wipe"] skips the fade; CSS wipes its frame open instead.
 *   - [data-reveal-kids]: each child fades up as it enters the viewport;
 *     children that enter together stagger. A child that is itself
 *     [data-reveal-kids] is not faded; its own children are.
 *     [data-reveal-delay="ms"] on the parent adds a base delay.
 *   - `.section-label`: auto-revealed. The element immediately following each
 *     section-label is also revealed; if that element has 3+ direct children
 *     (timelines, decision rows, archive rows), its children reveal like
 *     [data-reveal-kids]. A child with [data-timeline-line] draws downwards
 *     when the first row arrives (a clipped element never intersects, so the
 *     rail itself is not observed).
 *   - `.section-label` and [data-scramble]: a single text node decodes from
 *     random glyphs, left to right, as it comes into view.
 *   - [data-count]: the first number in a single text node counts up from 0
 *     (or from [data-count-from]) when it comes into view, after
 *     [data-count-delay] ms (default 200). Years, versions, ranges, durations
 *     and labels like "macOS 14" are left alone.
 *   - [data-spotlight] / [data-tilt]: on a mouse, the element under the
 *     pointer gets [data-hot] and --sx/--sy (and --rx/--ry for tilt), set on
 *     the element itself. Scrolling drops them, since the pointer no longer
 *     matches.
 *
 * Hidden elements carry [data-reveal-pending] and switch to [data-revealed]
 * with --reveal-delay set, so CSS can time effects on their descendants.
 * Keyboard focus inside a hidden element reveals it at once. Scramble and
 * count-up never change the text itself (see below), and printing stops
 * them.
 * The root gets `motion-ok`; every CSS motion hook is scoped under it, so
 * nothing is hidden without JS. Honors prefers-reduced-motion.
 */

type Mode = 'single' | 'kid' | 'wipe'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const ENTER_MS = 600
const SINGLE_MS = 560
const KID_MS = 520
const KID_GAP = 70
const KID_MAX_STEPS = 8

const SCRAMBLE_MS = 520
const SCRAMBLE_TICK = 45
const COUNT_MS = 1200
const TILT_MAX = 2
// A child of an entrance item starts this long after its item does.
const HOST_LEAD = 100

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGITS = '0123456789'
const SYMBOLS = '#%&*+=<>/_$'

const COUNT_RE = /(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)/

interface Count {
  prefix: string
  suffix: string
  from: number
  to: number
  decimals: number
  grouped: boolean
  delay: number
}

function onlyText(el: Element): Text | null {
  const node = el.firstChild
  if (!node || node !== el.lastChild || node.nodeType !== Node.TEXT_NODE) return null
  return (node as Text).data.trim() ? (node as Text) : null
}

function randomLike(c: string) {
  const pool = UPPER.includes(c) ? UPPER : LOWER.includes(c) ? LOWER : DIGITS.includes(c) ? DIGITS : SYMBOLS
  return pool[Math.floor(Math.random() * pool.length)]
}

function parseCount(el: HTMLElement): Count | null {
  const node = onlyText(el)
  if (!node) return null
  const text = node.data
  const m = COUNT_RE.exec(text)
  if (!m) return null
  const raw = m[0]
  const prefix = text.slice(0, m.index)
  const suffix = text.slice(m.index + raw.length)
  const to = Number(raw.replace(/,/g, ''))
  const explicit = el.dataset.countFrom
  if (!explicit) {
    if (/[→–]/.test(text)) return null
    if (/[a-z]/.test(prefix)) return null
    if (/^\.?\d/.test(suffix)) return null
    if (/^\s*(ms|s|secs?|mins?|h|hrs?|hours?|d|days?|wks?|weeks?|mo|months?|yrs?|years?)\b/i.test(suffix)) return null
    if (/^\d{4}$/.test(raw) && to >= 1900 && to <= 2099) return null
    if (to < 2) return null
  }
  const from = explicit ? Number(explicit) : 0
  if (!Number.isFinite(to) || !Number.isFinite(from)) return null
  return {
    prefix,
    suffix,
    from,
    to,
    decimals: raw.includes('.') ? raw.split('.')[1].length : 0,
    grouped: raw.includes(','),
    delay: Number(el.dataset.countDelay) || 200,
  }
}

function formatCount(c: Count, n: number) {
  const num = n.toLocaleString('en-US', {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
    useGrouping: c.grouped,
  })
  return c.prefix + num + c.suffix
}

export function PageAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    document.documentElement.classList.add('motion-ok')
    const main = document.querySelector<HTMLElement>('main.t2-main') ?? document.body
    const timers: number[] = []
    const frames = new Set<number>()

    const hide = (el: HTMLElement, transform: string, blur = false) => {
      el.dataset.revealPending = ''
      el.style.transition = 'none'
      el.style.opacity = '0'
      el.style.transform = transform
      if (blur) {
        el.style.filter = 'blur(4px)'
      }
    }

    const show = (el: HTMLElement, delay: number, ms?: number) => {
      el.style.setProperty('--reveal-delay', `${delay}ms`)
      delete el.dataset.revealPending
      el.dataset.revealed = ''
      if (ms == null) return
      const props = el.style.filter ? ['opacity', 'transform', 'filter'] : ['opacity', 'transform']
      el.style.transition = props.map(p => `${p} ${ms}ms ${EASE} ${delay}ms`).join(', ')
      el.style.opacity = '1'
      el.style.transform = 'none'
      if (el.style.filter) {
        el.style.filter = 'blur(0px)'
      }
      // Hand the element back to the stylesheet once it has landed, so no
      // leftover transform or filter traps fixed children or hover styles.
      timers.push(window.setTimeout(() => {
        for (const p of ['transition', 'opacity', 'transform', 'filter']) el.style.removeProperty(p)
      }, delay + ms + 80))
    }

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
    const entrance = new Set(items)
    const entranceAt = new Map<HTMLElement, number>()
    const mountedAt = performance.now()

    // Blurring a photo or screenshot is costly and smears it; those items
    // only fade and rise.
    items.forEach(el => hide(el, 'translateY(12px)', !el.querySelector('img, video')))
    // Commit the hidden state before transitioning out of it.
    void main.offsetHeight
    items.forEach((el, i) => {
      entranceAt.set(el, 80 + i * KID_GAP)
      show(el, 80 + i * KID_GAP, ENTER_MS)
    })
    // Most of the way landed: the curve is ease-out, so half its time is ~90%.
    const entranceEnd = 80 + items.length * KID_GAP + ENTER_MS / 2

    // How long an effect should still wait so it never runs ahead of the
    // entrance: inside an item, until that item starts; elsewhere, until the
    // entrance has landed. Zero once the page has settled.
    const hold = (el: Element) => {
      const host = items.find(item => item !== el && item.contains(el))
      const at = host ? (entranceAt.get(host) ?? 0) + HOST_LEAD : entranceEnd
      return Math.max(0, Math.round(at - (performance.now() - mountedAt)))
    }

    // ----- Scroll reveal ---------------------------------------------------
    const modeByEl = new Map<HTMLElement, Mode>()
    const kidParents = new Set<HTMLElement>()
    const kidBase = new Map<HTMLElement, number>()
    const rails = new Map<Element, HTMLElement>()

    const claim = (el: HTMLElement, mode: Mode) => {
      if (!entrance.has(el) && !modeByEl.has(el)) {
        modeByEl.set(el, mode)
      }
    }
    const claimKids = (parent: HTMLElement) => {
      kidParents.add(parent)
      const base = Number(parent.dataset.revealDelay) || 0
      for (const k of Array.from(parent.children)) {
        if (!(k instanceof HTMLElement)) continue
        // A nested list reveals row by row; fading it as well would double up.
        if (k.hasAttribute('data-reveal-kids')) continue
        if (k.hasAttribute('data-timeline-line')) {
          k.dataset.revealPending = ''
          rails.set(parent, k)
          continue
        }
        claim(k, 'kid')
        kidBase.set(k, base)
      }
    }

    main.querySelectorAll<HTMLElement>('[data-reveal]').forEach(el => {
      claim(el, el.dataset.reveal === 'wipe' ? 'wipe' : 'single')
    })
    main.querySelectorAll<HTMLElement>('[data-reveal-kids]').forEach(claimKids)

    Array.from(main.querySelectorAll<HTMLElement>('.section-label')).forEach(label => {
      claim(label, 'single')
      const next = label.nextElementSibling
      if (
        next instanceof HTMLElement &&
        !next.classList.contains('section-label') &&
        !modeByEl.has(next) &&
        !kidParents.has(next) &&
        !entrance.has(next)
      ) {
        if (next.children.length >= 3) {
          claimKids(next)
        } else {
          claim(next, 'single')
        }
      }
    })

    for (const [el, mode] of modeByEl) {
      if (mode === 'wipe') {
        el.dataset.revealPending = ''
      } else {
        hide(el, mode === 'kid' ? 'translateY(14px) scale(0.98)' : 'translateY(16px)')
      }
    }

    const reveal = (el: HTMLElement, after: number) => {
      const delay = after + hold(el)
      // A rail draws with the first row of its timeline.
      const parent = el.parentElement
      const rail = parent ? rails.get(parent) : undefined
      if (parent && rail) {
        rails.delete(parent)
        show(rail, delay)
      }
      const mode = modeByEl.get(el) ?? 'single'
      show(el, delay, mode === 'wipe' ? undefined : mode === 'kid' ? KID_MS : SINGLE_MS)
    }

    const io = new IntersectionObserver(
      entries => {
        const hits = entries
          .filter(e => e.isIntersecting)
          .map(e => e.target as HTMLElement)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        // Kids that arrive together stagger, counted per parent.
        const steps = new Map<Element | null, number>()
        for (const el of hits) {
          io.unobserve(el)
          let delay = 0
          if (kidBase.has(el)) {
            const step = steps.get(el.parentElement) ?? 0
            steps.set(el.parentElement, step + 1)
            delay = (kidBase.get(el) ?? 0) + Math.min(step, KID_MAX_STEPS) * KID_GAP
          }
          reveal(el, delay)
        }
      },
      { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    for (const el of modeByEl.keys()) io.observe(el)

    // Tabbing can land on a link before its row is far enough in view to
    // reveal. Show the row, and any hidden ancestor, straight away.
    const onFocus = (e: FocusEvent) => {
      let el = e.target instanceof HTMLElement ? e.target : null
      for (; el && el !== main; el = el.parentElement) {
        if (modeByEl.has(el) && el.hasAttribute('data-reveal-pending')) {
          io.unobserve(el)
          reveal(el, 0)
        }
      }
    }
    main.addEventListener('focusin', onFocus)

    // ----- Scramble and count-up --------------------------------------------
    // Neither touches the text node. The moving glyphs go in a data attribute
    // ([data-scrambling] / [data-counting]) and CSS draws them over the real
    // text as generated content with empty alt text, so screen readers,
    // find-in-page and print only ever meet the real words. Browsers without
    // that alt text, or forcing their own colours, skip both effects.
    const overlay =
      !!CSS.supports?.('content', '"x" / ""') &&
      !window.matchMedia?.('(forced-colors: active)').matches
    const live = new Set<HTMLElement>()
    let settled = false
    const clear = (el: HTMLElement) => {
      delete el.dataset.scrambling
      delete el.dataset.counting
      live.delete(el)
    }

    const scramble = (el: HTMLElement, text: string) => {
      if (settled) return
      live.add(el)
      const start = performance.now()
      let lastTick = -1
      const tick = (now: number) => {
        frames.delete(frame)
        if (!live.has(el)) return
        const t = now - start
        if (t >= SCRAMBLE_MS) {
          clear(el)
          return
        }
        const tickNo = Math.floor(t / SCRAMBLE_TICK)
        if (tickNo !== lastTick) {
          lastTick = tickNo
          const fixed = Math.floor((t / SCRAMBLE_MS) * text.length)
          let out = text.slice(0, fixed)
          for (let i = fixed; i < text.length; i++) {
            out += /\s/.test(text[i]) ? text[i] : randomLike(text[i])
          }
          el.dataset.scrambling = out
        }
        frame = requestAnimationFrame(tick)
        frames.add(frame)
      }
      let frame = requestAnimationFrame(tick)
      frames.add(frame)
    }

    const scrambleIo = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          scrambleIo.unobserve(entry.target)
          const el = entry.target as HTMLElement
          const node = onlyText(el)
          if (node) {
            const text = node.data
            timers.push(window.setTimeout(() => scramble(el, text), 120 + hold(el)))
          }
        }
      },
      { threshold: 0.6, rootMargin: '0px 0px -8% 0px' }
    )
    if (overlay) {
      main.querySelectorAll<HTMLElement>('.section-label, [data-scramble]').forEach(el => {
        // Only monospace text keeps its width while the glyphs churn.
        if (onlyText(el) && /mono/i.test(getComputedStyle(el).fontFamily)) {
          scrambleIo.observe(el)
        }
      })
    }

    const counts = new Map<Element, Count>()
    if (overlay) {
      main.querySelectorAll<HTMLElement>('[data-count]').forEach(el => {
        // A hidden element may never intersect, so it would sit at zero.
        if (!el.getClientRects().length) return
        const c = parseCount(el)
        if (!c) return
        counts.set(el, c)
        live.add(el)
        el.dataset.counting = formatCount(c, c.from)
      })
    }

    const runCount = (el: HTMLElement, c: Count) => {
      const start = performance.now()
      const tick = (now: number) => {
        frames.delete(frame)
        if (!live.has(el)) return
        const p = Math.min(1, (now - start) / COUNT_MS)
        if (p >= 1) {
          clear(el)
          return
        }
        const eased = 1 - Math.pow(2, -10 * p)
        const n = c.from + (c.to - c.from) * eased
        const step = Math.pow(10, -c.decimals)
        el.dataset.counting = formatCount(c, Math.round(n / step) * step)
        frame = requestAnimationFrame(tick)
        frames.add(frame)
      }
      let frame = requestAnimationFrame(tick)
      frames.add(frame)
    }

    const countIo = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          countIo.unobserve(entry.target)
          const el = entry.target as HTMLElement
          const c = counts.get(el)
          if (c) {
            timers.push(window.setTimeout(() => runCount(el, c), c.delay + hold(el)))
          }
        }
      },
      { threshold: 0.6 }
    )
    for (const el of counts.keys()) countIo.observe(el)

    // Drop every overlay: a page printed before it was scrolled must show
    // real numbers, not zeros.
    const settle = () => {
      settled = true
      countIo.disconnect()
      scrambleIo.disconnect()
      live.forEach(clear)
    }
    window.addEventListener('beforeprint', settle)

    // ----- Pointer spotlight and tilt --------------------------------------
    let hot: HTMLElement | null = null
    let lastMove: PointerEvent | null = null
    let pointerFrame = 0
    const fine = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches

    const cool = () => {
      if (!hot) return
      delete hot.dataset.hot
      for (const p of ['--sx', '--sy', '--rx', '--ry']) hot.style.removeProperty(p)
      hot = null
    }
    const track = () => {
      pointerFrame = 0
      const e = lastMove
      if (!e) return
      const target = e.target instanceof Element
        ? e.target.closest<HTMLElement>('[data-spotlight], [data-tilt]')
        : null
      if (hot !== target) {
        cool()
      }
      if (!target || !main.contains(target)) return
      hot = target
      target.dataset.hot = ''
      const r = target.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      target.style.setProperty('--sx', `${x.toFixed(1)}px`)
      target.style.setProperty('--sy', `${y.toFixed(1)}px`)
      if (target.hasAttribute('data-tilt')) {
        target.style.setProperty('--ry', `${((x / r.width - 0.5) * 2 * TILT_MAX).toFixed(2)}deg`)
        target.style.setProperty('--rx', `${((0.5 - y / r.height) * 2 * TILT_MAX).toFixed(2)}deg`)
      }
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      lastMove = e
      if (!pointerFrame) {
        pointerFrame = requestAnimationFrame(track)
      }
    }
    if (fine) {
      document.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', cool)
      // A wheel scroll moves the page under a still pointer; settle until
      // the next move.
      window.addEventListener('scroll', cool, { passive: true })
    }

    return () => {
      timers.forEach(t => window.clearTimeout(t))
      frames.forEach(f => cancelAnimationFrame(f))
      cancelAnimationFrame(pointerFrame)
      io.disconnect()
      main.removeEventListener('focusin', onFocus)
      window.removeEventListener('beforeprint', settle)
      document.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', cool)
      window.removeEventListener('scroll', cool)
      cool()
      settle()
    }
  }, [pathname])

  return null
}
