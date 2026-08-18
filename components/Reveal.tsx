'use client';

import { useRef, type ElementType, type ReactNode } from 'react';

import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Etiqueta HTML a renderizar. Por defecto un <div>. */
  as?: ElementType;
  /** Retardo extra en segundos antes de empezar la animacion. */
  delay?: number;
  /**
   * Si es `true`, anima los hijos directos uno detras de otro (efecto cascada)
   * en lugar de animar el contenedor completo como un bloque.
   */
  stagger?: boolean;
}

/**
 * =====================================================================
 * REVEAL — animacion de entrada al hacer scroll (GSAP ScrollTrigger)
 * ---------------------------------------------------------------------
 * Envuelve cualquier bloque y lo hace aparecer con fade-in + slide-up
 * cuando entra en pantalla.
 *
 *   <Reveal><h2>Hola</h2></Reveal>
 *   <Reveal stagger>{items.map(...)}</Reveal>
 *
 * Detalles importantes:
 * - `gsap.context()` limpia todos los tweens y ScrollTriggers al desmontar,
 *   evitando fugas de memoria al navegar.
 * - Si el usuario tiene "reducir movimiento" activado no se anima nada:
 *   el contenido se muestra directamente.
 * - `once: true` -> la animacion ocurre una sola vez, no al volver a subir.
 * =====================================================================
 */
export function Reveal({ children, className, as: Tag = 'div', delay = 0, stagger = false }: RevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Accesibilidad: sin movimiento, contenido visible y salimos.
    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      gsap.set(el.children, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Con `stagger` animamos los hijos; si no, el contenedor entero.
      const targets = stagger ? (Array.from(el.children) as HTMLElement[]) : el;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: MOTION.distance },
        {
          autoAlpha: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          delay,
          stagger: stagger ? MOTION.stagger : 0,
          scrollTrigger: {
            trigger: el,
            // Se dispara cuando el 88% superior del viewport alcanza el elemento.
            start: 'top 88%',
            once: true,
          },
        },
      );
    }, el);

    // Nota: NO llamamos aqui a ScrollTrigger.refresh(). Hay ~10 <Reveal> en
    // la pagina y refrescar en cada uno recalcularia todos los triggers una
    // decena de veces al cargar. ScrollTrigger ya se refresca solo al evento
    // `load` y al redimensionar, que es justo cuando cambia el layout.
    return () => ctx.revert();
  }, [delay, stagger]);

  return (
    // `invisible` inicial evita el "flash" del contenido antes de animar.
    // GSAP lo pasa a visible con autoAlpha en cuanto arranca.
    <Tag ref={containerRef} className={cn('invisible', className)}>
      {children}
    </Tag>
  );
}
