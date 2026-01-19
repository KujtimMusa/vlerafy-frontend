import type { Metadata } from 'next'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Vlerafy',
  description: 'AI-Powered Shopify Pricing Optimization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}








