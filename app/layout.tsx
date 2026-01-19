import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vlerafy - AI-Powered Pricing Optimization',
  description: 'Die erste Shopify-App, die deine Preise mit Machine Learning optimiert – automatisch, datenbasiert, profitabel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" lang="de">
      <body className="font-sans antialiased">
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          toastOptions={{
            className: 'glass',
            style: {
              background: 'rgba(18, 18, 26, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#E8E8F0',
            },
          }}
        />
      </body>
    </html>
  )
}








