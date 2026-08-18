'use client';

import { useState, type FormEvent } from 'react';
import { Loader2, Send } from 'lucide-react';

import { contactSchema } from '@/lib/contact-schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'success' | 'error';

/** Errores por campo. Ej: { email: 'Revisa el email...' } */
type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

const inputClass =
  'w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40';

/**
 * =====================================================================
 * FORMULARIO DE CONTACTO (canal secundario)
 * ---------------------------------------------------------------------
 * Tres campos, sin mas. El canal principal sigue siendo WhatsApp.
 * Valida en el navegador con el MISMO esquema Zod que usa la API, para
 * que el visitante vea los errores al instante y sin recargar.
 * =====================================================================
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerMessage('');

    // Guardamos la referencia AHORA: tras un `await`, React ya ha puesto
    // `event.currentTarget` a null y no podriamos resetear el formulario.
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      company: String(formData.get('company') ?? ''), // honeypot
    };

    // --- Validacion en cliente ---
    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0],
      });
      setStatus('error');
      return;
    }

    setErrors({});
    setStatus('sending');

    // --- Envio al servidor ---
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus('error');
        setServerMessage(data.error ?? 'No hemos podido enviar el mensaje.');
        return;
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setServerMessage('No hemos podido conectar. Revisa tu conexión o escríbenos por WhatsApp.');
    }
  }

  // --- Estado final: mensaje enviado ---
  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-lg border border-whatsapp/40 bg-whatsapp/10 p-8 text-center"
      >
        <p className="font-heading text-lg font-bold text-foreground">¡Mensaje enviado!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Te respondemos en menos de 24 horas. Si tienes prisa, escríbenos por WhatsApp.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field label="Nombre" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Cómo te llamas"
          className={cn(inputClass, errors.name && 'border-red-500/70')}
          aria-invalid={Boolean(errors.name)}
        />
      </Field>

      <Field label="Email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          className={cn(inputClass, errors.email && 'border-red-500/70')}
          aria-invalid={Boolean(errors.email)}
        />
      </Field>

      <Field label="Mensaje" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Cuéntanos qué necesita tu negocio"
          className={cn(inputClass, 'resize-none', errors.message && 'border-red-500/70')}
          aria-invalid={Boolean(errors.message)}
        />
      </Field>

      {/*
        Honeypot: invisible para personas (fuera de pantalla y sin tabulacion),
        visible para bots que rellenan todos los campos del DOM.
      */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto">
        {status === 'sending' ? (
          <>
            <Loader2 className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send />
            Enviar mensaje
          </>
        )}
      </Button>

      {serverMessage && (
        <p role="alert" className="text-sm text-red-400">
          {serverMessage}
        </p>
      )}
    </form>
  );
}

/** Envoltorio de campo: etiqueta + control + mensaje de error. */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactElement<{ id?: string }>;
}) {
  const id = children.props.id;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
