'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

/** A partir de este ancho consideramos "desktop" y activamos Lenis. */
const DESKTOP_BREAKPOINT = 1024;

/**
 * =====================================================================
 * SMOOTH SCROLL (Lenis)
 * ---------------------------------------------------------------------
 * Solo se activa en DESKTOP y con "reducir movimiento" desactivado.
 *
 * ¿Por que no en movil?
 * El scroll nativo del movil ya es suave, tiene inercia propia y esta
 * acelerado por hardware. Interceptarlo con JS empeora el rendimiento y
 * rompe gestos del sistema (pull-to-refresh, barra de direcciones).
 *
 * Ademas sincronizamos Lenis con GSAP: el scroll lo conduce el ticker de
 * GSAP para que ScrollTrigger y Lenis compartan el mismo frame y las
 * animaciones no vayan "un paso por detras".
 * =====================================================================
 */
export function SmoothScroll() {
  useEffect(() => {
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    if (!isDesktop || prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Curva exponencial: frena de forma natural al soltar la rueda.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Los gestos tactiles se dejan al navegador (ver comentario superior).
      touchMultiplier: 1,
    });

    // 1. Cada scroll de Lenis actualiza los ScrollTrigger.
    lenis.on('scroll', ScrollTrigger.update);

    // 2. El ticker de GSAP conduce el rAF de Lenis (un solo bucle de render).
    const raf = (time: number) => lenis.raf(time * 1000); // GSAP da segundos, Lenis pide ms
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 3. Los enlaces internos (#seccion) navegan con el scroll suave de Lenis.
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80 }); // -80px = alto del navbar
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
