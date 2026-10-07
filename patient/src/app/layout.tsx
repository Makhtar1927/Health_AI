import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sunu Santé - Espace Patient Sécurisé',
  description: 'Portail patient médical sécurisé : vos consultations, ordonnances, carnet de santé et téléconsultations en toute simplicité.',
  keywords: ['santé', 'medical', 'patient', 'senegal', 'dossier medical', 'sunu sante'],
  authors: [{ name: 'Sunu Santé' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d9488',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
