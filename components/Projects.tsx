'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { PROJECTS, type Project } from '@/data/projects';
import { gsap, MOTION, prefersReducedMotion, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * =====================================================================
 * PROYECTOS
 * ---------------------------------------------------------------------
 * En escritorio aquí NO hay imágenes: la captura de cada proyecto la
 * enseña <FloatingWindow>, que va cambiando de una a otra según por
 * dónde vayas. Esta columna se queda con lo que hay que leer.
 *
 * En móvil la ventana flotante no existe, así que cada tarjeta recupera
 * su captura en línea (`lg:hidden`).
 *
 * Cada proyecto ocupa casi una pantalla de alto: es lo que le da a la
 * ventana el recorrido que necesita para hacer su arco entre uno y otro.
 * =====================================================================
 */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, x: 0, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
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

      gsap.utils.toArray<HTMLElement>('[data-anim="card"]').forEach((card) => {
        gsap.fromTo(
          card,
          { x: -60, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: MOTION.duration,
            ease: MOTION.ease,
            scrollTrigger: { trigger: card, start: 'top 80%', once: true },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      className="relative scroll-mt-24 px-6 py-section md:px-10 lg:px-16 lg:pr-[50vw]"
    >
      <div data-anim="head" className="invisible mb-20 max-w-xl">
        <p className="eyebrow mb-6">Trabajo seleccionado</p>
        <h2 className="font-black text-h1 text-white">Proyectos</h2>
        <p className="mt-6 text-base leading-relaxed text-text-secondary">
          Webs reales, publicadas y en manos de sus clientes. Entra y compruébalo tú mismo.
        </p>
      </div>

      <div className="flex flex-col gap-24 lg:gap-[45vh]">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} isSecond={index === 1} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, isSecond }: { project: Project; isSecond: boolean }) {
  return (
    <article
      data-anim="card"
      // El segundo proyecto lleva su propio `id` para que la ventana
      // flotante tenga una referencia clara de dónde hacer el cambio.
      id={isSecond ? 'proyecto-2' : undefined}
      className="invisible group relative max-w-xl"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-14 left-0 select-none text-[96px] font-black leading-none text-white opacity-[0.08] transition-opacity duration-500 group-hover:opacity-[0.15]"
      >
        {project.number}
      </span>

      <div className="relative z-10">
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

        <p className="mt-5 text-base leading-[1.7] text-text-secondary">{project.description}</p>

        {/*
          Captura solo en móvil: en escritorio la enseña la ventana
          flotante, y repetirla aquí sería enseñar dos veces lo mismo.
        */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="project"
          aria-label={`Ver ${project.name} en una pestaña nueva`}
          className="relative mt-8 block h-[240px] overflow-hidden rounded-lg border border-white/10 lg:hidden"
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </a>

        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          data-cursor="link"
          className="group/link mt-8 inline-flex items-center gap-3 rounded bg-white px-7 py-3 text-sm font-semibold text-background-primary"
        >
          Ver proyecto en vivo
          <span className="transition-transform duration-300 ease-smooth group-hover/link:translate-x-1">
            →
          </span>
        </a>
      </div>
    </article>
  );
}
