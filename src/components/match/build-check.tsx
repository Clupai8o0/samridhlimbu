import styles from './match.module.css'

export const BUILD_CHECK_URL = 'https://clupai.com/start'

/** For people who need something built: client work goes through clupai,
 *  Sam's company, which starts with a short questionnaire. */
export function BuildCheck({ short }: { short?: boolean })
{
  return (
    <a className={styles.buildCheck} href={BUILD_CHECK_URL} target="_blank" rel="noopener">
      <span className={styles.buildCheckText}>
        {short
          ? 'Already know what you need? Skip ahead to clupai’s build questionnaire.'
          : 'I build client work through clupai, my company. Start with its 2-minute Build Risk Check: tell us what you need and get a score and the top risks.'}
      </span>
      <span className={styles.buildCheckCta}>clupai.com/start ↗</span>
    </a>
  )
}
