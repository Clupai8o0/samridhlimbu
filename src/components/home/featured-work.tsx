import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { PROJECTS } from '@/lib/data'
import { SectionHeading } from './section-heading'
import styles from './home.module.css'

export function FeaturedWork() {
  const projects = PROJECTS
    .filter(p => p.homeOrder != null)
    .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0))

  if (!projects.length) {
    return null
  }

  return (
    <section data-reveal-kids className={styles.section} aria-labelledby="work-heading">
      <SectionHeading id="work-heading">projects --featured</SectionHeading>

      <ul data-reveal-kids className={styles.work}>
        {projects.map((p, i) => {
          const lead = i === 0
          return (
            <li key={p.slug} className={lead ? styles.workLead : undefined}>
              <Link href={`/projects/${p.slug}`} className={styles.card}>
                {p.cover && (
                  <div className={styles.cover} data-spotlight data-tilt>
                    <Image
                      src={p.cover}
                      alt=""
                      fill
                      sizes={lead ? '(max-width: 760px) 100vw, 560px' : '(max-width: 760px) 100vw, 450px'}
                      style={{ objectFit: 'cover', objectPosition: 'left top' }}
                    />
                  </div>
                )}
                <div>
                  <div className={styles.cardMeta}>{p.year} · {p.tag}</div>
                  <h3 className={styles.cardName}>{p.name}</h3>
                  <p className={styles.cardPitch}>{p.pitchShort}</p>
                  <span className={styles.cardCta}>
                    read case study
                    <Icon name="arrow-right" size={12} />
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <Link href="/projects" className={styles.allLink}>
        all projects
        <Icon name="arrow-right" size={12} />
      </Link>
    </section>
  )
}
