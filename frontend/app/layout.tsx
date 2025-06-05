import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ToolFinder - Les meilleurs outils pour entrepreneurs',
  description: 'Découvrez une sélection curatée d\'outils essentiels pour booster votre productivité et faire grandir votre entreprise.',
  keywords: 'outils entrepreneurs, productivité, startup, SaaS, business tools',
  authors: [{ name: 'ToolFinder' }],
  openGraph: {
    title: 'ToolFinder - Les meilleurs outils pour entrepreneurs',
    description: 'Découvrez une sélection curatée d\'outils essentiels pour booster votre productivité.',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolFinder - Les meilleurs outils pour entrepreneurs',
    description: 'Découvrez une sélection curatée d\'outils essentiels pour booster votre productivité.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}