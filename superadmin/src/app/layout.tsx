import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit'
});

export const metadata: Metadata = {
  title: 'Health AI - Super-Administration Globale',
  description: 'Console centrale de supervision et de contrôle du système Health AI.',
  keywords: ['health ai', 'santé', 'medical', 'ia', 'intelligence artificielle', 'superadmin'],
  authors: [{ name: 'Health AI Team' }],
  icons: {
    icon: '/HealthAI_symbole.png',
    apple: '/HealthAI_symbole.png',
  },
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
