'use client';

import { useRef } from 'react';

import { SERVICES, type Service } from '@/data/services';
import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/** Iconos. Los datos solo guardan la clave. */
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
 * Los dos servicios van uno debajo del otro, separados por una línea.
 * Antes iban en dos columnas, pero ahora la mitad derecha la ocupa la
 * ventana flotante: meter dos columnas en la mitad que queda dejaría las
 * listas de beneficios en tiras de texto demasiado estrechas.
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

      gsap.utils.toArray<HTMLElement>('[data-anim="service"]').forEach((block, index) => {
        gsap.fromTo(
          block,
          { x: -50, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: MOTION.duration,
            ease: MOTION.ease,
            delay: index * 0.12,
            scrollTrigger: { trigger: block, start: 'top 82%', once: true },
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
      className="relative scroll-mt-24 px-6 py-section md:px-10 lg:px-16 lg:pr-[50vw]"
    >
      <div data-anim="head" className="invisible mb-16 max-w-xl">
        <p className="eyebrow mb-6">Qué hacemos</p>
        <h2 className="font-black text-h1 text-white">Servicios</h2>
      </div>

      <div className="flex max-w-xl flex-col gap-14">
        {SERVICES.map((service, index) => (
          <div
            key={service.id}
            data-anim="service"
            className={`invisible relative ${index === 1 ? 'border-t border-background-border pt-14' : ''}`}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 right-0 select-none text-[100px] font-black leading-none text-white opacity-[0.05]"
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

            <h3 className="relative mt-6 text-[clamp(1.75rem,3.5vw,2.5rem)] font-bold leading-tight tracking-tight text-white">
              {service.title}
            </h3>

            <p className="mt-4 text-base leading-[1.7] text-text-secondary">{service.description}</p>

            <ul className="mt-7 space-y-3">
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
    </section>
  );
}
