import Image from 'next/image';

import { config, whatsappUrl } from '@/data/config';
import { PROJECTS, type Project } from '@/data/projects';
import { SERVICES, type Service } from '@/data/services';

/**
 * =====================================================================
 * ETAPAS
 * ---------------------------------------------------------------------
 * Las pantallas que se van sucediendo DENTRO de la ventana de navegador.
 *
 * Todas comparten la clase `.stage` (definida en globals.css):
 *   · en escritorio se apilan en el mismo sitio (`absolute inset-0`) y el
 *     scroll decide cuál se ve
 *   · en móvil pasan a flujo normal, una debajo de otra
 *
 * Son componentes de servidor: no llevan estado ni efectos. Toda la
 * lógica de scroll vive en `Showcase.tsx`, que las anima desde fuera.
 * =====================================================================
 */

/** Iconos de servicios. Los datos solo guardan la clave. */
const ICONS: Record<Service['icon'], JSX.Element> = {
  web: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 9h20" />
      <path d="M6 6.5h.01M9 6.5h.01" />
    </>
  ),
  shop: (
    <>
      <path d="M3 9h18l-1.5 11H4.5L3 9Z" />
      <path d="M8 9V6a4 4 0 0 1 8 0v3" />
    </>
  ),
};

/** Etapa 1 — portada de la sección de proyectos. */
export function StageProjectsIntro() {
  return (
    <div className="stage" data-stage="proyectos">
      <div className="w-full">
        <p className="eyebrow mb-6">Trabajo seleccionado</p>
        <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.95] tracking-tight text-white">
          Proyectos
        </h2>
        <p className="mt-8 max-w-lg text-lg leading-relaxed text-text-secondary">
          Webs reales, publicadas y en manos de sus clientes. Sigue bajando y entra en
          cualquiera de ellas.
        </p>
        <p className="mt-12 font-mono text-sm text-text-muted">
          <span className="text-white">01</span> /{' '}
          {String(PROJECTS.length).padStart(2, '0')}
        </p>
      </div>
    </div>
  );
}

/** Etapas 2 y 3 — un proyecto cada una. */
export function StageProject({ project }: { project: Project }) {
  return (
    <div className="stage" data-stage={`proyecto-${project.number}`}>
      <div className="grid w-full items-center gap-8 lg:grid-cols-[42%_58%] lg:gap-12">
        {/* --- Texto --- */}
        <div className="order-2 lg:order-1">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-accent-blue/40 bg-accent-blue/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-accent-blue">
              {project.type}
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em] text-text-muted">
              {project.industry} · {project.year}
            </span>
          </div>

          <h3 className="text-[clamp(1.75rem,3.5vw,3rem)] font-bold leading-tight tracking-tight text-white">
            {project.name}
          </h3>

          <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-text-secondary">
            {project.description}
          </p>

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

        {/* --- Captura --- */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="project"
          aria-label={`Ver ${project.name} en una pestaña nueva`}
          className="relative order-1 block h-[200px] overflow-hidden rounded-lg border border-white/10 lg:order-2 lg:h-[62%] lg:min-h-[300px]"
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover object-top"
          />
        </a>
      </div>
    </div>
  );
}

/** Etapa 4 — servicios. */
export function StageServices() {
  return (
    <div className="stage" data-stage="servicios">
      <div className="w-full">
        <p className="eyebrow mb-4">Qué hacemos</p>
        <h2 className="mb-10 text-[clamp(2rem,5vw,3.5rem)] font-black leading-none tracking-tight text-white">
          Servicios
        </h2>

        <div className="grid gap-10 md:grid-cols-2 md:gap-0">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              className={
                index === 1
                  ? 'md:border-l md:border-background-border md:pl-12'
                  : 'md:pr-12'
              }
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-5 w-5 text-accent-blue"
              >
                {ICONS[service.icon]}
              </svg>

              <h3 className="mt-5 text-[clamp(1.35rem,2.5vw,2rem)] font-bold leading-tight tracking-tight text-white">
                {service.title}
              </h3>

              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-text-secondary">
                {service.description}
              </p>

              <ul className="mt-6 space-y-2.5">
                {service.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm text-text-secondary">
                    {/* Guion en lugar de viñeta: más editorial */}
                    <span aria-hidden="true" className="text-text-muted">
                      —
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** La frase que se revela palabra a palabra en la etapa del estudio. */
const STATEMENT =
  'No hacemos webs bonitas. Hacemos webs que consiguen que suene el teléfono, que se llene la agenda y que la gente compre.';

/** Etapa 5 — el estudio. */
export function StageStudio() {
  return (
    <div className="stage" data-stage="estudio">
      <div className="w-full text-center">
        <p className="eyebrow mb-10">El estudio</p>
        <p
          data-statement
          className="mx-auto max-w-[820px] text-[clamp(1.4rem,3.2vw,2.75rem)] font-bold leading-[1.25] tracking-tight"
        >
          {STATEMENT.split(' ').map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="word inline-block opacity-20"
              style={{ color: '#4b5563' }}
            >
              {word}
              {/* Espacio real: los inline-block se lo comerían */}
              {' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/** Etapa 6 — contacto. */
export function StageContact() {
  return (
    <div className="stage" data-stage="contacto">
      <div className="w-full text-center">
        <h2 className="text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-tight text-white">
          ¿Hablamos?
        </h2>

        <p className="mx-auto mt-6 max-w-md text-lg text-text-secondary">
          Cuéntanos qué necesita tu negocio.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          data-cursor="link"
          className="mt-10 inline-flex animate-pulse-ring items-center gap-3 rounded-md bg-accent-whatsapp px-10 py-4 text-base font-bold text-background-primary transition-[filter,transform] duration-300 hover:scale-[1.02] hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Hola BRIK STUDIO
        </a>

        <p className="mt-8 text-sm text-text-muted">{config.whatsapp}</p>
        <p className="mt-2 text-sm text-text-muted">
          {config.email ? (
            <a href={`mailto:${config.email}`} data-cursor="link" className="hover:text-white">
              {config.email}
            </a>
          ) : (
            'Email disponible próximamente'
          )}
        </p>
      </div>
    </div>
  );
}
