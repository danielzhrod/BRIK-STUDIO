'use client';

import { useEffect, useRef } from 'react';

import { BP, prefersReducedMotion } from '@/lib/gsap';

const COUNT_DESKTOP = 60;
const COUNT_MOBILE = 30;
/** Radio en el que el ratón empuja a las partículas. */
const REPEL_RADIUS = 150;
/** Distancia máxima para unir dos partículas con una línea. */
const LINK_DISTANCE = 100;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

/**
 * =====================================================================
 * CAMPO DE PARTÍCULAS — Canvas API puro, sin librerías
 * ---------------------------------------------------------------------
 * Puntos que flotan despacio, se apartan del ratón y se unen con líneas
 * finas cuando están cerca. Es el fondo vivo del hero.
 *
 * Decisiones de rendimiento:
 * - Canvas en vez de DOM: 60 nodos animados a 60fps hundirían el layout.
 * - El bucle se PARA cuando el hero sale de pantalla (IntersectionObserver),
 *   así no gasta batería mientras lees el resto de la página.
 * - Se ajusta a devicePixelRatio para verse nítido en pantallas retina.
 * =====================================================================
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Con "reducir movimiento" pintamos un fotograma quieto y salimos.
    const staticOnly = prefersReducedMotion();

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      // En el primer montaje el canvas puede medir 0 antes de que el
      // navegador resuelva el layout. Si dimensionáramos con 0, el lienzo
      // se quedaría vacío para siempre: salimos y esperamos al siguiente
      // aviso del ResizeObserver.
      if (!canvas.offsetWidth || !canvas.offsetHeight) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2); // tope 2: más no se nota
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < BP.mobile ? COUNT_MOBILE : COUNT_DESKTOP;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5, // velocidad 0.2-0.5 px/frame
        vy: (Math.random() - 0.5) * 0.5,
        radius: 1 + Math.random() * 2, // entre 1px y 3px
        alpha: 0.1 + Math.random() * 0.3, // opacidad entre 0.1 y 0.4
      }));
    };

    const draw = () => {
      if (!width || !height) return; // aún sin medidas válidas
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!staticOnly) {
          p.x += p.vx;
          p.y += p.vy;

          // --- Repulsión suave del ratón ---
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0) {
            // Cuanto más cerca, más fuerte el empujón.
            const force = (1 - dist / REPEL_RADIUS) * 1.6;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          // Rebote en los bordes para que nunca se escapen.
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
          p.x = Math.max(0, Math.min(width, p.x));
          p.y = Math.max(0, Math.min(height, p.y));
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();

        // --- Líneas entre partículas cercanas ---
        // Empieza en i+1 para no comprobar cada pareja dos veces.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            // Se desvanece conforme se separan.
            ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - d / LINK_DISTANCE)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      if (running && !staticOnly) frame = requestAnimationFrame(draw);
    };

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    draw();

    /*
      ResizeObserver en lugar de `window.onresize`.
      Dispara en cuanto el navegador conoce el tamaño real del elemento
      —incluido el primer layout, cuando `offsetWidth` todavía es 0— y
      además reacciona si el contenedor cambia de tamaño por cualquier
      motivo, no solo al redimensionar la ventana.
    */
    const observerResize = new ResizeObserver(() => {
      resize();
      // En modo estático no hay bucle de animación: repintamos a mano.
      if (staticOnly) draw();
    });
    observerResize.observe(canvas);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Pausa el bucle cuando el hero no está visible: ahorra batería.
    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running && !staticOnly) frame = requestAnimationFrame(draw);
        else cancelAnimationFrame(frame);
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      observerResize.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
