import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'StreetMuse - Wisdom from the Streets, Learning That Never Sleeps',
  description: 'Your AI-powered street photography companion. Learn from masters like Henri Cartier-Bresson, Vivian Maier, and Garry Winogrand through an infinite scroll of insights, techniques, and inspiration.',
  keywords: ['street photography', 'photography tips', 'Cartier-Bresson', 'Vivian Maier', 'photography learning', 'mobile photography'],
  authors: [{ name: 'StreetMuse Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
    { media: '(prefers-color-scheme: light)', color: '#F2F2F7' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'StreetMuse',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-body antialiased`}>
        {/* Skip Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only"
        >
          Skip to main content
        </a>

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
