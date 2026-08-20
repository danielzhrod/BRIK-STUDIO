'use client';

import { useRef } from 'react';

import { config, whatsappUrl } from '@/data/config';
import { SplitText } from '@/components/SplitText';
import { EmailButton } from '@/components/EmailButton';
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
        LETRAS COMO LADRILLOS QUE CAEN Y PARAN EN SECO
        ---------------------------------------------------------------
        Tres cosas mandan aquí, y las tres tienen que ir a la vez:

        1. CAEN, no vuelan. El desplazamiento lateral es mínimo (±12px)
           frente a 320px de caída. Antes eran 200px de lado contra 210
           de alto: cada letra llegaba en diagonal, como si entrara
           volando en vez de desplomarse.

        2. ACELERAN hasta el golpe. `power3.in` es una curva que arranca
           lenta y llega disparada, como cualquier cosa que se cae. Con
           una curva suave la letra frena sola en el aire y se posa.

        3. PARAN EN SECO. La recuperación va en 0.16s con `power2.out`,
           SIN rebote elástico. Un elástico deja la letra temblando medio
           segundo y eso se lee como gelatina, no como un ladrillo. Es lo
           que faltaba en los intentos anteriores.

        `transformOrigin` en la base deja el pie clavado: es la parte de
        arriba la que se hunde y vuelve, como un bloque encajando.
      */
      const letters = gsap.utils.toArray<HTMLElement>('.letter');

      const FALL = 0.34; // caída
      const HIT = 0.07; // aplastamiento contra el suelo
      const RISE = 0.16; // recuperación seca, sin temblor

      letters.forEach((letter, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        // Variación mínima por letra: que no parezcan clonadas, pero sin
        // que ninguna deje de leerse como una caída vertical.
        const tilt = gsap.utils.random(4, 9) * side;
        const drift = gsap.utils.random(8, 16) * side;

        gsap.set(letter, { transformOrigin: '50% 100%' });

        const brick = gsap
          .timeline()
          // 1. Caída: acelera hasta estrellarse en su sitio.
          .fromTo(
            letter,
            { y: -320, x: drift, rotate: tilt, scale: 1.06 },
            { y: 0, x: 0, rotate: 0, scale: 1, duration: FALL, ease: 'power3.in' },
            0,
          )
          // Aparece enseguida, no a mitad de la caída.
          .fromTo(letter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12, ease: 'none' }, 0)
          // 2. Impacto: se achata de golpe contra la línea de base.
          //    El ensanchado se queda en 1.06 y no más: con el tracking
          //    negativo del titular, estirar más hace que las letras del
          //    contorno de STUDIO se solapen entre sí.
          .to(letter, { scaleY: 0.72, scaleX: 1.06, duration: HIT, ease: 'power2.out' }, FALL)
          // 3. Se recompone y se queda quieta. Aquí NO va un elástico.
          .to(letter, { scaleY: 1, scaleX: 1, duration: RISE, ease: 'power2.out' }, FALL + HIT);

        // Un ladrillo detrás de otro, no todos a la vez.
        timeline.add(brick, 0.25 + index * 0.075);
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

          <EmailButton />
        </div>
      </div>
    </section>
  );
}
