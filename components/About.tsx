'use client';

import { useRef } from 'react';

import { STATS } from '@/data/config';
import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/** La frase que se revela palabra a palabra al hacer scroll. */
const STATEMENT =
  'No hacemos webs bonitas. Hacemos webs que consiguen que suene el teléfono, que se llene la agenda y que la gente compre.';

/**
 * =====================================================================
 * ESTUDIO — declaración de intenciones
 * ---------------------------------------------------------------------
 * Fondo distinto (#111111) para romper el ritmo visual a mitad de página.
 *
 * El efecto principal es el "word reveal": las palabras van pasando de
 * gris apagado a blanco conforme avanzas con el scroll. Va con `scrub`,
 * o sea que el scroll controla la animación fotograma a fotograma en
 * lugar de dispararla y olvidarse.
 * =====================================================================
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('.word'), { autoAlpha: 1, color: '#ffffff' });
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // --- Revelado palabra a palabra, atado al scroll ---
      gsap.to('.word', {
        opacity: 1,
        color: '#ffffff',
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-statement]',
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: true,
        },
      });

      // --- Contadores de las tres cifras ---
      const counters = gsap.utils.toArray<HTMLElement>('[data-counter]');
      counters.forEach((counter) => {
        const target = Number(counter.dataset.counter ?? '0');
        // Objeto intermedio: GSAP anima su propiedad y nosotros la
        // volcamos al DOM redondeada en cada frame.
        const box = { value: 0 };

        gsap.to(box, {
          value: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: counter, start: 'top 85%', once: true },
          onUpdate: () => {
            counter.textContent = String(Math.round(box.value));
          },
        });
      });

      gsap.fromTo(
        '[data-anim="stats"]',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: MOTION.duration,
          ease: MOTION.ease,
          scrollTrigger: { trigger: '[data-anim="stats"]', start: 'top 85%', once: true },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="estudio"
      className="scroll-mt-24 bg-background-secondary py-section"
    >
      <div className="shell">
        <p className="eyebrow mb-16 text-center">El estudio</p>

        {/* ---------- Frase que se revela ---------- */}
        <p
          data-statement
          className="mx-auto max-w-[900px] text-center text-statement font-bold"
        >
          {STATEMENT.split(' ').map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="word inline-block opacity-20"
              style={{ color: '#4b5563' }}
            >
              {word}
              {/* Espacio real entre palabras: los inline-block lo comerían */}
              {' '}
            </span>
          ))}
        </p>

        {/* ---------- Cifras ---------- */}
        <div
          data-anim="stats"
          className="invisible mt-24 grid gap-12 border-t border-background-border pt-16 sm:grid-cols-3"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[clamp(2.5rem,6vw,4rem)] font-black leading-none text-white">
                {'prefix' in stat ? stat.prefix : ''}
                <span data-counter={stat.value}>0</span>
                {stat.suffix}
              </p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
