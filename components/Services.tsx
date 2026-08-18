'use client';

import { motion } from 'framer-motion';
import { Check, Globe, Store, type LucideIcon } from 'lucide-react';

import { SERVICES, PROCESS_STEPS, type Service } from '@/data/services';
import { Card } from '@/components/ui/card';
import { Reveal } from '@/components/Reveal';

/**
 * Mapa de iconos: los datos guardan una clave (`'globe'`) y aqui la
 * traducimos al componente real. Asi `data/services.ts` queda libre de
 * imports de React y se puede editar sin tocar codigo.
 */
const ICON_MAP: Record<Service['icon'], LucideIcon> = {
  globe: Globe,
  store: Store,
};

/**
 * =====================================================================
 * SERVICIOS — dos columnas en escritorio, apiladas en movil
 * =====================================================================
 */
export function Services() {
  return (
    <section id="servicios" className="relative section-shell">
      <Reveal>
        <p className="section-eyebrow">
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          Servicios
        </p>
        <h2 className="section-title">Qué hacemos</h2>
        <p className="section-subtitle">
          Dos servicios, hechos a fondo. Sin paquetes infinitos ni letra pequeña.
        </p>
      </Reveal>

      <Reveal stagger className="mt-14 grid gap-6 md:grid-cols-2 md:gap-8">
        {SERVICES.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </Reveal>

      {/* ---------- Proceso de trabajo ---------- */}
      <Reveal className="mt-20">
        <h3 className="font-heading text-display-sm text-foreground">Cómo trabajamos</h3>
      </Reveal>

      <Reveal stagger className="mt-8 grid gap-6 sm:grid-cols-3">
        {PROCESS_STEPS.map((item) => (
          <div key={item.step} className="border-t border-border pt-6">
            <span className="font-heading text-sm font-bold tracking-[0.2em] text-primary">
              {item.step}
            </span>
            <h4 className="mt-3 font-heading text-lg font-bold text-foreground">{item.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = ICON_MAP[service.icon];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Card className="group h-full p-8 transition-colors duration-500 ease-smooth hover:border-primary/40 md:p-10">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-surface-elevated text-primary transition-colors duration-500 group-hover:border-primary/50 group-hover:bg-primary/10">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          {service.tagline}
        </p>
        <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground">
          {service.title}
        </h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{service.description}</p>

        <ul className="mt-7 space-y-3 border-t border-border pt-7">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
}
