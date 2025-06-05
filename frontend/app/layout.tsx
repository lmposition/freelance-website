import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Outils pour entrepreneurs',
  description: 'Catalogue et blog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
