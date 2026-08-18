'use client';

import { useRef } from 'react';

import { config, whatsappUrl } from '@/data/config';
import { SplitText } from '@/components/SplitText';
import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * =====================================================================
 * HERO
 * ---------------------------------------------------------------------
 * Solo texto: la ventana de navegador vive fuera, en <FloatingWindow>,
 * flotando en la mitad derecha durante todo el scroll.
 *
 * Las letras entran como ladrillos lanzados contra una pared.
 * =====================================================================
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('.letter'), { autoAlpha: 1, y: 0, rotate: 0, scale: 1 });
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: MOTION.easeStrong } });

      /*
        LETRAS COMO LADRILLOS
        La curva lo decide todo: con una curva `out` la letra desacelera
        y se posa suave. Va con `power2.in`, que ACELERA hasta el impacto,
        como cualquier cosa lanzada contra una pared. Y el aplastamiento
        arranca justo al acabar el vuelo: si queda hueco, se lee como un
        temblor tardío en vez de como un golpe.

        `transformOrigin` en la base deja el pie clavado y hace que sea la
        parte de arriba la que se hunde y rebota, como un bloque que encaja.
      */
      const letters = gsap.utils.toArray<HTMLElement>('.letter');
      const FLIGHT = 0.42;
      const HIT = 0.08;

      letters.forEach((letter, index) => {
        const fromLeft = index % 2 === 0;
        const spin = gsap.utils.random(38, 72) * (fromLeft ? -1 : 1);
        const drift = gsap.utils.random(150, 230) * (fromLeft ? -1 : 1);

        gsap.set(letter, { transformOrigin: '50% 100%' });

        const brick = gsap
          .timeline()
          .fromTo(
            letter,
            { x: drift, y: -210, rotate: spin, scale: 1.12 },
            { x: 0, y: 0, rotate: 0, scale: 1, duration: FLIGHT, ease: 'power2.in' },
            0,
          )
          .fromTo(letter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'none' }, 0)
          .to(letter, { scaleY: 0.78, scaleX: 1.14, duration: HIT, ease: 'power2.out' }, FLIGHT)
          .to(
            letter,
            { scaleY: 1, scaleX: 1, duration: 0.62, ease: 'elastic.out(1.1, 0.38)' },
            FLIGHT + HIT,
          );

        timeline.add(brick, 0.25 + index * 0.065);
      });

      timeline
        .fromTo('[data-anim="tagline"]', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.15)
        .fromTo('[data-anim="cta"]', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.35);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      // `lg:pr-[50vw]` deja libre la mitad derecha para la ventana flotante.
      className="relative flex min-h-[100dvh] items-center px-6 pt-28 md:px-10 lg:px-16 lg:pr-[50vw] lg:pt-0"
    >
      <div className="w-full max-w-xl">
        <h1 className="font-black text-display-sm sm:text-display">
          <SplitText text="BRIK" className="block text-white" />
          <SplitText text="STUDIO" className="block text-outline" />
        </h1>

        <p
          data-anim="tagline"
          className="invisible mt-8 text-label font-normal uppercase text-text-secondary"
          style={{ letterSpacing: '0.25em' }}
        >
          {config.tagline}
        </p>

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
    </section>
  );
}
