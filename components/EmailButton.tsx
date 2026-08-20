'use client';

import { useEffect, useRef, useState } from 'react';

import { config } from '@/data/config';

const SUBJECT = 'Consulta para BRIK STUDIO';
const BODY = 'Hola BRIK STUDIO,\n\nMe gustaría información sobre una web para mi negocio.\n\n';

/**
 * Junta las dos mitades de la dirección.
 *
 * Vive dentro de una función y no en una constante del módulo para que la
 * dirección completa no aparezca como una cadena suelta en el paquete de
 * JavaScript. Se llama solo cuando alguien pulsa una opción.
 */
const address = () => `${config.emailUser}@${config.emailDomain}`;

type TargetId = 'gmail' | 'outlook' | 'mailto';

const TARGETS: { id: TargetId; label: string }[] = [
  { id: 'gmail', label: 'Gmail' },
  { id: 'outlook', label: 'Outlook' },
  { id: 'mailto', label: 'Mi aplicación de correo' },
];

/** Construye la URL del redactor elegido, ya con todo relleno. */
function composeUrl(target: TargetId): string {
  const to = encodeURIComponent(address());
  const subject = encodeURIComponent(SUBJECT);
  const body = encodeURIComponent(BODY);

  switch (target) {
    case 'gmail':
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    case 'outlook':
      return `https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${subject}&body=${body}`;
    default:
      return `mailto:${address()}?subject=${subject}&body=${body}`;
  }
}

/**
 * =====================================================================
 * BOTÓN DE EMAIL
 * ---------------------------------------------------------------------
 * Un `mailto:` a secas es mala experiencia para quien usa Gmail u Outlook
 * en el navegador: o no pasa nada, o se le abre un programa de escritorio
 * que no usa. Aquí elige, y en los dos casos web se le abre el redactor
 * con destinatario, asunto y cuerpo ya escritos.
 *
 * Las opciones son BOTONES, no enlaces, a propósito: así la dirección no
 * viaja en ningún `href` del HTML y los rastreadores de spam no la
 * encuentran. Se arma al pulsar.
 *
 * Contrapartida: se pierde el «abrir en pestaña nueva» con el clic
 * central y el «copiar dirección del enlace». A cambio, el correo no se
 * puede rastrear. Semánticamente un `<button>` es lo correcto: esto es
 * una acción, no una navegación.
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

  const go = (target: TargetId) => {
    const url = composeUrl(target);
    setOpen(false);

    if (target === 'mailto') {
      // El programa de correo del sistema: nada de pestaña nueva, que
      // dejaría una en blanco abierta.
      window.location.href = url;
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        data-magnetic
        data-cursor="link"
        className="inline-flex items-center gap-2 rounded border border-background-border px-8 py-3.5 text-[15px] font-medium text-text-secondary transition-colors duration-300 hover:border-text-secondary hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-[18px] w-[18px]"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        </svg>
        Email
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-30 mt-3 w-60 overflow-hidden rounded-md border border-background-border bg-background-card shadow-2xl"
        >
          {TARGETS.map((target) => (
            <button
              key={target.id}
              type="button"
              role="menuitem"
              onClick={() => go(target.id)}
              data-cursor="link"
              className="block w-full px-5 py-4 text-left text-sm text-text-secondary transition-colors duration-200 hover:bg-white/5 hover:text-white"
            >
              {target.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
