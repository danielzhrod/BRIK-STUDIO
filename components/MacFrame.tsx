'use client';

import { forwardRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * =====================================================================
 * MARCO DE NAVEGADOR
 * ---------------------------------------------------------------------
 * La ventana estilo Mac que vertebra toda la web: primero como vista
 * previa en el hero y después, al crecer, como contenedor de todo el
 * portafolio.
 *
 * Se expone con `forwardRef` porque quien lo usa necesita la referencia
 * al nodo para animarlo con GSAP (giro de entrada y crecimiento ligado
 * al scroll).
 * =====================================================================
 */
interface MacFrameProps {
  /** Texto de la barra de direcciones. */
  url: string;
  children: ReactNode;
  className?: string;
  /** Clases del área de contenido (aspecto, relleno...). */
  viewportClassName?: string;
}

export const MacFrame = forwardRef<HTMLDivElement, MacFrameProps>(function MacFrame(
  { url, children, className, viewportClassName },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'preserve-3d relative w-full overflow-hidden rounded-xl border border-white/10 bg-background-card shadow-[0_40px_120px_-30px_rgba(59,130,246,0.45)]',
        className,
      )}
    >
      {/* --- Barra superior --- */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#161616] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <div className="ml-3 flex-1 truncate rounded bg-black/40 px-3 py-1 text-[11px] text-text-muted transition-colors duration-500">
          {url}
        </div>
      </div>

      {/* --- Área de contenido --- */}
      <div className={cn('relative w-full bg-[#0b0b0f]', viewportClassName)}>{children}</div>
    </div>
  );
});
