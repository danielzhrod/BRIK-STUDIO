'use client';

import { useEffect, useRef } from 'react';

import { BP, gsap, hasFinePointer, prefersReducedMotion } from '@/lib/gsap';

/** Distancia a la que un botón empieza a notar la atracción del ratón. */
const MAGNETIC_RADIUS = 80;
/** Cuánto se deja arrastrar el botón (0 = nada, 1 = pegado al ratón). */
const MAGNETIC_STRENGTH = 0.4;
/** Tope de desplazamiento para que nunca se despegue de su sitio. */
const MAGNETIC_MAX = 15;

/**
 * =====================================================================
 * CURSOR MAGNÉTICO
 * ---------------------------------------------------------------------
 * Dos capas:
 *   · punto de 8px que sigue al ratón sin retardo
 *   · círculo de 40px que lo persigue con lag suave
 *
 * Estados, marcados con `data-cursor` en cualquier elemento:
 *   (nada)            círculo 40px, borde blanco tenue
 *   data-cursor="link"    círculo 80px azul, mezcla `difference`
 *   data-cursor="project" círculo 120px con el texto "VER →" dentro
 *   al pulsar         escala 0.8 y vuelve
 *
 * Efecto magnético: cualquier elemento con `data-magnetic` se desplaza
 * hacia el ratón cuando este se acerca, y vuelve con rebote elástico.
 *
 * Se desactiva por completo en táctiles y con "reducir movimiento".
 * =====================================================================
 */
export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // --- ¿Debe activarse? ---
    const isTablet = window.innerWidth < BP.desktop;
    if (!hasFinePointer() || prefersReducedMotion() || window.innerWidth < BP.mobile) return;

    const dot = dotRef.current;
    const circle = circleRef.current;
    const label = labelRef.current;
    if (!dot || !circle || !label) return;

    // En tablet el cursor va más discreto (punto 6px, círculo 32px).
    const baseSize = isTablet ? 32 : 40;
    const dotSize = isTablet ? 6 : 8;

    /*
      El centrado se hace con xPercent/yPercent, NO con `-translate-x-1/2`
      de Tailwind. GSAP escribe la propiedad `transform` entera en cada
      frame, así que machacaría cualquier clase de translate y el cursor
      quedaría descolocado media anchura. xPercent sí se compone con x/y.
    */
    gsap.set(circle, { width: baseSize, height: baseSize, xPercent: -50, yPercent: -50 });
    gsap.set(dot, { width: dotSize, height: dotSize, xPercent: -50, yPercent: -50 });

    // Oculta el cursor nativo SOLO ahora que sabemos que el nuestro funciona.
    document.documentElement.classList.add('has-custom-cursor');
    gsap.set([dot, circle], { autoAlpha: 0 });

    /*
      `quickTo` crea una función de animación reutilizable y precompilada.
      Es bastante más eficiente que llamar a gsap.to() en cada movimiento
      del ratón, que ocurre decenas de veces por segundo.
    */
    const circleX = gsap.quickTo(circle, 'x', { duration: 0.15, ease: 'power2.out' });
    const circleY = gsap.quickTo(circle, 'y', { duration: 0.15, ease: 'power2.out' });

    let visible = false;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX: mx, clientY: my } = event;

      if (!visible) {
        visible = true;
        gsap.to([dot, circle], { autoAlpha: 1, duration: 0.3 });
      }

      // El punto va exacto al ratón; el círculo lo persigue con retardo.
      gsap.set(dot, { x: mx, y: my });
      circleX(mx);
      circleY(my);

      // --- Atracción magnética de los botones cercanos ---
      const magnets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
      magnets.forEach((magnet) => {
        const rect = magnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(mx - cx, my - cy);

        if (distance < rect.width / 2 + MAGNETIC_RADIUS) {
          // Dentro del radio: se desplaza hacia el ratón, con tope.
          const dx = gsap.utils.clamp(-MAGNETIC_MAX, MAGNETIC_MAX, (mx - cx) * MAGNETIC_STRENGTH);
          const dy = gsap.utils.clamp(-MAGNETIC_MAX, MAGNETIC_MAX, (my - cy) * MAGNETIC_STRENGTH);
          gsap.to(magnet, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        } else if (gsap.getProperty(magnet, 'x') !== 0) {
          // Fuera del radio: vuelve a su sitio con un rebote elástico.
          gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', overwrite: 'auto' });
        }
      });
    };

    // --- Cambios de estado según lo que haya bajo el ratón ---
    const applyState = (state: string | null) => {
      if (state === 'project') {
        gsap.to(circle, {
          width: 120,
          height: 120,
          borderColor: 'rgba(255,255,255,0)',
          backgroundColor: 'rgba(59,130,246,0.92)',
          mixBlendMode: 'normal',
          duration: 0.35,
          ease: 'power3.out',
        });
        gsap.to(label, { autoAlpha: 1, duration: 0.25 });
      } else if (state === 'link') {
        gsap.to(circle, {
          width: 80,
          height: 80,
          borderColor: 'rgba(255,255,255,0)',
          backgroundColor: '#3b82f6',
          mixBlendMode: 'difference',
          duration: 0.35,
          ease: 'power3.out',
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
      } else {
        gsap.to(circle, {
          width: baseSize,
          height: baseSize,
          borderColor: 'rgba(255,255,255,0.4)',
          backgroundColor: 'rgba(0,0,0,0)',
          mixBlendMode: 'normal',
          duration: 0.35,
          ease: 'power3.out',
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
      }
    };

    /*
      Delegación de eventos: un solo listener en el documento en lugar de
      uno por elemento. Así funciona también con elementos que aparezcan
      después, sin tener que re-registrar nada.
    */
    const onOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest?.('[data-cursor]');
      applyState(target?.getAttribute('data-cursor') ?? null);
    };

    const onDown = () => gsap.to(circle, { scale: 0.8, duration: 0.15, ease: 'power2.out' });
    const onUp = () => gsap.to(circle, { scale: 1, duration: 0.3, ease: 'power2.out' });

    // Al salir de la ventana, escondemos el cursor personalizado.
    const onLeave = () => {
      visible = false;
      gsap.to([dot, circle], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
      // Devuelve a su sitio cualquier botón que quedara desplazado.
      gsap.set('[data-magnetic]', { x: 0, y: 0 });
    };
  }, []);

  return (
    <>
      {/* Punto: sigue al ratón sin retardo */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full bg-white md:block"
      />
      {/* Círculo: persigue con lag y cambia de tamaño según el contexto */}
      <div
        ref={circleRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden items-center justify-center rounded-full border border-white/40 md:flex"
      >
        <span
          ref={labelRef}
          className="select-none text-[11px] font-semibold uppercase tracking-[0.18em] text-white opacity-0"
        >
          Ver →
        </span>
      </div>
    </>
  );
}
