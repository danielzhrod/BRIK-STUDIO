'use client';

import { ContactForm } from '@/components/ContactForm';

/**
 * =====================================================================
 * VENTANA MAC
 * ---------------------------------------------------------------------
 * El marco y sus tres capas. Todo lo que se anima lleva una clase con
 * nombre (`mac-window`, `mac-screen`, `mac-form-layer`, `mac-shadow`,
 * `mac-glow`) porque quien las mueve es la línea de tiempo de
 * `MockupStage`, no este componente. Aquí solo está la estructura.
 *
 * La pantalla es un `<img>` normal y no `next/image` a propósito: GSAP
 * cambia el atributo `src` en mitad del giro, y `next/image` reescribe
 * ese atributo por su cuenta, así que se pelearían.
 * =====================================================================
 */
export function MacWindow({ initialSrc, url }: { initialSrc: string; url: string }) {
  return (
    <div className="mockup-pinned relative flex items-center justify-center">
      {/* Resplandor de acento: vive detrás y solo cambia de opacidad. */}
      <div
        aria-hidden="true"
        className="mac-glow pointer-events-none absolute h-[70%] w-[80%] rounded-full bg-accent-blue/25 opacity-0 blur-[120px]"
      />

      {/* Sombra: elemento aparte para poder darle peso sin animar box-shadow. */}
      <div
        aria-hidden="true"
        className="mac-shadow pointer-events-none absolute bottom-[6%] h-10 w-[70%] rounded-[50%] bg-black/70 blur-2xl"
      />

      <div className="mac-window relative w-full overflow-hidden rounded-xl border border-white/10 bg-background-card">
        {/* Barra superior */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#161616] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="mac-url ml-3 flex-1 truncate rounded bg-black/40 px-3 py-1 text-[11px] text-text-muted">
            {url}
          </div>
        </div>

        {/* Pantalla */}
        <div className="relative aspect-[16/10] w-full bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="mac-screen absolute inset-0 h-full w-full object-cover object-top"
            src={initialSrc}
            alt="Vista previa de un proyecto de BRIK STUDIO"
          />

          {/*
            Capa del formulario. Arranca oculta y la revela la última
            transición de la línea de tiempo. `pointer-events-none`
            mientras no se ve: si no, sus campos capturarían clics por
            encima de la imagen.
          */}
          <div className="mac-form-layer pointer-events-none absolute inset-0 overflow-y-auto bg-background-card px-5 py-4 opacity-0">
            <ContactForm variant="window" />
          </div>
        </div>
      </div>
    </div>
  );
}
