import type { Metadata } from 'next'
import { Inter, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { CmdProvider } from '@/components/cmd-provider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const BASE_URL = 'https://samridhlimbu.com'

const DESCRIPTION =
  'Software engineer in Melbourne. Final-year CS at Deakin, contract engineer for a US health-tech startup, CTO at Hoddle Melbourne, president of DSEC. Open to summer 2026–27 software engineering internships and graduate roles from mid-2027.'

const SHORT_DESCRIPTION =
  'Software engineer in Melbourne. Final-year CS at Deakin, CTO at Hoddle Melbourne, president of DSEC. Open to summer 2026–27 software engineering internships and graduate roles from mid-2027.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Samridh Limbu · Software Engineer · Melbourne',
    template: '%s · Samridh Limbu',
  },
  description: DESCRIPTION,
  keywords: [
    'Samridh Limbu', 'software engineer Melbourne', 'software engineer',
    'TypeScript', 'React', 'Next.js', 'FastAPI', 'PostgreSQL', 'Deakin University',
    'software engineering internship Melbourne', 'graduate software engineer Melbourne',
  ],
  authors: [{ name: 'Samridh Limbu', url: BASE_URL }],
  creator: 'Samridh Limbu',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  // No canonical here: child pages inherit `alternates`, so a root canonical
  // would point every case study at the home page. Pages set their own.
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: BASE_URL,
    siteName: 'Samridh Limbu',
    title: 'Samridh Limbu · Software Engineer · Melbourne',
    description: DESCRIPTION,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Samridh Limbu · Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samridh Limbu · Software Engineer · Melbourne',
    description: SHORT_DESCRIPTION,
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
      style={{ background: '#050505' }}
    >
      <body style={{ margin: 0, background: '#050505' }}>
        <CmdProvider>
          {children}
        </CmdProvider>
      </body>
    </html>
  )
}
