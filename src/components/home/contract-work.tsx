import { SectionHeading } from './section-heading'
import styles from './home.module.css'

// NDA: the client and product are never named or shown. Only these facts are public.
const ITEMS: { problem: string; did?: string; result?: string }[] = [
  {
    problem: 'Search took seconds.',
    did: 'Added database indexing and response compression.',
    result: 'Results in under 200 ms.',
  },
]

// The rest of the work, as one plain line instead of empty bullets.
const ALSO = 'I also owned the frontend integration, built new data-source integrations, ran a production hardening pass, and have shipped dozens of production deploys since July.'

export function ContractWork() {
  return (
    <section data-reveal-kids id="contract" className={styles.section} aria-labelledby="contract-heading">
      <SectionHeading id="contract-heading">contract work · under NDA</SectionHeading>

      <p className={styles.prose}>
        Since July 2026 I&apos;ve worked remotely as a contract software engineer for a US health-tech startup.
      </p>

      <ol data-reveal-kids className={styles.contractList}>
        {ITEMS.map(item => (
          <li key={item.problem} className={styles.contractItem}>
            <h3 className={styles.problem}>{item.problem}</h3>
            {item.did && (
              <dl className={styles.steps}>
                <dt>what i did</dt>
                <dd>{item.did}</dd>
                <dt>result</dt>
                <dd className={styles.result}>{item.result}</dd>
              </dl>
            )}
          </li>
        ))}
      </ol>

      <p className={styles.prose}>{ALSO}</p>

      <div className={styles.stack}>
        <span style={{ color: 'var(--muted-2)' }}>stack</span>
        <span>React · TypeScript · FastAPI · PostgreSQL · Google Cloud</span>
      </div>
      <p className={styles.footnote}>
        The client and product stay unnamed under the NDA. Happy to go deeper on the engineering in an interview, as far as the NDA allows.
      </p>
    </section>
  )
}
