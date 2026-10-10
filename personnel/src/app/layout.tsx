import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'Health AI - Personnel Hospitalier et Officinal',
  description: 'Système complet de gestion hospitalière et d\'intelligence artificielle médicale pour les professionnels de santé et les patients.',
  keywords: ['santé', 'medical', 'ia', 'radiologie', 'senegal', 'dossier medical', 'pacs', 'dicom'],
  authors: [{ name: 'Health AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
