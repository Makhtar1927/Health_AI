import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'Sunu Santé - Espace Patient et Accueil Global',
  description: 'Système complet de gestion hospitalière et d\'intelligence artificielle médicale pour les professionnels de santé et les patients.',
  keywords: ['santé', 'medical', 'ia', 'radiologie', 'senegal', 'dossier medical', 'pacs', 'dicom'],
  authors: [{ name: 'Sunu Santé Team' }],
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
    <html lang="fr" className={`${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
