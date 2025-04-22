'use client'

import Navigation from './components/Navigation'
import { usePathname } from 'next/navigation'
import 'leaflet/dist/leaflet.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = pathname === '/' || pathname === '/signup'

  return (
    <html lang="en">
      <body>
        {!hideNav && <Navigation />}
        {children}
      </body>
    </html>
  )
}
