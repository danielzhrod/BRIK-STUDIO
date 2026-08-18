'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { PROJECTS } from '@/data/projects';
import { BP, gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/** Cada cuántos ms cambia la web que se ve dentro del navegador. */
const SLIDE_INTERVAL = 4000;
/** Inclinación máxima que añade el ratón, en grados. */
const TILT_MAX = 5;

/**
 * =====================================================================
 * MOCKUP DE NAVEGADOR
 * ---------------------------------------------------------------------
 * Un marco de navegador que va alternando las webs del portafolio.
 *
 * Tres capas de movimiento, todas solo en escritorio:
 *   1. Rotación 3D fija de base: rotateY(-8deg) rotateX(4deg)
 *   2. Inclinación que sigue al ratón, hasta ±5deg
 *   3. Parallax al hacer scroll: se desplaza más lento que el resto
 *
 * En móvil se queda plano y quieto: el 3D con scrub es lo más caro de
 * animar y ahí no aporta nada.
 * =====================================================================
 */
export function BrowserMockup() {
  const [active, setActive] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // --- Carrusel automático entre proyectos ---
  useEffect(() => {
    if (prefersReducedMotion() || PROJECTS.length < 2) return;
    const id = setInterval(() => {
      setActive((current) => (current + 1) % PROJECTS.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  // --- Inclinación 3D y parallax ---
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const frame = frameRef.current;
    if (!wrapper || !frame) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(`(min-width: ${BP.desktop}px) and (prefers-reduced-motion: no-preference)`, () => {
        // Postura de base: ligeramente girado, como una maqueta sobre la mesa.
        gsap.set(frame, { rotateY: -8, rotateX: 4 });

        const rotY = gsap.quickTo(frame, 'rotateY', { duration: 0.7, ease: 'power3.out' });
        const rotX = gsap.quickTo(frame, 'rotateX', { duration: 0.7, ease: 'power3.out' });

        const onMouseMove = (event: MouseEvent) => {
          // Posición del ratón normalizada a un rango de -1 a 1.
          const nx = (event.clientX / window.innerWidth) * 2 - 1;
          const ny = (event.clientY / window.innerHeight) * 2 - 1;
          rotY(-8 + nx * TILT_MAX);
          rotX(4 - ny * TILT_MAX);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        // Parallax: el mockup sube más despacio que el texto al hacer scroll.
        const parallax = gsap.to(wrapper, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

        return () => {
          window.removeEventListener('mousemove', onMouseMove);
          parallax.scrollTrigger?.kill();
          parallax.kill();
        };
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="perspective w-full will-change-transform">
      <div
        ref={frameRef}
        className="preserve-3d relative w-full overflow-hidden rounded-xl border border-white/10 bg-background-card shadow-[0_40px_120px_-30px_rgba(59,130,246,0.45)]"
      >
        {/* --- Barra superior del navegador --- */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#161616] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          {/* Barra de dirección: muestra el dominio del proyecto visible */}
          <div className="ml-3 flex-1 truncate rounded bg-black/40 px-3 py-1 text-[11px] text-text-muted">
            {PROJECTS[active].link.replace('https://', '')}
          </div>
        </div>

        {/* --- Ventana con las capturas en crossfade --- */}
        <div className="relative aspect-[16/10] w-full bg-black">
          {PROJECTS.map((project, index) => (
            <div
              key={project.id}
              className="absolute inset-0 transition-opacity duration-[800ms] ease-smooth"
              style={{ opacity: index === active ? 1 : 0 }}
              // Solo el visible se anuncia a los lectores de pantalla.
              aria-hidden={index !== active}
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover object-top"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* --- Indicadores de qué web se está viendo --- */}
      <div className="mt-5 flex items-center gap-2">
        {PROJECTS.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setActive(index)}
            data-cursor="link"
            aria-label={`Ver ${project.name} en la vista previa`}
            aria-current={index === active}
            className="group h-8 py-3"
          >
            <span
              className={`block h-[2px] transition-all duration-500 ease-smooth ${
                index === active ? 'w-12 bg-accent-blue' : 'w-6 bg-white/20 group-hover:bg-white/40'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-[11px] uppercase tracking-[0.2em] text-text-muted">
          {PROJECTS[active].name}
        </span>
      </div>
    </div>
  );
}
