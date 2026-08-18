'use client';

import { useRef } from 'react';

import { config, whatsappUrl } from '@/data/config';
import { BrowserMockup } from '@/components/BrowserMockup';
import { ParticleField } from '@/components/ParticleField';
import { SplitText } from '@/components/SplitText';
import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * =====================================================================
 * HERO — los tres primeros segundos
 * ---------------------------------------------------------------------
 * Tres capas superpuestas:
 *   1. Partículas en canvas (fondo vivo que reacciona al ratón)
 *   2. Tipografía enorme a la izquierda, letra a letra
 *   3. Mockup de navegador a la derecha, con inclinación 3D
 *
 * La entrada es una única línea de tiempo de GSAP para que todo esté
 * coreografiado con el mismo reloj, en lugar de animaciones sueltas que
 * se van desincronizando.
 * =====================================================================
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Sin movimiento: se muestra todo de golpe y ya está.
    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, y: 0 });
      gsap.set(section.querySelectorAll('.letter'), { autoAlpha: 1, y: 0, rotateX: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: MOTION.easeStrong } });

      /*
        ---------------------------------------------------------------
        LETRAS COMO LADRILLOS
        ---------------------------------------------------------------
        Cada letra se lanza desde un lado (alternando izquierda/derecha),
        cae girando y CHOCA contra su sitio.

        LA CURVA ES LO QUE DECIDE TODO. Con una curva `out` la letra
        desacelera al final: frena en el aire y se posa suave, que es
        justo lo contrario de un ladrillo lanzado. Va con `power2.in`,
        que ACELERA hasta el impacto, igual que cualquier cosa que se
        tira contra una pared.

        Y el aplastamiento arranca en el instante exacto de la llegada
        (posición 0.42, cuando acaba el vuelo). Si queda un hueco entre
        medias, la letra se para primero y el golpe se lee como un
        temblor tardío en vez de como un impacto.

        `transformOrigin` en la base hace que el aplastamiento salga
        desde abajo: la base queda clavada y es la parte de arriba la que
        se hunde y rebota, como un bloque que encaja.
      */
      const letters = gsap.utils.toArray<HTMLElement>('.letter');

      const FLIGHT = 0.42; // duración del vuelo
      const HIT = 0.08; // duración del aplastamiento

      letters.forEach((letter, index) => {
        const fromLeft = index % 2 === 0;
        // Pequeña variación por letra para que no parezcan clonadas.
        const spin = gsap.utils.random(38, 72) * (fromLeft ? -1 : 1);
        const drift = gsap.utils.random(150, 230) * (fromLeft ? -1 : 1);

        gsap.set(letter, { transformOrigin: '50% 100%' });

        const brick = gsap
          .timeline()
          // 1. Vuelo: acelera hacia su sitio y llega a toda velocidad.
          .fromTo(
            letter,
            { x: drift, y: -210, rotate: spin, scale: 1.12 },
            { x: 0, y: 0, rotate: 0, scale: 1, duration: FLIGHT, ease: 'power2.in' },
            0,
          )
          // Aparece enseguida, sin esperar a todo el vuelo.
          .fromTo(letter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'none' }, 0)
          // 2. Impacto: se achata de golpe, pegado al final del vuelo.
          .to(letter, { scaleY: 0.78, scaleX: 1.14, duration: HIT, ease: 'power2.out' }, FLIGHT)
          // 3. Asentamiento: la parte de arriba rebota y se queda quieta.
          .to(
            letter,
            { scaleY: 1, scaleX: 1, duration: 0.62, ease: 'elastic.out(1.1, 0.38)' },
            FLIGHT + HIT,
          );

        // Los ladrillos se lanzan uno detrás de otro, no todos a la vez.
        timeline.add(brick, 0.25 + index * 0.065);
      });

      timeline
        // El resto entra por debajo, escalonado.
        // Los tiempos van tras el último ladrillo (~1,6s) para que la
        // pared se monte sin que nada le robe la atención.
        .fromTo(
          '[data-anim="tagline"]',
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          1.15,
        )
        .fromTo(
          '[data-anim="cta"]',
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8 },
          1.35,
        )
        .fromTo(
          '[data-anim="mockup"]',
          { y: 60, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1.2 },
          0.6,
        )
        .fromTo(
          '[data-anim="scroll"]',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6 },
          1.7,
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-background-primary pb-24 pt-32 lg:pb-0 lg:pt-0"
    >
      {/* --- Capa 1: partículas --- */}
      <ParticleField />

      {/* Halo azul muy difuso que da profundidad al fondo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[min(1200px,120vw)] -translate-x-1/2 rounded-full bg-accent-blue/10 blur-[140px]"
      />

      <div className="shell relative z-10 grid w-full items-center gap-16 lg:grid-cols-[45%_55%] lg:gap-10">
        {/* ---------- Capa 3: tipografía ---------- */}
        <div>
          <h1 className="font-black text-display-sm sm:text-display">
            <SplitText text="BRIK" className="block text-white" />
            <SplitText text="STUDIO" className="block text-outline" />
          </h1>

          <p
            data-anim="tagline"
            className="mt-8 text-label font-normal uppercase text-text-secondary invisible"
            style={{ letterSpacing: '0.25em' }}
          >
            {config.tagline}
          </p>

          {/* ---------- CTAs ---------- */}
          <div data-anim="cta" className="invisible mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#proyectos"
              data-magnetic
              data-cursor="link"
              className="group inline-flex items-center gap-2 rounded bg-white px-8 py-3.5 text-[15px] font-semibold text-background-primary transition-[filter] duration-300 hover:brightness-90"
            >
              Ver proyectos
              <span className="transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                →
              </span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic
              data-cursor="link"
              className="inline-flex items-center gap-2 rounded border border-background-border px-8 py-3.5 text-[15px] font-medium text-text-secondary transition-colors duration-300 hover:border-text-secondary hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* ---------- Capa 2: mockup ---------- */}
        <div data-anim="mockup" className="invisible">
          <BrowserMockup />
        </div>
      </div>

      {/* ---------- Indicador de scroll ---------- */}
      <div
        data-anim="scroll"
        aria-hidden="true"
        className="invisible absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
      >
        <span className="rotate-90 text-[10px] uppercase tracking-[0.3em] text-text-muted">
          scroll
        </span>
        <span className="mt-4 block h-12 w-px bg-text-muted animate-scroll-line" />
      </div>
    </section>
  );
}
