import { Gauge, PenTool, Target } from 'lucide-react';

import { config } from '@/data/config';
import { Reveal } from '@/components/Reveal';

/** Los tres principios que resumen la forma de trabajar del estudio. */
const PRINCIPLES = [
  {
    icon: PenTool,
    title: 'Diseño limpio',
    description: 'Nada sobra. Cada elemento está donde está por un motivo.',
  },
  {
    icon: Gauge,
    title: 'Funcionalidad',
    description: 'Webs rápidas, que se ven bien en cualquier móvil y no se rompen.',
  },
  {
    icon: Target,
    title: 'Conversión',
    description: 'El objetivo no es una web bonita: es que te lleguen más clientes.',
  },
];

/**
 * =====================================================================
 * SOBRE NOSOTROS
 * ---------------------------------------------------------------------
 * Server Component: es contenido estatico, no necesita JavaScript en el
 * navegador. Solo `Reveal` (cliente) se encarga de la animacion.
 * =====================================================================
 */
export function About() {
  return (
    <section id="nosotros" className="relative overflow-hidden bg-surface/40">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          {/* ---------- Texto ---------- */}
          <Reveal>
            <p className="section-eyebrow">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              Sobre nosotros
            </p>
            <h2 className="section-title">Un estudio pequeño, muy cerca de tu negocio</h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
              <p>{config.description}</p>
              <p>
                Somos {config.name}, un estudio pequeño y por eso mismo cercano: hablas siempre con
                la persona que diseña y programa tu web, sin intermediarios ni departamentos.
                Trabajamos sobre todo con negocios locales —clínicas, salones, tiendas de barrio— que
                necesitan una presencia online seria sin complicarse la vida.
              </p>
              <p>
                Antes de tocar una línea de código nos sentamos a entender a quién quieres llegar y
                qué necesitas que pase cuando alguien entra en tu web: que te llame, que reserve cita
                o que compre. Todo lo demás son decisiones al servicio de eso.
              </p>
            </div>
          </Reveal>

          {/* ---------- Principios ---------- */}
          <Reveal stagger className="flex flex-col gap-4 lg:pt-16">
            {PRINCIPLES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex gap-5 rounded-lg border border-border bg-background/60 p-6 transition-colors duration-500 hover:border-primary/40"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
