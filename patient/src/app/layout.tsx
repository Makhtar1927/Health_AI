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
  title: 'Health AI - Espace Patient Sécurisé',
  description: 'Portail patient médical sécurisé : vos consultations, ordonnances, carnet de santé et téléconsultations en toute simplicité.',
  keywords: ['santé', 'medical', 'patient', 'senegal', 'dossier medical', 'health ai'],
  authors: [{ name: 'Health AI' }],
  icons: {
    icon: '/HealthAI_symbole.png',
    shortcut: '/HealthAI_symbole.png',
    apple: '/HealthAI_symbole.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0d9488',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${outfit.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-teal-500 selection:text-white" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (var i = 0; i < names.length; i++) {
                      caches.delete(names[i]);
                    }
                  });
                }
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
