import Navbar from '@/components/Navbar'
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
      <body className={spaceGrotesk.className}>
        <main className='max-w-10xl mx-auto'>
          <Navbar /> 
        {children}
        </main>
        
      </body>

    </html>
  )
}
