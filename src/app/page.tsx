import type { Metadata } from 'next'
import Link from 'next/link'
import { PageShell } from '@/components/page-shell'
import { PageHeader } from '@/components/page-header'
import { ContactForm } from '@/components/contact-form'
import { Hero, EMAIL } from '@/components/home/hero'
import { FeaturedWork } from '@/components/home/featured-work'
import { ContractWork } from '@/components/home/contract-work'
import { ExperienceLog } from '@/components/home/experience-log'
import { SectionHeading } from '@/components/home/section-heading'
import styles from '@/components/home/home.module.css'

const DESCRIPTION =
  'Samridh Limbu, software engineer in Melbourne. Final-year CS at Deakin, contract software engineer, CTO at Hoddle Melbourne and president of DSEC. Open to summer 2026–27 software engineering internships and graduate roles from mid-2027.'

export const metadata: Metadata = {
  description: DESCRIPTION,
  alternates: { canonical: 'https://samridhlimbu.com' },
  // openGraph replaces the layout's object, so it carries every field.
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Samridh Limbu',
    url: 'https://samridhlimbu.com',
    title: 'Samridh Limbu · Software Engineer · Melbourne',
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Samridh Limbu · Software Engineer' }],
  },
}

// The contract client is deliberately absent here (NDA).
const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Samridh Limbu',
  url: 'https://samridhlimbu.com',
  image: 'https://samridhlimbu.com/sam.jpeg',
  jobTitle: 'Software Engineer',
  description: 'Software engineer in Melbourne. Final-year computer science at Deakin University, CTO at Hoddle Melbourne and president of DSEC.',
  email: EMAIL,
  sameAs: [
    'https://github.com/clupai8o0',
    'https://linkedin.com/in/samridh-limbu',
    'https://x.com/clupai8o0',
    'https://instagram.com/clupaii',
  ],
  worksFor: { '@type': 'Organization', name: 'Hoddle Melbourne', url: 'https://hoddle.org' },
  memberOf: { '@type': 'Organization', name: 'DSEC (Deakin Software Engineering Club)' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Deakin University' },
  award: 'GovHack 2025 winner',
  address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressCountry: 'AU' },
}

export default function HomePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_SCHEMA) }}
      />
      <div data-stagger className={styles.wrap}>
        <PageHeader />
        <Hero />

        <FeaturedWork />

        <ContractWork />

        <section data-reveal className={styles.section} aria-labelledby="whoami-heading">
          <SectionHeading id="whoami-heading">whoami</SectionHeading>
          <p className={styles.prose}>
            I&apos;m Sam, in my final year of computer science at Deakin, graduating in June 2027. Since July 2026 I&apos;ve been a contract software engineer for a US health-tech startup (under NDA), where I took search from seconds to under 200 ms and have shipped dozens of production deploys. I&apos;m also CTO and sole developer of{' '}
            <Link href="/projects/hoddle" className="t2-link">Hoddle Melbourne</Link>, and president of{' '}
            <Link href="/projects/dsec" className="t2-link">DSEC</Link>, a software club of 190+ members.
          </p>
          <p className={styles.prose}>
            A lot of what&apos;s here started as something that annoyed me. I got tired of time-blocking tools, so I built{' '}
            <Link href="/projects/kairos" className="t2-link">Kairos</Link>, and I still use it every day. Claude kept losing my workout history between sessions, so I built{' '}
            <Link href="/projects/tempo" className="t2-link">Tempo</Link>, a workout app it can read and log to through an MCP server. I care a lot about UI, and I want to own what sits behind it too: schema, API, tests, deploys.
          </p>
          <div className={styles.meta}>last_updated: 2026-10-25</div>
        </section>

        <ExperienceLog />

        <section data-reveal className={styles.section} aria-labelledby="contact-heading">
          <SectionHeading id="contact-heading">get_in_touch()</SectionHeading>
          <div style={{ maxWidth: 640 }}>
            <ContactForm />
          </div>
        </section>
      </div>
    </PageShell>
  )
}
