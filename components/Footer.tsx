import { Github, Instagram, Linkedin, MessageCircle } from 'lucide-react';

import { NAV_LINKS, config, whatsappUrl } from '@/data/config';
import { Logo } from '@/components/Logo';

/**
 * Redes sociales. Solo se pintan las que tienen URL en `data/config.ts`,
 * asi que dejarlas vacias no rompe nada.
 */
const SOCIALS = [
  { href: config.linkedin, label: 'LinkedIn', icon: Linkedin },
  { href: config.instagram, label: 'Instagram', icon: Instagram },
  { href: config.github, label: 'GitHub', icon: Github },
].filter((social) => Boolean(social.href));

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* ---------- Marca ---------- */}
          <div className="max-w-xs">
            <a href="#inicio" className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-heading text-base font-bold tracking-tight text-foreground">
                {config.name}
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{config.tagline}.</p>
            <p className="mt-2 text-sm text-muted-foreground">{config.location}</p>
          </div>

          {/* ---------- Navegacion ---------- */}
          <nav aria-label="Pie de página">
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
              Secciones
            </h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Contacto ---------- */}
          <div>
            <h2 className="font-heading text-sm font-bold uppercase tracking-[0.14em] text-foreground">
              Contacto
            </h2>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-whatsapp transition-opacity duration-300 hover:opacity-80"
            >
              <MessageCircle className="h-4 w-4" />
              {config.whatsapp}
            </a>

            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="mt-3 block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {config.email}
              </a>
            )}

            {SOCIALS.length > 0 && (
              <ul className="mt-5 flex gap-2">
                {SOCIALS.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-300 hover:border-primary/50 hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            © {year} {config.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
