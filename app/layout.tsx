import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { config } from '@/data/config';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { MagneticCursor } from '@/components/MagneticCursor';

/**
 * Inter en toda la interfaz, del peso 400 al 900 (el hero usa el 900).
 * `display: swap` evita el texto invisible mientras carga la fuente.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? config.website;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${config.name} — ${config.tagline}`,
    template: `%s | ${config.name}`,
  },
  description: config.description,
  keywords: [
    'diseño web',
    'páginas web profesionales',
    'tiendas online',
    'ecommerce',
    'landing page',
    'desarrollo web España',
  ],
  authors: [{ name: config.name }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: config.name,
    title: `${config.name} — ${config.tagline}`,
    description: config.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.name} — ${config.tagline}`,
    description: config.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        {/*
          Red de seguridad sin JavaScript.
          Muchos bloques arrancan ocultos porque GSAP los revela al hacer
          scroll. Si el visitante tiene JS desactivado o el script falla,
          nadie los revelaría y vería la página en blanco. Estas reglas
          lo muestran todo de golpe.
        */}
        <noscript>
          <style>{`
            .invisible { visibility: visible !important; }
            .letter { opacity: 1 !important; }
            .word { opacity: 1 !important; color: #ffffff !important; }
          `}</style>
        </noscript>

        {/* Enlace de salto: primer elemento enfocable, solo visible con teclado. */}
        <a
          href="#proyectos"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-background-primary"
        >
          Saltar al contenido
        </a>

        <MagneticCursor />
        <SmoothScroll />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
