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

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Samridh Limbu · Software Engineer · Melbourne',
    template: '%s · Samridh Limbu',
  },
  description:
    'Full-stack software engineer in Melbourne. Next.js, TypeScript, PostgreSQL. CTO at Hoddle, founder of Kairos, co-founder of TapCraft Studio. Seeking SWE internships Nov 2026–Feb 2027.',
  keywords: [
    'Samridh Limbu', 'software engineer Melbourne', 'full-stack developer',
    'Next.js developer', 'TypeScript', 'React developer', 'Deakin University',
    'SWE internship Melbourne', 'web developer portfolio',
  ],
  authors: [{ name: 'Samridh Limbu', url: BASE_URL }],
  creator: 'Samridh Limbu',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: BASE_URL,
    siteName: 'Samridh Limbu',
    title: 'Samridh Limbu · Software Engineer · Melbourne',
    description:
      'Full-stack software engineer in Melbourne. Next.js, TypeScript, PostgreSQL. CTO at Hoddle, founder of Kairos, co-founder of TapCraft Studio.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Samridh Limbu · Software Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samridh Limbu · Software Engineer · Melbourne',
    description:
      'Full-stack software engineer in Melbourne. Next.js, TypeScript, PostgreSQL.',
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
