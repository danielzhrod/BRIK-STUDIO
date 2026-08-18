'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/gsap';

/**
 * =====================================================================
 * SMOOTH SCROLL (Lenis)
 * ---------------------------------------------------------------------
 * Activo también en móvil: con esta versión el scroll suave mejora la
 * sensación general y no penaliza, porque los gestos táctiles se dejan
 * al navegador (`syncTouch: false`).
 *
 * La clave es que Lenis y GSAP compartan reloj: el ticker de GSAP mueve
 * el rAF de Lenis, y cada scroll de Lenis actualiza los ScrollTrigger.
 * Sin esto, las animaciones de scroll van siempre un frame por detrás.
 * =====================================================================
 */
export function SmoothScroll() {
  useEffect(() => {
    // Con "reducir movimiento" no interceptamos el scroll del sistema.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // 1. Cada scroll de Lenis refresca las posiciones de ScrollTrigger.
    lenis.on('scroll', ScrollTrigger.update);

    // 2. El ticker de GSAP conduce a Lenis (un único bucle de render).
    const raf = (time: number) => lenis.raf(time * 1000); // GSAP da segundos; Lenis pide ms
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 3. Los enlaces internos (#seccion) usan el scroll suave de Lenis.
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 }); // 80px = alto del navbar
    };

    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
