'use client';

import { useRef } from 'react';

import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/** La frase que se revela palabra a palabra al hacer scroll. */
const STATEMENT =
  'No hacemos webs bonitas. Hacemos webs que consiguen que suene el teléfono, que se llene la agenda y que la gente compre.';

/**
 * =====================================================================
 * EL ESTUDIO
 * ---------------------------------------------------------------------
 * Una sola frase que se revela palabra a palabra conforme bajas.
 *
 * Va con `scrub`, o sea que el scroll controla la animación fotograma a
 * fotograma en lugar de dispararla y olvidarse: al subir, las palabras
 * se vuelven a apagar.
 * =====================================================================
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('.word'), { opacity: 1, color: '#ffffff' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to('.word', {
        opacity: 1,
        color: '#ffffff',
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-statement]',
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="estudio"
      className="relative scroll-mt-24 px-6 py-section md:px-10 lg:px-16 lg:pr-[50vw]"
    >
      <p className="eyebrow mb-10">El estudio</p>

      <p
        data-statement
        className="max-w-xl text-statement font-bold"
      >
        {STATEMENT.split(' ').map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="word inline-block opacity-20"
            style={{ color: '#4b5563' }}
          >
            {word}
            {/* Espacio real: los inline-block se lo comerían */}
            {' '}
          </span>
        ))}
      </p>
    </section>
  );
}
