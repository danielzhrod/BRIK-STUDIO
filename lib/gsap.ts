'use client';

import { useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

/** Registro único del plugin. GSAP avisa por consola si se registra dos veces. */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

/**
 * useLayoutEffect avisa en SSR porque el servidor no pinta layout.
 * En cliente sí lo queremos: evita el parpadeo antes de animar.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Constantes de movimiento compartidas: nada de números mágicos sueltos. */
export const MOTION = {
  ease: 'power3.out',
  easeStrong: 'power4.out',
  duration: 0.9,
  stagger: 0.06,
} as const;

/** Breakpoints usados por la lógica de JS (deben coincidir con Tailwind). */
export const BP = {
  mobile: 768,
  desktop: 1024,
} as const;

/** ¿El usuario ha pedido reducir el movimiento en su sistema? */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * ¿Es un dispositivo con ratón de verdad?
 * `pointer: fine` distingue un ratón/trackpad de un dedo. Es mucho más
 * fiable que mirar solo el ancho de pantalla: hay portátiles táctiles y
 * tablets grandes donde el cursor personalizado estorbaría.
 */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: fine)').matches;
}

export { gsap, ScrollTrigger, MotionPathPlugin };
