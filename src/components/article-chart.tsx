'use client'

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { ChartBlock } from '@/lib/writing'

// Categorical slots in fixed order. Slot 1 is the site accent. Checked with the
// dataviz validator against --bg-2 (#0a0a0b): all checks pass, worst adjacent CVD ΔE 8.4.
const SERIES = ['#3b82f6', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767']
const SURFACE = '#0a0a0b'
const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const HEIGHT = 260
const PAD = { top: 12, right: 12, bottom: 30, left: 44 }
const BAR_MAX = 24
const BAR_GAP = 2

function niceStep(span: number, count: number) {
  const raw = span / count
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag
}

function niceTicks(lo: number, hi: number, count = 4) {
  if (hi === lo) {
    hi = lo + 1
  }
  const step = niceStep(hi - lo, count)
  const start = Math.floor(lo / step) * step
  const end = Math.ceil(hi / step) * step
  const ticks: number[] = []
  for (let t = start; t <= end + step / 2; t += step) {
    // Snap float drift so zero reads as 0, not -2.78e-17.
    ticks.push(Math.abs(t) < step / 1e6 ? 0 : Number(t.toPrecision(12)))
  }
  return ticks
}

function fmtTick(n: number) {
  const abs = Math.abs(n)
  if (abs >= 1e6) {
    return `${Number((n / 1e6).toPrecision(3))}M`
  }
  if (abs >= 1e3) {
    return `${Number((n / 1e3).toPrecision(3))}K`
  }
  return String(Number(n.toPrecision(3)))
}

function fmtValue(n: number, unit?: string) {
  const s = n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  if (!unit) {
    return s
  }
  return unit === '%' || unit === '×' || unit.startsWith('/') ? `${s}${unit}` : `${s} ${unit}`
}

// The shaded band at one category, as " (lo to hi)", or '' when the series has none.
function fmtRange(s: ChartBlock['series'][number], i: number, unit?: string) {
  if (!s.lo || !s.hi) {
    return ''
  }
  return ` (${fmtValue(s.lo[i], unit)} to ${fmtValue(s.hi[i], unit)})`
}

// A bar with a 4px rounded data end and a square end at the baseline.
function barPath(x: number, w: number, yBase: number, yVal: number) {
  const up = yVal <= yBase
  const top = Math.min(yBase, yVal)
  const bottom = Math.max(yBase, yVal)
  const r = Math.min(4, w / 2, bottom - top)
  if (up) {
    return `M${x},${bottom}V${top + r}Q${x},${top} ${x + r},${top}H${x + w - r}Q${x + w},${top} ${x + w},${top + r}V${bottom}Z`
  }
  return `M${x},${top}V${bottom - r}Q${x},${bottom} ${x + r},${bottom}H${x + w - r}Q${x + w},${bottom} ${x + w},${bottom - r}V${top}Z`
}

export function ArticleChart({ block }: { block: ChartBlock }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  // Unknown until measured, so the first paint never draws at the wrong size.
  const [measured, setWidth] = useState<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [tipW, setTipW] = useState(180)

  // Measure the tooltip so it can be kept inside the chart on narrow screens.
  useLayoutEffect(() => {
    if (tipRef.current) {
      setTipW(tipRef.current.offsetWidth)
    }
  }, [active])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) {
      return
    }
    const ro = new ResizeObserver(([entry]) => setWidth(Math.max(240, Math.round(entry.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { kind, categories, series, unit } = block
  const n = categories.length
  const fits = (a?: number[]) => a === undefined || (a.length === n && a.every(Number.isFinite))
  const valid = n > 0 && series.length > 0 && series.every(s =>
    s.values.length === n && s.values.every(Number.isFinite) && fits(s.lo) && fits(s.hi) && (s.lo === undefined) === (s.hi === undefined))
  if (!valid) {
    return (
      <p style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)' }}>
        [chart “{block.title}” skipped: every series needs one number per category]
      </p>
    )
  }
  const width = measured ?? 640
  // Bands only draw on lines, so only lines widen the axis to fit them.
  const all = series.flatMap(s => (kind === 'line' && s.lo && s.hi ? [...s.values, ...s.lo, ...s.hi] : s.values))
  // Bars always include zero. A line may start its axis higher with yMin.
  const lineMin = kind === 'line' && block.yMin !== undefined
  const lo = lineMin ? Math.min(block.yMin!, ...all) : Math.min(0, ...all)
  const hi = lineMin ? Math.max(...all) : Math.max(0, ...all)
  const ticks = niceTicks(lo, hi)
  const yLo = ticks[0]
  const yHi = ticks[ticks.length - 1]

  // Lines get their end values as direct labels when they don't collide.
  const endLabels = kind === 'line' && series.length <= 4
  const right = endLabels ? 52 : PAD.right
  const plotW = width - PAD.left - right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const band = plotW / n
  const xAt = (i: number) => PAD.left + band * (i + 0.5)
  const yAt = (v: number) => PAD.top + plotH * (1 - (v - yLo) / (yHi - yLo))

  const ends = series.map(s => yAt(s.values[n - 1]))
  const showEnds = endLabels && ends.every((y, i) => ends.every((z, j) => i === j || Math.abs(y - z) >= 14))

  // Thin out x labels that would overlap, counting back from the last one so it keeps its label.
  const labelW = Math.max(...categories.map(c => c.length)) * 6.6 + 8
  const every = Math.max(1, Math.ceil(labelW / band))

  // Drop the gaps when the band is too narrow for them, and never go below 1px.
  const gap = band * 0.72 >= series.length * 3 ? BAR_GAP : 0
  const gaps = (series.length - 1) * gap
  const barW = Math.max(1, Math.min(BAR_MAX, (band * 0.72 - gaps) / series.length))
  const groupW = series.length * barW + gaps

  function pick(e: PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * plotW
    setActive(Math.min(n - 1, Math.max(0, Math.floor(px / band))))
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const step = e.key === 'ArrowRight' ? 1 : -1
      setActive(a => (a === null ? (step > 0 ? 0 : n - 1) : Math.min(n - 1, Math.max(0, a + step))))
    } else if (e.key === 'Escape') {
      setActive(null)
    }
  }

  // Right of the point, else left of it, else pinned inside the chart.
  let tipX = 0
  if (active !== null) {
    const x = xAt(active)
    if (x + 14 + tipW <= width) {
      tipX = x + 14
    } else if (x - 14 - tipW >= 0) {
      tipX = x - 14 - tipW
    } else {
      tipX = Math.max(0, width - tipW)
    }
  }

  return (
    <figure style={{ margin: '28px 0 30px', padding: '18px 18px 14px', background: 'var(--bg-2)', borderRadius: 8 }}>
      <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: 'var(--fg)', lineHeight: 1.45 }}>{block.title}</div>
      {block.subtitle && (
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5, marginTop: 2 }}>{block.subtitle}</div>
      )}

      {series.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12 }}>
          {series.map((s, i) => (
            <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>
              <svg width="14" height="10" aria-hidden="true">
                {kind === 'bar'
                  ? <rect x="2" y="0" width="10" height="10" rx="2" fill={SERIES[i % SERIES.length]} />
                  : <rect x="0" y="4" width="14" height="2" rx="1" fill={SERIES[i % SERIES.length]} />}
              </svg>
              {s.name}
            </span>
          ))}
        </div>
      )}

      <div
        ref={wrapRef}
        tabIndex={0}
        role="application"
        aria-roledescription="chart"
        aria-label={`${block.title}. Use the arrow keys to read each value, or open the data table below.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
        style={{ position: 'relative', marginTop: 10, outlineOffset: 4, borderRadius: 4 }}
      >
        {measured === null ? <div style={{ height: HEIGHT }} /> : <svg viewBox={`0 0 ${width} ${HEIGHT}`} width="100%" height={HEIGHT} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
          {/* Tick labels only: no gridlines or baseline (the site uses no divider lines). */}
          {ticks.map(t => (
            <g key={t}>
              <text x={PAD.left - 8} y={yAt(t)} dy="0.32em" textAnchor="end" style={{ fontFamily: MONO, fontSize: 10.5, fill: 'var(--muted-2)', fontVariantNumeric: 'tabular-nums' }}>
                {fmtTick(t)}
              </text>
            </g>
          ))}

          {categories.map((c, i) => (n - 1 - i) % every === 0 ? (
            <text key={i} x={xAt(i)} y={HEIGHT - PAD.bottom + 18} textAnchor="middle" style={{ fontFamily: MONO, fontSize: 10.5, fill: active === i ? 'var(--fg)' : 'var(--muted-2)' }}>
              {c}
            </text>
          ) : null)}

          {kind === 'line' && active !== null && (
            <line x1={xAt(active)} x2={xAt(active)} y1={PAD.top} y2={PAD.top + plotH} stroke="#3a3a40" strokeWidth={1} shapeRendering="crispEdges" />
          )}

          {kind === 'bar' && categories.map((_, i) => series.map((s, j) => {
            const x = xAt(i) - groupW / 2 + j * (barW + gap)
            return (
              <path
                key={`${i}-${j}`}
                d={barPath(x, barW, yAt(0), yAt(s.values[i]))}
                fill={SERIES[j % SERIES.length]}
                opacity={active === null || active === i ? 1 : 0.4}
                style={{ transition: 'opacity 160ms var(--ease-out)' }}
              />
            )
          }))}

          {kind === 'line' && series.map((s, j) => {
            if (!s.lo || !s.hi) {
              return null
            }
            const lo = s.lo
            const up = s.hi.map((v, i) => `${i ? 'L' : 'M'}${xAt(i)},${yAt(v)}`).join('')
            const down = lo.map((_, k) => n - 1 - k).map(i => `L${xAt(i)},${yAt(lo[i])}`).join('')
            return <path key={`band-${s.name}`} d={`${up}${down}Z`} fill={SERIES[j % SERIES.length]} opacity={0.16} />
          })}

          {kind === 'line' && series.map((s, j) => {
            const color = SERIES[j % SERIES.length]
            const d = s.values.map((v, i) => `${i ? 'L' : 'M'}${xAt(i)},${yAt(v)}`).join('')
            return (
              <g key={s.name}>
                <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                {s.values.map((v, i) => (n <= 12 || active === i) && (
                  <circle key={i} cx={xAt(i)} cy={yAt(v)} r={active === i ? 5 : 4} fill={color} stroke={SURFACE} strokeWidth={2} />
                ))}
                {showEnds && (
                  <text x={xAt(n - 1) + 10} y={ends[j]} dy="0.32em" style={{ fontFamily: MONO, fontSize: 10.5, fill: 'var(--fg-dim)' }}>
                    {s.values[n - 1].toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </text>
                )}
              </g>
            )
          })}

          <rect
            x={PAD.left}
            y={PAD.top}
            width={plotW}
            height={plotH}
            fill="transparent"
            onPointerMove={pick}
            onPointerDown={pick}
            onPointerLeave={e => {
              // A lifted finger also fires pointerleave; keep a tapped value on screen.
              if (e.pointerType === 'mouse') {
                setActive(null)
              }
            }}
          />
        </svg>}

        <span role="status" className="sr-only">
          {active === null ? '' : `${categories[active]}: ${series.map(s => `${s.name} ${fmtValue(s.values[active], unit)}${fmtRange(s, active, unit)}`).join(', ')}`}
        </span>

        {active !== null && (
          <div
            ref={tipRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: PAD.top,
              left: tipX,
              pointerEvents: 'none',
              background: 'var(--bg-3)',
              borderRadius: 6,
              padding: '8px 10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: 'var(--muted-2)', marginBottom: 4 }}>
              {block.xLabel ? `${block.xLabel} ` : ''}{categories[active]}
            </div>
            {series.map((s, j) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.6 }}>
                <span aria-hidden="true" style={{ width: 10, height: 2, borderRadius: 1, background: SERIES[j % SERIES.length] }} />
                <strong style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtValue(s.values[active], unit)}
                </strong>
                {s.lo && s.hi && <span style={{ fontFamily: SANS, fontSize: 12, color: 'var(--muted-2)', fontVariantNumeric: 'tabular-nums' }}>{fmtRange(s, active, unit).trim()}</span>}
                {series.length > 1 && <span style={{ fontFamily: SANS, fontSize: 12, color: 'var(--muted)' }}>{s.name}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <details style={{ marginTop: 10 }}>
        <summary style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', cursor: 'pointer', width: 'fit-content' }}>
          view data
        </summary>
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: SANS, fontSize: 12.5, color: 'var(--fg-dim)' }}>
            <thead>
              <tr>
                {[block.xLabel ?? 'category', ...series.map(s => s.name)].map((h, i) => (
                  <th key={i} style={{ textAlign: i ? 'right' : 'left', padding: '6px 10px', fontFamily: MONO, fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'var(--bg-3)' : undefined }}>
                  <th scope="row" style={{ padding: '6px 10px', textAlign: 'left', fontWeight: 400 }}>{c}</th>
                  {series.map(s => (
                    <td key={s.name} style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      {fmtValue(s.values[i], unit)}
                      {s.lo && s.hi && (
                        <span style={{ color: 'var(--muted-2)' }}>{fmtRange(s, i, unit)}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {block.caption && (
        <figcaption style={{ fontFamily: MONO, fontSize: 'var(--text-xs)', color: 'var(--muted-2)', marginTop: 10, letterSpacing: '0.02em', lineHeight: 1.5 }}>
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}
