import { NextResponse } from 'next/server';

import { contactSchema } from '@/lib/contact-schema';

/**
 * =====================================================================
 * POST /api/contact
 * ---------------------------------------------------------------------
 * Recibe el formulario, lo valida con Zod y lo envia por email con Resend.
 *
 * Si no hay RESEND_API_KEY o CONTACT_EMAIL configurados devuelve un 503
 * con un mensaje claro: el sitio sigue funcionando y el visitante puede
 * escribir por WhatsApp, que es el canal principal.
 * =====================================================================
 */
export async function POST(request: Request) {
  // --- 1. Comprobar configuracion del servidor ---
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error:
          'El envío por email todavía no está configurado. Escríbenos por WhatsApp y te respondemos al momento.',
      },
      { status: 503 },
    );
  }

  // --- 2. Parsear y validar el cuerpo de la peticion ---
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Petición inválida.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Revisa los datos del formulario.',
        // `flatten` devuelve los errores agrupados por campo.
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;

  // --- 3. Honeypot: si viene relleno es un bot. Fingimos exito. ---
  if (company) {
    return NextResponse.json({ ok: true });
  }

  // --- 4. Enviar el email ---
  try {
    // Import dinamico: el SDK solo se carga cuando de verdad hace falta.
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'BRIK STUDIO <onboarding@resend.dev>',
      to,
      // Al responder el email, la respuesta va directa al visitante.
      reply_to: email,
      subject: `Nuevo mensaje de ${name} — brik-studio.com`,
      text: [
        `Nombre:  ${name}`,
        `Email:   ${email}`,
        '',
        'Mensaje:',
        message,
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend devolvió un error:', error);
      return NextResponse.json(
        { error: 'No hemos podido enviar el mensaje. Prueba por WhatsApp.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] Error inesperado:', error);
    return NextResponse.json(
      { error: 'No hemos podido enviar el mensaje. Prueba por WhatsApp.' },
      { status: 500 },
    );
  }
}
