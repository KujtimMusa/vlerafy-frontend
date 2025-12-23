import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Optimizer',
  description: 'Shopify Pricing Optimization Tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}








