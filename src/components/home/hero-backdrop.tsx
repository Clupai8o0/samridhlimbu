'use client'

import { useEffect, useRef } from 'react'
import styles from './home.module.css'

// Grid pitch; matches the dot grid's background-size in .backdrop.
const GAP = 24
// Dots within REACH of the pointer light up and swell; a soft accent glow of
// radius GLOW sits under it. FOLLOW_MS is how far the light trails the pointer.
const REACH = 170
const GLOW = 320
const FOLLOW_MS = 70
// A ring of light that runs out across the grid: once from the name as the
// page opens, and from wherever empty hero space is tapped or clicked.
const RIPPLE_MS = 1500
const RIPPLE_W = 90
const OPEN_DELAY = 400
const MAX_RIPPLES = 3

// A ring from `from` keeps its origin on that element's centre.
type Ripple = { x: number; y: number; at: number; from?: Element }

/**
 * Dot grid behind the hero. A canvas over the static CSS grid lights the
 * dots in play: on a mouse or pen, the dots near the pointer light up and
 * swell under a soft glow that trails it; on every device a ring of light
 * runs out from the name as the page opens, and from any tap or click on
 * empty hero space. Static under reduced motion.
 *
 * Only the dots in play are drawn, and the loop stops once nothing moves.
 */
export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = ref.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!el || !canvas || !ctx) return

    // Runs the field and returns a function that stops it and clears it.
    const start = (opening: boolean) => {
      let w = 0
      let h = 0
      let dpr = 1
      let pointer: { x: number; y: number } | null = null
      let cx = 0
      let cy = 0
      let strength = 0
      let ripples: Ripple[] = []
      let drawn = false
      let last = 0
      let raf = 0

      const schedule = () => {
        if (!raf) {
          raf = requestAnimationFrame(frame)
        }
      }

      // How far a ring from (x, y) must travel to cross the whole grid.
      const farthest = (x: number, y: number) =>
        Math.hypot(Math.max(x, w - x), Math.max(y, h - y))

      const draw = (now: number) => {
        if (drawn) {
          ctx.clearRect(0, 0, w, h)
          drawn = false
        }
        const rings = ripples
          .map(rp => ({ ...rp, t: (now - rp.at) / RIPPLE_MS, reach: farthest(rp.x, rp.y) }))
          .filter(rp => rp.t >= 0 && rp.t < 1)
        if (!strength && !rings.length) return
        drawn = true

        if (strength) {
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, GLOW)
          g.addColorStop(0, `rgba(59, 130, 246, ${0.14 * strength})`)
          g.addColorStop(1, 'rgba(59, 130, 246, 0)')
          ctx.fillStyle = g
          ctx.fillRect(cx - GLOW, cy - GLOW, GLOW * 2, GLOW * 2)
        }

        // A ring sweeps the whole grid; the pointer alone only needs its patch.
        let x0 = 0
        let x1 = w
        let y0 = 0
        let y1 = h
        if (!rings.length) {
          x0 = cx - REACH
          x1 = cx + REACH
          y0 = cy - REACH
          y1 = cy + REACH
        }
        const i0 = Math.max(0, Math.floor(x0 / GAP))
        const i1 = Math.min(Math.floor(w / GAP), Math.ceil(x1 / GAP))
        const j0 = Math.max(0, Math.floor(y0 / GAP))
        const j1 = Math.min(Math.floor(h / GAP), Math.ceil(y1 / GAP))

        ctx.fillStyle = 'rgb(96, 165, 250)'
        for (let j = j0; j <= j1; j++) {
          const y = GAP / 2 + j * GAP
          for (let i = i0; i <= i1; i++) {
            const x = GAP / 2 + i * GAP
            let k = 0
            if (strength) {
              const d = Math.hypot(x - cx, y - cy)
              if (d < REACH) {
                const f = 1 - d / REACH
                k = f * f * (3 - 2 * f) * strength
              }
            }
            for (const rp of rings) {
              // Ease-out: the ring leaves fast and slows as it fades.
              const front = (1 - Math.pow(1 - rp.t, 3)) * rp.reach
              const off = Math.abs(Math.hypot(x - rp.x, y - rp.y) - front)
              if (off < RIPPLE_W) {
                const f = 1 - off / RIPPLE_W
                k = Math.max(k, f * f * Math.pow(1 - rp.t, 0.6))
              }
            }
            if (k < 0.03) continue
            ctx.globalAlpha = Math.min(1, 0.2 + 0.8 * k)
            ctx.beginPath()
            ctx.arc(x, y, 1 + 1.6 * k, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      }

      const fit = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        w = el.clientWidth
        h = el.clientHeight
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        drawn = false
      }

      const frame = (now: number) => {
        raf = 0
        // Moving to a screen with another pixel ratio keeps the CSS size, so
        // the resize observer never fires; catch it here.
        if (Math.min(window.devicePixelRatio || 1, 2) !== dpr) {
          fit()
        }
        const dt = Math.min(64, last ? now - last : 16)
        last = now
        const r = el.getBoundingClientRect()
        let tx = cx
        let ty = cy
        let inside = false
        if (pointer) {
          tx = pointer.x - r.left
          ty = pointer.y - r.top
          inside = tx >= 0 && tx <= r.width && ty >= 0 && ty <= r.height
        }
        if (inside) {
          // Appear under the pointer rather than flying in from where it left.
          if (strength < 0.02) {
            cx = tx
            cy = ty
          }
          const follow = 1 - Math.exp(-dt / FOLLOW_MS)
          cx += (tx - cx) * follow
          cy += (ty - cy) * follow
        }
        const goal = inside ? 1 : 0
        strength += (goal - strength) * (1 - Math.exp(-dt / (inside ? 90 : 240)))
        if (Math.abs(goal - strength) < 0.01) {
          strength = goal
        }
        ripples = ripples.filter(rp => now - rp.at < RIPPLE_MS)
        // A ring from an element follows it through the entrance and resizes.
        for (const rp of ripples) {
          if (rp.from) {
            const b = rp.from.getBoundingClientRect()
            rp.x = b.left + b.width / 2 - r.left
            rp.y = b.top + b.height / 2 - r.top
          }
        }

        draw(now)

        const trailing = inside && Math.hypot(tx - cx, ty - cy) > 0.3
        if (trailing || strength !== goal || ripples.length) {
          raf = requestAnimationFrame(frame)
        } else {
          last = 0
        }
      }

      const resize = () => {
        fit()
        schedule()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(el)

      const ripple = (rp: Omit<Ripple, 'at'>, delay = 0) => {
        ripples = [...ripples, { ...rp, at: performance.now() + delay }].slice(-MAX_RIPPLES)
        schedule()
      }

      // The opening ring starts from the name's text, not the h1's full width.
      const name = el.parentElement?.querySelector('h1 > span')
      if (opening && name) {
        ripple({ x: 0, y: 0, from: name }, OPEN_DELAY)
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        pointer = { x: e.clientX, y: e.clientY }
        schedule()
      }
      const onLeave = () => {
        pointer = null
        schedule()
      }
      const onClick = (e: MouseEvent) => {
        const target = e.target instanceof Element ? e.target : null
        // Controls keep their own click; <main tabindex="-1"> is not one.
        const control = 'a, button, input, textarea, select, label, summary, [role="button"], [tabindex]:not([tabindex="-1"])'
        if (target?.closest(control)) return
        if (window.getSelection()?.isCollapsed === false) return
        const r = el.getBoundingClientRect()
        const x = e.clientX - r.left
        const y = e.clientY - r.top
        if (x < 0 || x > r.width || y < 0 || y > r.height) return
        ripple({ x, y })
      }

      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('blur', onLeave)
      window.addEventListener('click', onClick)
      document.documentElement.addEventListener('mouseleave', onLeave)
      return () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('scroll', schedule)
        window.removeEventListener('blur', onLeave)
        window.removeEventListener('click', onClick)
        document.documentElement.removeEventListener('mouseleave', onLeave)
        ro.disconnect()
        cancelAnimationFrame(raf)
        ctx.clearRect(0, 0, w, h)
      }
    }

    // Follow the reduced-motion setting live. The opening ring plays only once.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let stop = mq.matches ? null : start(true)
    const onChange = () => {
      stop?.()
      stop = mq.matches ? null : start(false)
    }
    mq.addEventListener('change', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      stop?.()
    }
  }, [])

  return (
    <div ref={ref} className={styles.backdrop} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.field} />
    </div>
  )
}
