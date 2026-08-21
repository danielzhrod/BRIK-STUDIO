'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

import {
  MIN_FILL_SECONDS,
  THROTTLE_SECONDS,
  contactSchema,
} from '@/lib/validation';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'error';
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

/**
 * Clave de Web3Forms.
 *
 * CÓMO CONSEGUIRLA (tarda un minuto y es gratis):
 *   1. Entra en https://web3forms.com
 *   2. Escribe brikstudio@hotmail.com en «Create Access Key»
 *   3. Te llega la clave por correo
 *   4. Pégala en `.env.local`:  NEXT_PUBLIC_WEB3FORMS_KEY=tu_clave
 *   5. En Vercel: Settings → Environment Variables, la misma variable
 *
 * El correo de destino NO viaja en el navegador: Web3Forms lo tiene
 * asociado a la clave en su panel. Por eso aquí no aparece la dirección.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';
const ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * =====================================================================
 * FORMULARIO DE CONTACTO
 * ---------------------------------------------------------------------
 * Envía de verdad, a través de Web3Forms (sin servidor propio).
 *
 * CUATRO CAPAS DE FILTRO, en este orden:
 *   1. Formato        — Zod: nombre, email estricto, longitud del mensaje
 *   2. Contenido      — lista de términos ofensivos multiidioma
 *   3. Anti-robot     — campo trampa, tiempo mínimo de relleno, espera
 *                       entre envíos y tope de enlaces
 *   4. Accesibilidad  — errores anunciados con `aria-live`
 *
 * Los contadores de tiempo viven en `useRef`, NO en almacenamiento del
 * navegador: no hace falta que sobrevivan a una recarga y así el
 * componente no toca `localStorage`.
 * =====================================================================
 */
export function ContactForm({ variant = 'page' }: { variant?: 'page' | 'window' }) {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState('');

  const formRef = useRef<HTMLFormElement>(null);
  /** Momento en que se montó el formulario, para el tiempo mínimo. */
  const mountedAt = useRef(Date.now());
  /** Último envío correcto, para la espera entre mensajes. */
  const lastSentAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const compact = variant === 'window';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('');

    // Referencia guardada ya: tras un `await`, React deja `currentTarget`
    // a null y no podríamos vaciar el formulario.
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    };

    /* --- Capa 3: robots ------------------------------------------- */

    // Campo trampa. Si viene relleno, fingimos que todo ha ido bien: al
    // robot no le damos ninguna pista de que le hemos calado.
    if (String(data.get('honeypot') ?? '') || String(data.get('botcheck') ?? '')) {
      setStatus('success');
      form.reset();
      return;
    }

    // Nadie rellena tres campos en menos de tres segundos.
    const seconds = (Date.now() - mountedAt.current) / 1000;
    if (seconds < MIN_FILL_SECONDS) {
      setStatus('success');
      form.reset();
      return;
    }

    // Espera entre envíos.
    const sinceLast = (Date.now() - lastSentAt.current) / 1000;
    if (lastSentAt.current && sinceLast < THROTTLE_SECONDS) {
      setStatus('error');
      setNotice('Espera unos segundos antes de enviar otro mensaje.');
      return;
    }

    /* --- Capas 1 y 2: formato y contenido -------------------------- */

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fields = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fields.name?.[0],
        email: fields.email?.[0],
        message: fields.message?.[0],
      });
      setStatus('error');
      setNotice('Revisa los campos marcados.');
      return;
    }

    setErrors({});

    if (!WEB3FORMS_KEY) {
      setStatus('error');
      setNotice(
        'El envío todavía no está configurado. Escríbenos por WhatsApp y te respondemos al momento.',
      );
      return;
    }

    /* --- Envío ----------------------------------------------------- */

    setStatus('sending');

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          ...parsed.data,
          subject: 'Nuevo contacto desde BRIK STUDIO',
          from_name: 'Web BRIK STUDIO',
          // Campo anti-spam propio de Web3Forms: vacío = persona.
          botcheck: '',
        }),
      });

      const result = await response.json().catch(() => ({ success: false }));

      if (!response.ok || !result.success) {
        setStatus('error');
        setNotice('No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.');
        return;
      }

      lastSentAt.current = Date.now();
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setNotice('No se pudo enviar. Inténtalo de nuevo o escríbenos por WhatsApp.');
    }
  }

  /* --- Pantalla de éxito ------------------------------------------ */
  if (status === 'success') {
    return (
      <div
        role="status"
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-accent-whatsapp/40 bg-accent-whatsapp/10 text-center',
          compact ? 'h-full p-6' : 'p-10',
        )}
      >
        <p className="text-lg font-bold text-white">✓ Mensaje enviado</p>
        <p className="mt-2 text-sm text-text-secondary">Te responderemos pronto.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          data-cursor="link"
          className="mt-5 text-sm font-semibold text-accent-blue underline-offset-4 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputClass = cn(
    'w-full rounded-md border bg-black/30 text-white placeholder:text-text-muted',
    'transition-colors duration-200 focus:border-accent-blue focus:outline-none focus:ring-2 focus:ring-accent-blue/30',
    compact ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base',
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className={compact ? 'space-y-3' : 'space-y-5'}>
      <Field label="Nombre" error={errors.name} compact={compact}>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Cómo te llamas"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'cf-name-error' : undefined}
          className={cn(inputClass, errors.name ? 'border-red-500/70' : 'border-background-border')}
        />
      </Field>

      <Field label="Email" error={errors.email} compact={compact}>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'cf-email-error' : undefined}
          className={cn(inputClass, errors.email ? 'border-red-500/70' : 'border-background-border')}
        />
      </Field>

      <Field label="Mensaje" error={errors.message} compact={compact}>
        <textarea
          id="cf-message"
          name="message"
          rows={compact ? 3 : 5}
          placeholder="Cuéntanos qué necesita tu negocio"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'cf-message-error' : undefined}
          className={cn(
            inputClass,
            'resize-none',
            errors.message ? 'border-red-500/70' : 'border-background-border',
          )}
        />
      </Field>

      {/*
        Campo trampa. Fuera de pantalla en lugar de `display: none`: hay
        robots que ignoran los campos ocultos con display, pero rellenan
        cualquier input que encuentren en el DOM.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="cf-honeypot">No rellenes esto</label>
        <input id="cf-honeypot" type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
        <input type="checkbox" name="botcheck" tabIndex={-1} />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        data-magnetic
        data-cursor="link"
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md bg-white font-semibold text-background-primary',
          'transition-[filter,opacity] duration-300 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60',
          compact ? 'w-full px-5 py-2.5 text-sm' : 'px-8 py-3.5 text-[15px]',
        )}
      >
        {status === 'sending' ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-background-primary/30 border-t-background-primary"
            />
            Enviando…
          </>
        ) : (
          'Enviar mensaje'
        )}
      </button>

      {/*
        Zona de estado. `aria-live="polite"` hace que un lector de pantalla
        lea el mensaje en cuanto aparece, sin interrumpir lo que esté
        diciendo. Ocupa sitio siempre para que el error no descoloque el
        formulario dentro del marco del Mac.
      */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'min-h-[1.25rem] text-xs',
          status === 'error' ? 'text-red-400' : 'text-text-muted',
        )}
      >
        {notice}
      </p>
    </form>
  );
}

/** Etiqueta + control + error del campo. */
function Field({
  label,
  error,
  compact,
  children,
}: {
  label: string;
  error?: string;
  compact: boolean;
  children: React.ReactElement<{ id?: string }>;
}) {
  const id = children.props.id;

  return (
    <div>
      <label
        htmlFor={id}
        className={cn('mb-1.5 block font-medium text-text-secondary', compact ? 'text-xs' : 'text-sm')}
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
