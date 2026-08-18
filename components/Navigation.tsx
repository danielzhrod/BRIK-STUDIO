'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { NAV_LINKS, config, whatsappUrl } from '@/data/config';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

/** Píxeles de scroll a partir de los cuales la barra se vuelve opaca. */
const SCROLL_THRESHOLD = 50;

/**
 * =====================================================================
 * NAVEGACIÓN
 * ---------------------------------------------------------------------
 * Transparente sobre el hero; al bajar 50px se pone opaca con desenfoque
 * para que los enlaces sigan legibles sobre cualquier contenido.
 * En móvil abre un panel a pantalla completa.
 * =====================================================================
 */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Bloquea el scroll del fondo mientras el menú está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Cerrar con Escape.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out',
        scrolled
          ? 'border-b border-background-border bg-background-primary/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="shell flex h-20 items-center justify-between" aria-label="Principal">
        <a
          href="#inicio"
          data-cursor="link"
          aria-label={`${config.name} — Inicio`}
          className="text-white transition-opacity duration-300 hover:opacity-70"
        >
          <Logo className="h-7" />
        </a>

        {/* --- Enlaces en escritorio --- */}
        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-cursor="link"
                className="group relative text-[13px] font-medium uppercase tracking-[0.15em] text-text-secondary transition-colors duration-300 hover:text-white"
              >
                {link.label}
                {/* Subrayado que crece desde la izquierda al pasar el ratón */}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-accent-blue transition-transform duration-300 ease-smooth group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* --- Botón hamburguesa (móvil) --- */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className={cn(
              'block h-px w-6 bg-white transition-transform duration-300',
              open && 'translate-y-[3px] rotate-45',
            )}
          />
          <span
            className={cn(
              'block h-px w-6 bg-white transition-transform duration-300',
              open && '-translate-y-[3px] -rotate-45',
            )}
          />
        </button>
      </nav>

      {/* --- Panel móvil a pantalla completa --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-movil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-20 bg-background-primary md:hidden"
          >
            <ul className="shell flex flex-col gap-2 pt-10">
              {NAV_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index + 0.1, duration: 0.4 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[60px] items-center border-b border-background-border text-2xl font-bold text-white"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-8"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[56px] w-full items-center justify-center rounded bg-accent-whatsapp px-8 font-semibold text-background-primary"
                >
                  Escríbenos por WhatsApp
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
