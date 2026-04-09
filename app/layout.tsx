import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PoderGen — Generador de Poderes Notariales',
  description: 'Genera poderes notariales bilingües (ES/EN) para transacciones inmobiliarias en México. Expat Advisor MX.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  keywords: ['poder notarial', 'fideicomiso', 'Nuevo Vallarta', 'México', 'power of attorney', 'Expat Advisor'],
  authors: [{ name: 'Expat Advisor MX', url: 'https://expatadvisormx.com' }],
};

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
