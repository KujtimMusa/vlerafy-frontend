import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PriceIQ',
  description: 'Shopify Pricing Optimization Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark">
      <body>{children}</body>
    </html>
  )
}








