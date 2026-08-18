import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';

import './globals.css';
import { config } from '@/data/config';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

/**
 * Inter para el texto corrido. `display: swap` evita el texto invisible
 * mientras carga la fuente (mejora el LCP).
 * Geist llega autoalojada desde el paquete `geist`: cero peticiones externas.
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning es obligatorio con next-themes: el script del
    // tema escribe la clase en <html> antes de que React hidrate.
    <html lang="es" suppressHydrationWarning className={`${GeistSans.variable} ${inter.variable}`}>
      <body>
        {/*
          Red de seguridad sin JavaScript.
          Las secciones arrancan con la clase `invisible` porque GSAP las va
          revelando al hacer scroll. Si el visitante tiene JavaScript
          desactivado (o el script falla al cargar) nadie las revelaria y la
          pagina se veria en blanco. Esta regla las muestra todas de golpe.
        */}
        <noscript>
          <style>{`.invisible { visibility: visible !important; }`}</style>
        </noscript>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Enlace de salto: primer elemento enfocable, solo visible con teclado. */}
          <a
            href="#proyectos"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-primary-foreground"
          >
            Saltar al contenido
          </a>

          <SmoothScroll />
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
