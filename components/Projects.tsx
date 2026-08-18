'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { PROJECTS, type Project } from '@/data/projects';
import { gsap, MOTION, prefersReducedMotion, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * =====================================================================
 * PROYECTOS
 * ---------------------------------------------------------------------
 * Nada de rejilla. Cada proyecto ocupa casi todo el ancho y van apilados
 * con mucho aire entre ellos, para que se lean de uno en uno.
 *
 * El texto entra desde la izquierda y la imagen desde la derecha cuando
 * la tarjeta cruza el 80% del viewport. El contador de la cabecera va
 * marcando qué proyecto estás mirando.
 * =====================================================================
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(1);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // --- Cabecera de la sección ---
      gsap.fromTo(
        '[data-anim="head"]',
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: MOTION.duration,
          ease: MOTION.ease,
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        },
      );

      // --- Cada tarjeta ---
      const cards = gsap.utils.toArray<HTMLElement>('[data-project-card]');
      cards.forEach((card, index) => {
        const text = card.querySelector('[data-anim="text"]');
        const media = card.querySelector('[data-anim="media"]');

        gsap.fromTo(
          text,
          { x: -60, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: MOTION.duration,
            ease: MOTION.ease,
            scrollTrigger: { trigger: card, start: 'top 80%', once: true },
          },
        );

        gsap.fromTo(
          media,
          { x: 60, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: MOTION.duration,
            ease: MOTION.ease,
            scrollTrigger: { trigger: card, start: 'top 80%', once: true },
          },
        );

        // Actualiza el contador "01 / 02" según la tarjeta en pantalla.
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onToggle: (self) => {
            if (self.isActive) setCurrent(index + 1);
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const total = String(PROJECTS.length).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      className="scroll-mt-24 bg-background-primary py-section"
    >
      <div className="shell">
        {/* ---------- Cabecera ---------- */}
        <div data-anim="head" className="invisible mb-24 flex items-end justify-between gap-8">
          <div>
            <p className="eyebrow mb-6">Trabajo seleccionado</p>
            <h2 className="font-black text-h1 text-white">Proyectos</h2>
          </div>
          {/* Contador que cambia al hacer scroll */}
          <p className="shrink-0 pb-3 font-mono text-sm text-text-muted">
            <span className="text-white">{String(current).padStart(2, '0')}</span> / {total}
          </p>
        </div>

        {/* ---------- Tarjetas ---------- */}
        <div className="flex flex-col gap-[120px]">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-project-card
      className="group relative grid items-center gap-10 lg:grid-cols-[45%_55%] lg:gap-16"
    >
      {/* Número gigante de fondo. Sube de opacidad al pasar el ratón. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-0 select-none text-[96px] font-black leading-none text-white opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]"
      >
        {project.number}
      </span>

      {/* ---------- Texto ---------- */}
      <div data-anim="text" className="invisible relative z-10 order-2 lg:order-1">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-accent-blue/40 bg-accent-blue/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-accent-blue">
            {project.type}
          </span>
          <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
            {project.industry} · {project.year}
          </span>
        </div>

        <h3 className="text-h2 font-bold text-white transition-colors duration-300 group-hover:text-accent-blue">
          {project.name}
        </h3>

        <p className="mt-5 max-w-md text-base leading-[1.7] text-text-secondary">
          {project.description}
        </p>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          data-cursor="link"
          className="group/link mt-8 inline-flex items-center gap-3 text-sm font-semibold text-white"
        >
          Ver proyecto
          <span className="transition-transform duration-300 ease-smooth group-hover/link:translate-x-2">
            →
          </span>
        </a>

        {/* Línea que se despliega desde la izquierda al pasar el ratón */}
        <span
          aria-hidden="true"
          className="mt-10 block h-px w-full origin-left scale-x-0 bg-background-border transition-transform duration-700 ease-smooth group-hover:scale-x-100"
        />
      </div>

      {/*
        ---------- Imagen ----------
        Tres capas a propósito:
          · el <div> exterior lo anima GSAP (entrada lateral)
          · el <a> recorta con overflow-hidden y no se mueve
          · el <motion.div> interior hace el zoom del hover
        Si GSAP y Framer Motion escribieran sobre el MISMO elemento se
        pisarían la propiedad `transform` y el efecto saldría a trompicones.
      */}
      <div data-anim="media" className="invisible order-1 lg:order-2">
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="project"
          aria-label={`Ver ${project.name} en una pestaña nueva`}
          className="relative block h-[280px] overflow-hidden rounded-lg border border-white/10 lg:h-[500px]"
        >
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-top"
            />
          </motion.div>
        </a>
      </div>
    </article>
  );
}
