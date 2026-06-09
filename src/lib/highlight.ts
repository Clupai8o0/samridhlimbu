export type HToken = { text: string; cls?: 'cmt' | 'str' | 'kw' | 'num' | 'fn' | 'prompt' | 'cmd' | 'tag' | 'attr' }

const PY_KEYWORDS = [
  'from', 'import', 'as', 'def', 'class', 'return', 'if', 'else', 'elif',
  'for', 'while', 'in', 'not', 'is', 'and', 'or', 'with', 'try', 'except',
  'finally', 'raise', 'pass', 'break', 'continue', 'yield', 'lambda',
  'global', 'nonlocal', 'True', 'False', 'None', 'self', 'async', 'await',
].join('|')

const PY_RE = new RegExp(
  [
    '(#[^\\n]*)',
    '([rRfFbBuU]{0,2}"(?:\\\\.|[^"\\\\])*")',
    "([rRfFbBuU]{0,2}'(?:\\\\.|[^'\\\\])*')",
    `(\\b(?:${PY_KEYWORDS})\\b)`,
    '(\\b\\d+(?:\\.\\d+)?\\b)',
    '([a-zA-Z_][a-zA-Z0-9_]*)(?=\\s*\\()',
  ].join('|'),
  'g'
)

export function highlightPython(code: string): HToken[] {
  const tokens: HToken[] = []
  let last = 0
  let m: RegExpExecArray | null
  PY_RE.lastIndex = 0
  while ((m = PY_RE.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index) })
    if (m[1] !== undefined) tokens.push({ text: m[1], cls: 'cmt' })
    else if (m[2] !== undefined) tokens.push({ text: m[2], cls: 'str' })
    else if (m[3] !== undefined) tokens.push({ text: m[3], cls: 'str' })
    else if (m[4] !== undefined) tokens.push({ text: m[4], cls: 'kw' })
    else if (m[5] !== undefined) tokens.push({ text: m[5], cls: 'num' })
    else if (m[6] !== undefined) tokens.push({ text: m[6], cls: 'fn' })
    last = PY_RE.lastIndex
  }
  if (last < code.length) tokens.push({ text: code.slice(last) })
  return tokens
}

export function highlightBash(code: string): HToken[] {
  const tokens: HToken[] = []
  const lines = code.split('\n')
  lines.forEach((line, idx) => {
    if (idx > 0) tokens.push({ text: '\n' })
    if (!line.length) return
    // full-line comment
    if (/^\s*#/.test(line)) { tokens.push({ text: line, cls: 'cmt' }); return }
    // line with explicit $ prompt
    const dollar = /^(\s*)(\$)(\s+)(\S+)(.*)$/.exec(line)
    if (dollar) {
      if (dollar[1]) tokens.push({ text: dollar[1] })
      tokens.push({ text: dollar[2], cls: 'prompt' })
      tokens.push({ text: dollar[3] })
      tokens.push({ text: dollar[4], cls: 'cmd' })
      if (dollar[5]) _bashRest(dollar[5], tokens)
      return
    }
    // plain command line — highlight first word as cmd, rest token by token
    const plain = /^(\s*)(\S+)(.*)$/.exec(line)
    if (plain) {
      if (plain[1]) tokens.push({ text: plain[1] })
      tokens.push({ text: plain[2], cls: 'cmd' })
      if (plain[3]) _bashRest(plain[3], tokens)
    }
  })
  return tokens
}

function _bashRest(rest: string, tokens: HToken[]): void {
  // tokenise flags, quoted strings, inline comments, plain text
  const re = /(#[^\n]*)|(["'`])(?:\\.|(?!\2)[^\\])*\2|(\s-{1,2}[\w-]+)/g
  let last = 0; let m: RegExpExecArray | null
  re.lastIndex = 0
  while ((m = re.exec(rest)) !== null) {
    if (m.index > last) tokens.push({ text: rest.slice(last, m.index) })
    if (m[1]) tokens.push({ text: m[1], cls: 'cmt' })
    else if (m[2]) tokens.push({ text: m[0], cls: 'str' })
    else if (m[3]) tokens.push({ text: m[0], cls: 'attr' })
    last = re.lastIndex
  }
  if (last < rest.length) tokens.push({ text: rest.slice(last) })
}

const JS_KEYWORDS = [
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
  'import', 'export', 'default', 'from', 'as', 'new', 'class', 'this', 'extends',
  'super', 'typeof', 'instanceof', 'in', 'of', 'async', 'await', 'true', 'false',
  'null', 'undefined', 'break', 'continue', 'switch', 'case', 'try', 'catch',
  'finally', 'throw', 'yield', 'void', 'delete',
].join('|')

const JS_RE = new RegExp(
  [
    '(//[^\\n]*|/\\*[\\s\\S]*?\\*/)',                  // 1 comment
    '(`(?:\\\\.|\\$\\{[^}]*\\}|[^`\\\\])*`)',          // 2 template literal
    '("(?:\\\\.|[^"\\\\\\n])*")',                       // 3 dquote
    "('(?:\\\\.|[^'\\\\\\n])*')",                      // 4 squote
    `(\\b(?:${JS_KEYWORDS})\\b)`,                       // 5 keyword
    '(\\b\\d+(?:\\.\\d+)?\\b)',                         // 6 number
    '(</?[A-Za-z][A-Za-z0-9.-]*|/?>)',                  // 7 jsx tag fragment
    '([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\\s*\\()',           // 8 fn call
  ].join('|'),
  'g'
)

export function highlightJs(code: string): HToken[] {
  const tokens: HToken[] = []
  let last = 0
  let m: RegExpExecArray | null
  JS_RE.lastIndex = 0
  while ((m = JS_RE.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index) })
    if (m[1] !== undefined) tokens.push({ text: m[1], cls: 'cmt' })
    else if (m[2] !== undefined) tokens.push({ text: m[2], cls: 'str' })
    else if (m[3] !== undefined) tokens.push({ text: m[3], cls: 'str' })
    else if (m[4] !== undefined) tokens.push({ text: m[4], cls: 'str' })
    else if (m[5] !== undefined) tokens.push({ text: m[5], cls: 'kw' })
    else if (m[6] !== undefined) tokens.push({ text: m[6], cls: 'num' })
    else if (m[7] !== undefined) tokens.push({ text: m[7], cls: 'tag' })
    else if (m[8] !== undefined) tokens.push({ text: m[8], cls: 'fn' })
    last = JS_RE.lastIndex
  }
  if (last < code.length) tokens.push({ text: code.slice(last) })
  return tokens
}

const CSS_RE = new RegExp(
  [
    '(/\\*[\\s\\S]*?\\*/)',                              // 1 comment
    '("(?:\\\\.|[^"\\\\\\n])*"|\'(?:\\\\.|[^\'\\\\\\n])*\')',  // 2 string
    '(@[a-zA-Z-]+)',                                     // 3 at-rule
    '(\\b\\d+(?:\\.\\d+)?(?:px|em|rem|%|s|ms|vh|vw|fr)?\\b)', // 4 num
    '(#[0-9a-fA-F]{3,8}\\b)',                             // 5 hex color
    '([a-zA-Z-]+)(?=\\s*:)',                              // 6 property
  ].join('|'),
  'g'
)

export function highlightCss(code: string): HToken[] {
  const tokens: HToken[] = []
  let last = 0
  let m: RegExpExecArray | null
  CSS_RE.lastIndex = 0
  while ((m = CSS_RE.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index) })
    if (m[1] !== undefined) tokens.push({ text: m[1], cls: 'cmt' })
    else if (m[2] !== undefined) tokens.push({ text: m[2], cls: 'str' })
    else if (m[3] !== undefined) tokens.push({ text: m[3], cls: 'kw' })
    else if (m[4] !== undefined) tokens.push({ text: m[4], cls: 'num' })
    else if (m[5] !== undefined) tokens.push({ text: m[5], cls: 'num' })
    else if (m[6] !== undefined) tokens.push({ text: m[6], cls: 'attr' })
    last = CSS_RE.lastIndex
  }
  if (last < code.length) tokens.push({ text: code.slice(last) })
  return tokens
}

const JSON_RE = new RegExp(
  [
    '("(?:\\\\.|[^"\\\\])*")\\s*:',   // 1 key
    '("(?:\\\\.|[^"\\\\])*")',         // 2 string value
    '(\\b(?:true|false|null)\\b)',     // 3 keyword
    '(-?\\b\\d+(?:\\.\\d+)?\\b)',      // 4 number
  ].join('|'),
  'g'
)

export function highlightJson(code: string): HToken[] {
  const tokens: HToken[] = []
  let last = 0; let m: RegExpExecArray | null
  JSON_RE.lastIndex = 0
  while ((m = JSON_RE.exec(code)) !== null) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index) })
    if (m[1] !== undefined) {
      tokens.push({ text: m[1], cls: 'attr' })
      tokens.push({ text: code[JSON_RE.lastIndex - 1] }) // the ':'
    } else if (m[2] !== undefined) tokens.push({ text: m[2], cls: 'str' })
    else if (m[3] !== undefined) tokens.push({ text: m[3], cls: 'kw' })
    else if (m[4] !== undefined) tokens.push({ text: m[4], cls: 'num' })
    last = JSON_RE.lastIndex
  }
  if (last < code.length) tokens.push({ text: code.slice(last) })
  return tokens
}

export function highlightText(code: string): HToken[] {
  const tokens: HToken[] = []
  for (const [idx, line] of code.split('\n').entries()) {
    if (idx > 0) tokens.push({ text: '\n' })
    const hash = line.indexOf('#')
    if (hash === -1) { tokens.push({ text: line }); continue }
    if (hash > 0) tokens.push({ text: line.slice(0, hash) })
    tokens.push({ text: line.slice(hash), cls: 'cmt' })
  }
  return tokens
}

export function highlight(code: string, lang?: string): HToken[] {
  if (lang === 'python' || lang === 'py') return highlightPython(code)
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') return highlightBash(code)
  if (lang === 'js' || lang === 'jsx' || lang === 'ts' || lang === 'tsx' || lang === 'javascript' || lang === 'typescript') return highlightJs(code)
  if (lang === 'css') return highlightCss(code)
  if (lang === 'json') return highlightJson(code)
  if (lang === 'text' || lang === 'plaintext') return highlightText(code)
  return [{ text: code }]
}

export const HL_COLORS: Record<NonNullable<HToken['cls']>, string> = {
  cmt: '#6b6b75',
  str: '#9bdb8e',
  kw: '#ff7eb6',
  num: '#7dd3fc',
  fn: '#d8b4fe',
  prompt: '#d8b4fe',
  cmd: '#5eead4',
  tag: '#7dd3fc',
  attr: '#fbbf24',
}

export function extractYouTubeId(url: string): string | null {
  const short = /youtu\.be\/([\w-]{6,})/.exec(url)
  if (short) return short[1]
  const long = /[?&]v=([\w-]{6,})/.exec(url)
  if (long) return long[1]
  const embed = /youtube\.com\/embed\/([\w-]{6,})/.exec(url)
  if (embed) return embed[1]
  return null
}
