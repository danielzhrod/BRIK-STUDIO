import { NAV_LINKS, config, whatsappUrl } from '@/data/config';
import { Logo } from '@/components/Logo';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-background-border bg-background-primary">
      <div className="shell flex flex-col gap-10 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <a href="#inicio" data-cursor="link" className="inline-block text-white">
            <Logo className="h-7" />
          </a>
          <p className="mt-4 text-sm text-text-muted">{config.location}</p>
        </div>

        <nav aria-label="Pie de página">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-cursor="link"
                  className="text-[13px] uppercase tracking-[0.12em] text-text-muted transition-colors duration-300 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="text-sm font-medium text-accent-whatsapp transition-opacity duration-300 hover:opacity-70"
        >
          {config.whatsapp}
        </a>
      </div>

      <div className="shell border-t border-background-border py-6">
        <p className="text-xs text-text-muted">
          © {year} {config.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
