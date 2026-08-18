'use client';

import { useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Registro unico del plugin ScrollTrigger.
 * GSAP avisa por consola si se registra dos veces, por eso lo centralizamos
 * aqui y el resto de componentes importa desde este archivo.
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * useLayoutEffect avisa en SSR porque el servidor no pinta layout.
 * En el cliente queremos useLayoutEffect (evita parpadeo al animar).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Duraciones y curvas compartidas: nada de numeros magicos por ahi sueltos. */
export const MOTION = {
  /** Curva "premium": entra rapido, frena suave. */
  ease: 'power3.out',
  /** Fade de entrada al hacer scroll. */
  duration: 0.7,
  /** Desplazamiento vertical inicial de los elementos que aparecen. */
  distance: 32,
  /** Retardo entre hijos cuando se anima un grupo. */
  stagger: 0.09,
} as const;

/**
 * Comprueba si el usuario ha pedido reducir el movimiento en su sistema.
 * Si es asi, todas las animaciones se saltan y el contenido aparece fijo.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
