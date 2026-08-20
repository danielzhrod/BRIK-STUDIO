'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { NAV_LINKS, config } from '@/data/config';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

/** Píxeles de scroll a partir de los cuales la barra se vuelve opaca. */
const SCROLL_THRESHOLD = 50;
/** Caracteres con los que se baraja el texto antes de asentarse. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * =====================================================================
 * NAVEGACIÓN
 * ---------------------------------------------------------------------
 * La barra solo lleva el logo y un botón «Menú». Los enlaces viven en un
 * panel a pantalla completa con las secciones escritas enormes, que se
 * descifran letra a letra al abrirse.
 *
 * Al abrirlo:
 *   · el fondo se difumina y la web se ve por detrás
 *   · el scroll se BLOQUEA de verdad (ver la nota sobre Lenis abajo)
 *   · se cierra con Escape, con el botón o al elegir una sección
 *   · el tabulador queda atrapado dentro del panel
 * =====================================================================
 */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // --- Bloqueo del scroll mientras el panel está abierto ---
  useEffect(() => {
    if (!open) return;

    /*
      Hacen falta LAS DOS cosas.
      `overflow: hidden` frena el scroll nativo, pero Lenis desplaza el
      contenido con transform por su cuenta: sin pararlo, la web seguiría
      deslizándose por detrás del difuminado.
    */
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.dispatchEvent(new Event('lenis:stop'));

    return () => {
      document.body.style.overflow = previous;
      window.dispatchEvent(new Event('lenis:start'));
    };
  }, [open]);

  // --- Escape para cerrar, y tabulador atrapado dentro ---
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
        // Devolvemos el foco al botón: si no, se queda en la nada y el
        // siguiente tabulador empieza desde el principio del documento.
        buttonRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab') return;

      // Con el panel abierto, el tabulador no debe escaparse a los
      // enlaces de la página que hay detrás del difuminado.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>('a[href]');
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[60] transition-all duration-300 ease-out',
          scrolled && !open
            ? 'border-b border-background-border bg-background-primary/85 backdrop-blur-xl'
            : 'border-b border-transparent',
        )}
      >
        <nav
          className="mx-auto flex h-20 w-full max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16"
          aria-label="Principal"
        >
          <a
            href="#inicio"
            data-cursor="link"
            aria-label={`${config.name} — Inicio`}
            className="text-white transition-opacity duration-300 hover:opacity-70"
          >
            <Logo className="h-7" />
          </a>

          {/* Botón «Menú»: pastilla clara, como en la referencia. */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="menu-principal"
            data-magnetic
            data-cursor="link"
            className="inline-flex items-center gap-3 rounded-lg bg-[#efebe0] px-5 py-3 text-sm font-bold text-background-primary transition-[filter] duration-300 hover:brightness-95"
          >
            {open ? 'Cerrar' : 'Menú'}
            <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
              <span
                className={cn(
                  'block h-[2px] w-full bg-background-primary transition-transform duration-300',
                  open && 'translate-y-[3px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'block h-[2px] w-full bg-background-primary transition-transform duration-300',
                  open && '-translate-y-[4px] -rotate-45',
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/*
        El panel se queda montado siempre y solo cambia de opacidad y
        visibilidad: así la transición de cierre se ve, en lugar de
        desaparecer de golpe. `pointer-events-none` mientras está cerrado
        evita que capture clics de la web que hay debajo.
      */}
      <div
        ref={panelRef}
        id="menu-principal"
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-[55] flex flex-col justify-center transition-all duration-500 ease-smooth',
          // El difuminado deja intuir la web por detrás sin que distraiga.
          'bg-background-primary/80 backdrop-blur-2xl',
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0',
        )}
      >
        <nav className="mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16" aria-label="Secciones">
          <ul className="flex flex-wrap items-baseline gap-x-10 gap-y-1">
            {NAV_LINKS.map((link, index) => (
              <li key={link.href}>
                <MenuItem
                  label={link.label}
                  href={link.href}
                  open={open}
                  index={index}
                  onClose={close}
                />
              </li>
            ))}
          </ul>

          <p className="mt-14 text-sm text-text-muted">
            {config.whatsapp}
            {config.email ? ` · ${config.email}` : ''}
          </p>
        </nav>
      </div>
    </>
  );
}

/**
 * Una sección del menú, escrita enorme.
 *
 * Al abrirse el panel el texto se descifra: arranca con letras al azar y
 * va fijando la palabra de izquierda a derecha. Es el efecto por el que
 * en la referencia se leen palabras raras a media animación.
 */
function MenuItem({
  label,
  href,
  open,
  index,
  onClose,
}: {
  label: string;
  href: string;
  open: boolean;
  index: number;
  onClose: () => void;
}) {
  const [text, setText] = useState(label.toUpperCase());

  useEffect(() => {
    const upper = label.toUpperCase();

    if (!open) {
      setText(upper);
      return;
    }

    // Con "reducir movimiento" la palabra aparece ya legible.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(upper);
      return;
    }

    let interval: ReturnType<typeof setInterval> | undefined;
    let frame = 0;

    // Cada palabra empieza un poco después que la anterior.
    const start = setTimeout(() => {
      interval = setInterval(() => {
        frame += 1;
        // Un tercio de fotograma por letra: las de la izquierda se fijan
        // antes, y la palabra se revela como si se descifrara.
        const settled = frame / 3;

        setText(
          upper
            .split('')
            .map((char, position) =>
              position < settled
                ? char
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
            )
            .join(''),
        );

        if (settled >= upper.length && interval) clearInterval(interval);
      }, 40);
    }, index * 90);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [open, label, index]);

  return (
    <a
      href={href}
      onClick={onClose}
      data-cursor="link"
      className="block font-black uppercase leading-[1.02] tracking-[-0.03em] text-[#79839a] transition-colors duration-300 hover:text-white"
      style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
    >
      {/*
        El texto barajado es ilegible para un lector de pantalla —lo
        deletrearía—, así que va el real en `sr-only` y el animado se
        oculta a la accesibilidad.
      */}
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{text}</span>
    </a>
  );
}
