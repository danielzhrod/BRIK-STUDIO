'use client';

import { useEffect, useRef, useState } from 'react';

import { config } from '@/data/config';

const SUBJECT = 'Consulta para BRIK STUDIO';
const BODY = 'Hola BRIK STUDIO,\n\nMe gustaría información sobre una web para mi negocio.\n\n';

/**
 * Los tres destinos posibles.
 *
 * Gmail y Outlook abren su redactor en el navegador, con destinatario,
 * asunto y cuerpo ya rellenos. La tercera opción usa `mailto:`, que
 * delega en el programa de correo que tenga configurado el sistema
 * (Mail, Thunderbird, Outlook de escritorio…).
 */
const TARGETS = [
  {
    id: 'gmail',
    label: 'Gmail',
    href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(config.email)}&su=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`,
    external: true,
  },
  {
    id: 'outlook',
    label: 'Outlook',
    href: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(config.email)}&subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`,
    external: true,
  },
  {
    id: 'mailto',
    label: 'Mi aplicación de correo',
    href: `mailto:${config.email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(BODY)}`,
    external: false,
  },
] as const;

/**
 * =====================================================================
 * BOTÓN DE EMAIL
 * ---------------------------------------------------------------------
 * Un `mailto:` a secas es una mala experiencia para quien usa Gmail o
 * Outlook en el navegador: o no pasa nada, o se le abre un programa de
 * escritorio que no usa. Este botón le deja elegir, y en los dos casos
 * web le abre el redactor con todo ya escrito.
 * =====================================================================
 */
export function EmailButton() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar al pulsar fuera o con Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (!config.email) return null;

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        data-magnetic
        data-cursor="link"
        className="inline-flex items-center gap-3 rounded-md border border-background-border px-8 py-4 text-base font-semibold text-text-secondary transition-colors duration-300 hover:border-text-secondary hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        </svg>
        Escríbenos por email
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-3 w-64 overflow-hidden rounded-md border border-background-border bg-background-card shadow-2xl"
        >
          {TARGETS.map((target) => (
            <a
              key={target.id}
              role="menuitem"
              href={target.href}
              // Los redactores web se abren en pestaña nueva; `mailto:`
              // no, porque abriría una pestaña en blanco antes de lanzar
              // el programa de correo.
              {...(target.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              onClick={() => setOpen(false)}
              data-cursor="link"
              className="block px-5 py-4 text-sm text-text-secondary transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {target.label}
            </a>
          ))}
          <p className="border-t border-background-border px-5 py-3 text-xs text-text-muted">
            {config.email}
          </p>
        </div>
      )}
    </div>
  );
}
