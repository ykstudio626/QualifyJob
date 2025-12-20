import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIJOBMatching System v0.1',
  description: 'AIでJOBをマッチングするシステム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}