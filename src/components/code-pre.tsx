import type { CSSProperties } from 'react'
import { highlight, HL_COLORS } from '@/lib/highlight'

// A <pre> coloured with the site's highlighter. The default, 'log', suits
// captured terminal and serial output: numbers, keys, paths, quoted strings,
// status words and timestamps. Pass 'json', 'bash', 'python' etc. for code.
export function CodePre({ code, lang = 'log', style }: { code: string; lang?: string; style?: CSSProperties }) {
  return (
    <pre style={style}>
      {highlight(code, lang).map((t, i) => (t.cls ? <span key={i} style={{ color: HL_COLORS[t.cls] }}>{t.text}</span> : t.text))}
    </pre>
  )
}
