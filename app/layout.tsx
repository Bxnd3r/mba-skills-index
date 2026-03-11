import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MBA Skills Index',
  description: 'The first platform to compare business schools to the actual job market.',
  openGraph: {
    title: 'MBA Skills Index',
    description: 'Which MBA best prepares you for the jobs you actually want?',
    type: 'website',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f2ede4] text-[#1a1a18] antialiased">{children}</body>
    </html>
  )
}
