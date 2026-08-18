'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun, X } from 'lucide-react';

import { NAV_LINKS, config, whatsappUrl } from '@/data/config';
import { buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

/** Pixeles de scroll a partir de los cuales el navbar pasa a modo "compacto". */
const SCROLL_THRESHOLD = 24;

/**
 * =====================================================================
 * NAVEGACION
 * ---------------------------------------------------------------------
 * Barra fija que se vuelve translucida al hacer scroll. En movil abre un
 * panel a pantalla completa con los mismos enlaces y el CTA de WhatsApp.
 * =====================================================================
 */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Detecta el scroll para cambiar el fondo de la barra.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del fondo mientras el menu movil esta abierto.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Cierra el menu con la tecla Escape.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-smooth',
        scrolled
          ? 'border-b border-border/70 bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container flex h-20 items-center justify-between gap-4" aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-2.5" aria-label={`${config.name} — Inicio`}>
          <Logo className="h-8 w-8" />
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            {config.name}
          </span>
        </a>

        {/* --- Enlaces de escritorio --- */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'primary', size: 'sm' }), 'hidden md:inline-flex')}
          >
            Hablemos
          </a>

          {/* --- Boton hamburguesa (solo movil) --- */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-movil"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-surface md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* --- Panel de menu movil --- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border bg-background/98 backdrop-blur-xl md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[52px] items-center rounded-md px-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className={cn(buttonVariants({ variant: 'whatsapp', size: 'lg' }), 'w-full')}
                >
                  Escríbenos por WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/**
 * Selector de tema claro/oscuro.
 * `mounted` evita el desajuste de hidratacion: en el servidor no sabemos
 * que tema tiene guardado el usuario, asi que no pintamos el icono hasta
 * estar en el cliente.
 */
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:text-foreground"
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-[18px] w-[18px]" />
        ) : (
          <Moon className="h-[18px] w-[18px]" />
        )
      ) : (
        <span className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
