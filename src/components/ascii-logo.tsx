export function ASCIILogo({ scale = 1 }: { scale?: number }) {
  return (
    <pre
      style={{
        margin: 0,
        fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
        fontSize: 9 * scale,
        lineHeight: 1.05,
        color: 'var(--accent)',
        letterSpacing: 0,
        whiteSpace: 'pre',
      }}
    >{`  ____  _      \n / ___|| |     \n \\___ \\| |  __ \n  ___) | |____ \n |____/|______| samridh·limbu`}</pre>
  )
}
