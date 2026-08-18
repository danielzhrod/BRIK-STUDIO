'use client';

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';

import { PROJECTS, type Project } from '@/data/projects';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

/** Curva compartida por todas las transiciones de hover. */
const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;
const HOVER_TRANSITION = { duration: 0.45, ease: EASE_SMOOTH };

/**
 * ---------------------------------------------------------------------
 * VARIANTES DE HOVER (Framer Motion)
 * ---------------------------------------------------------------------
 * La tarjeta declara `whileHover="hover"` una sola vez y TODOS los hijos
 * heredan ese estado. Asi la subida, el zoom, el oscurecido y el boton
 * arrancan en el mismo frame: cero desincronizacion, cero jitter.
 */
const cardVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -10 }, // la tarjeta sube 10px
};

const imageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 }, // zoom ligero de la imagen
};

const overlayVariants: Variants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 }, // velo oscuro suave
};

const ctaVariants: Variants = {
  rest: { opacity: 0, y: 10 },
  hover: { opacity: 1, y: 0 }, // el CTA emerge desde abajo
};

/**
 * =====================================================================
 * PROYECTOS — la seccion mas importante del portafolio
 * ---------------------------------------------------------------------
 * Rejilla responsive:
 *   Movil   -> 1 columna, tarjetas verticales grandes
 *   Tablet  -> 1 columna (mas ancha)
 *   Desktop -> 2 columnas
 * =====================================================================
 */
export function Projects() {
  return (
    <section id="proyectos" className="section-shell">
      <Reveal>
        <p className="section-eyebrow">
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          Portafolio
        </p>
        <h2 className="section-title">Proyectos que ya están funcionando</h2>
        <p className="section-subtitle">
          Webs reales, publicadas y en manos de sus clientes. Entra y compruébalo tú mismo.
        </p>
      </Reveal>

      {/* `stagger` hace que las tarjetas aparezcan una detras de otra. */}
      <Reveal stagger className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-10">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Reveal>
    </section>
  );
}

/**
 * Tarjeta individual de proyecto.
 *
 * Accesibilidad: toda la tarjeta es un enlace, y el `<span>` que envuelve
 * el titulo lleva `after:absolute inset-0` para que el area clicable cubra
 * la tarjeta entera sin anidar enlaces (patron "stretched link").
 */
function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.99 }} // feedback tactil al pulsar, tambien en movil
      variants={cardVariants}
      transition={HOVER_TRANSITION}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-card transition-[border-color,box-shadow] duration-500 ease-smooth hover:border-primary/40 hover:shadow-card-hover"
    >
      {/* ---------------- Vista previa ---------------- */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
        <motion.div variants={imageVariants} transition={HOVER_TRANSITION} className="h-full w-full">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            // Ancho real que ocupa la imagen en cada breakpoint, para que el
            // navegador descargue la resolucion justa. Por debajo de 1024px
            // la rejilla es de UNA columna, asi que ocupa el ancho completo.
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover object-top"
            // Las dos tarjetas estan muy arriba: las cargamos con prioridad.
            priority={project.id <= 2}
          />
        </motion.div>

        {/* Velo oscuro que aparece al pasar el raton */}
        <motion.div
          variants={overlayVariants}
          transition={HOVER_TRANSITION}
          className="pointer-events-none absolute inset-0 bg-black/45"
          aria-hidden="true"
        />

        {/* Año, esquina superior derecha */}
        <div className="absolute right-4 top-4">
          <Badge variant="solid">{project.year}</Badge>
        </div>

        {/*
          CTA flotante SOLO en escritorio (lg+): en movil no existe el hover,
          asi que alli usamos el enlace fijo del pie de la tarjeta.
        */}
        <motion.span
          variants={ctaVariants}
          transition={HOVER_TRANSITION}
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-center justify-center p-6 lg:flex"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-solid px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow">
            Ver proyecto en vivo
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </motion.span>
      </div>

      {/* ---------------- Contenido ---------------- */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{project.type}</Badge>
          <Badge>{project.industry}</Badge>
        </div>

        <h3 className="mt-5 font-heading text-2xl font-bold tracking-tight text-foreground">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            // "stretched link": el ::after invisible convierte toda la
            // tarjeta en zona clicable sin anidar etiquetas <a>.
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.name}
            <span className="sr-only"> — abrir proyecto en una pestaña nueva</span>
          </a>
        </h3>

        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {highlight}
            </li>
          ))}
        </ul>

        {/* Enlace visible siempre (imprescindible en movil, donde no hay hover). */}
        <span
          className={cn(
            // `mt-auto` empuja el enlace al fondo: las dos tarjetas acaban igual.
            'mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-primary',
            'border-t border-border transition-colors duration-300 group-hover:text-primary',
          )}
        >
          Ver proyecto en vivo
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.article>
  );
}
