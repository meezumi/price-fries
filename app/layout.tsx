import Navbar from '@/components/Navbar'
import { PageTransition } from '@/components/PageTransition'
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const spaceGrotesk = Space_Grotesk( { subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const montserrat = Montserrat( { subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PriceFries',
  description: 'Tracking lows and highs of Product prices and make it yours at the best time :)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,600&display=swap" rel="stylesheet"></link>
      </head>
      <body className='tracking-wider'>
        <main className='max-w-10xl mx-auto'>
          <Navbar />
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </body>
    </html>
  )
}
