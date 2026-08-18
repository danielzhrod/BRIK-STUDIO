import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';

import { config, whatsappUrl } from '@/data/config';
import { buttonVariants } from '@/components/ui/button';
import { ContactForm } from '@/components/ContactForm';
import { Reveal } from '@/components/Reveal';
import { cn } from '@/lib/utils';

/**
 * =====================================================================
 * CONTACTO
 * ---------------------------------------------------------------------
 * WhatsApp es el CTA principal: boton grande, verde y con un `pulse`
 * suave que lo mantiene como el elemento mas visible de la seccion.
 * El formulario de email queda como alternativa secundaria.
 * =====================================================================
 */
export function Contact() {
  return (
    <section id="contacto" className="relative overflow-hidden">
      {/* Halo de color detras de la seccion final */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[min(900px,110vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="section-shell">
        <Reveal className="text-center">
          <p className="section-eyebrow justify-center">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            Contacto
          </p>
          <h2 className="section-title">¿Hablamos?</h2>
          <p className="section-subtitle mx-auto text-center">
            Cuéntanos qué necesita tu negocio. Te respondemos rápido, en cristiano y sin compromiso.
          </p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          {/* ---------------- WhatsApp (canal principal) ---------------- */}
          <Reveal className="flex flex-col gap-6">
            <div className="rounded-lg border border-whatsapp/30 bg-whatsapp/5 p-8">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp/15 text-whatsapp">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>

              <h3 className="mt-5 font-heading text-xl font-bold text-foreground">
                Escríbenos por WhatsApp
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                La vía más rápida. Normalmente contestamos el mismo día.
              </p>

              {/*
                `animate-pulse-ring` dibuja un halo verde que se expande y
                se desvanece cada 2,4s. Es sutil, no parpadea y se apaga
                solo si el usuario tiene "reducir movimiento" activado.
              */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: 'whatsapp', size: 'lg' }),
                  'mt-6 w-full animate-pulse-ring hover:scale-[1.02]',
                )}
              >
                <MessageCircle />
                {config.whatsapp}
              </a>
            </div>

            {/* ---------------- Datos sueltos ---------------- */}
            <ul className="space-y-4">
              <InfoRow icon={Clock} label="Respuesta" value="Menos de 24 horas laborables" />
              <InfoRow icon={MapPin} label="Dónde estamos" value={config.location} />
              {/* El bloque de email solo aparece cuando config.email tiene valor. */}
              {config.email ? (
                <InfoRow icon={Mail} label="Email" value={config.email} href={`mailto:${config.email}`} />
              ) : (
                <InfoRow icon={Mail} label="Email" value="Disponible próximamente" muted />
              )}
            </ul>
          </Reveal>

          {/* ---------------- Formulario (canal secundario) ---------------- */}
          <Reveal>
            <div className="rounded-lg border border-border bg-surface p-8">
              <h3 className="font-heading text-xl font-bold text-foreground">
                O déjanos un mensaje
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Si prefieres el correo, rellena esto y te escribimos nosotros.
              </p>

              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Fila de informacion de contacto: icono + etiqueta + valor. */
function InfoRow({
  icon: Icon,
  label,
  value,
  href,
  muted = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  muted?: boolean;
}) {
  const content = (
    <>
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            'mt-0.5 block text-sm font-medium',
            muted ? 'text-muted-foreground' : 'text-foreground',
          )}
        >
          {value}
        </span>
      </span>
    </>
  );

  return (
    <li>
      {href ? (
        <a href={href} className="flex items-center gap-4 transition-opacity hover:opacity-80">
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}
