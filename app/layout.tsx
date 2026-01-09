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
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Nuclear border-radius override - inline fallback */
            * { border-radius: 12px !important; }
            div[class*="card"], div[class*="box"], div[class*="container"] { border-radius: 16px !important; }
            button, input, select { border-radius: 10px !important; }
            span[class*="badge"] { border-radius: 8px !important; }
            svg, path { border-radius: 0 !important; }
            html, body { border-radius: 0 !important; }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}








