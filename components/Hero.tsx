'use client';

import { useRef } from 'react';
import { ArrowDown, MessageCircle, Sparkles } from 'lucide-react';

import { config, whatsappUrl } from '@/data/config';
import { PROJECTS } from '@/data/projects';
import { buttonVariants } from '@/components/ui/button';
import { gsap, MOTION, useIsomorphicLayoutEffect } from '@/lib/gsap';
import { cn } from '@/lib/utils';

/**
 * =====================================================================
 * HERO
 * ---------------------------------------------------------------------
 * Dos animaciones, ambas con GSAP:
 *
 * 1. ENTRADA — timeline en cascada al cargar (eyebrow -> titulo -> CTAs).
 * 2. PARALLAX — el fondo se desplaza mas despacio que el contenido al
 *    hacer scroll. Solo en escritorio (>=1024px) via `gsap.matchMedia`,
 *    que ademas revierte la animacion solo si se cruza el breakpoint.
 * =====================================================================
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // --- 1. Animacion de entrada (todos los dispositivos) ---
      // `no-preference` = el usuario NO ha pedido reducir el movimiento.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const targets = contentRef.current?.querySelectorAll('[data-hero-item]');
        if (!targets?.length) return;

        gsap.fromTo(
          targets,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: MOTION.ease,
            stagger: 0.11,
            delay: 0.15,
          },
        );
      });

      // Sin animacion: el contenido se ve directamente.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(contentRef.current?.querySelectorAll('[data-hero-item]') ?? [], {
          autoAlpha: 1,
          y: 0,
        });
      });

      // --- 2. Parallax (solo escritorio) ---
      // NUNCA en movil: el scroll con scrub penaliza mucho el rendimiento.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to(backgroundRef.current, {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6, // suaviza el seguimiento del scroll (nada de saltos)
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-[92svh] items-center overflow-hidden pb-20 pt-32 md:min-h-screen md:pt-36"
    >
      {/* ---------- Capa de fondo (la que hace el parallax) ---------- */}
      <div ref={backgroundRef} className="pointer-events-none absolute inset-0 -z-10 will-change-transform">
        {/* Rejilla tenue con desvanecido radial hacia los bordes */}
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,black,transparent)]" />
        {/* Halo de color de marca */}
        <div className="absolute left-1/2 top-[-18%] h-[560px] w-[min(1100px,120vw)] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        {/* Degradado de union con la seccion siguiente */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div ref={contentRef} className="container">
        <div className="max-w-3xl">
          <span
            data-hero-item
            className="invisible mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Estudio de diseño y desarrollo web
          </span>

          <h1
            data-hero-item
            className="invisible text-display-lg font-bold text-foreground"
          >
            {config.name}
          </h1>

          <p
            data-hero-item
            className="invisible mt-5 text-display-sm font-heading font-bold text-gradient"
          >
            {config.tagline}
          </p>

          <p
            data-hero-item
            className="invisible mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {config.subtitle}. Diseño limpio, carga rápida y todo pensado para que tus visitas se
            conviertan en clientes.
          </p>

          {/* ---------- CTAs ---------- */}
          <div data-hero-item className="invisible mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#proyectos" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'group')}>
              Ver nuestro trabajo
              {/* La flecha baja un poco al pasar el raton: refuerza "hay mas abajo". */}
              <ArrowDown className="transition-transform duration-300 ease-smooth group-hover:translate-y-1" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'lg' })}
            >
              <MessageCircle />
              Hablar por WhatsApp
            </a>
          </div>

          {/* ---------- Prueba social minima ---------- */}
          <dl
            data-hero-item
            className="invisible mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8"
          >
            <Stat value={`${PROJECTS.length}`} label="Proyectos publicados" />
            <Stat value="100%" label="Diseño a medida" />
            <Stat value="<2s" label="Tiempo de carga" />
          </dl>
        </div>
      </div>
    </section>
  );
}

/** Dato suelto del bloque de estadisticas del hero. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-heading text-2xl font-bold text-foreground">{value}</span>
        <span className="mt-1 block text-sm text-muted-foreground" aria-hidden="true">
          {label}
        </span>
      </dd>
    </div>
  );
}
