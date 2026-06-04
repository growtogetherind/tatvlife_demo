import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Tatvlife | Premium Oncology Medicine & Supportive Care',
    template: '%s | Tatvlife',
  },
  description: 'Access trusted cancer medicines and premium oncology supportive care products. Secure crypto payments, worldwide delivery, and expert support.',
  keywords: ['cancer medicine', 'oncology', 'chemotherapy', 'immunotherapy', 'targeted therapy', 'supportive care'],
  openGraph: {
    type: 'website',
    siteName: 'Tatvlife',
    title: 'Tatvlife | Premium Oncology Medicine & Supportive Care',
    description: 'Access trusted cancer medicines and premium oncology supportive care products.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: 'var(--cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
