'use client';

import { useRef } from 'react';

import { SERVICES, type Service } from '@/data/services';
import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * Iconos como SVG en línea. Los datos guardan solo la clave (`'web'`),
 * así `data/services.ts` no necesita saber nada de React.
 */
const ICONS: Record<Service['icon'], JSX.Element> = {
  web: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20" />
      <path d="M6 6.5h.01M9 6.5h.01" />
    </>
  ),
  shop: (
    <>
      <path d="M3 9h18l-1.5 11H4.5L3 9Z" />
      <path d="M8 9V6a4 4 0 0 1 8 0v3" />
    </>
  ),
};

/**
 * =====================================================================
 * SERVICIOS
 * ---------------------------------------------------------------------
 * Dos columnas enormes separadas por una línea vertical. Entran desde
 * lados opuestos, con un pequeño desfase entre ellas.
 * =====================================================================
 */
export function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-anim="head"]',
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: MOTION.duration,
          ease: MOTION.ease,
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        },
      );

      // Cada bloque entra desde su lado: el primero por la izquierda,
      // el segundo por la derecha.
      const blocks = gsap.utils.toArray<HTMLElement>('[data-service]');
      blocks.forEach((block, index) => {
        gsap.fromTo(
          block,
          { x: index === 0 ? -60 : 60, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: MOTION.duration,
            ease: MOTION.ease,
            delay: index * 0.15,
            scrollTrigger: { trigger: block, start: 'top 80%', once: true },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="scroll-mt-24 bg-background-primary py-section"
    >
      <div className="shell">
        <div data-anim="head" className="invisible mb-20">
          <p className="eyebrow mb-6">Qué hacemos</p>
          <h2 className="font-black text-h1 text-white">Servicios</h2>
        </div>

        {/*
          La línea divisoria central es un borde izquierdo del segundo
          bloque, activo solo en escritorio. Así no hay ningún elemento
          decorativo suelto que estorbe al apilar en móvil.
        */}
        <div className="grid gap-16 md:grid-cols-2 md:gap-0">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              data-service
              data-anim
              className={`invisible relative ${
                index === 1 ? 'md:border-l md:border-background-border md:pl-16' : 'md:pr-16'
              }`}
            >
              {/* Número enorme de fondo */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-10 right-0 select-none text-[120px] font-black leading-none text-white opacity-[0.05]"
              >
                {service.number}
              </span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5 text-accent-blue"
              >
                {ICONS[service.icon]}
              </svg>

              <h3 className="relative mt-8 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
                {service.title}
              </h3>

              <p className="mt-5 max-w-md text-base leading-[1.7] text-text-secondary">
                {service.description}
              </p>

              <ul className="mt-10 space-y-4">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-4 text-[15px] text-text-secondary">
                    {/* Guion en lugar de viñeta: más editorial, menos plantilla */}
                    <span aria-hidden="true" className="text-text-muted">
                      —
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
