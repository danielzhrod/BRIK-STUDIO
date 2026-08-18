import { z } from 'zod';

/**
 * Esquema compartido entre el formulario (cliente) y la API (servidor).
 * Definirlo una sola vez garantiza que las dos validaciones son identicas.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Escribe tu nombre (mínimo 2 caracteres).')
    .max(80, 'El nombre es demasiado largo.'),
  email: z.string().trim().email('Revisa el email, no parece válido.'),
  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos un poco más (mínimo 10 caracteres).')
    .max(2000, 'El mensaje es demasiado largo.'),
  /**
   * Campo trampa contra bots ("honeypot"). Esta oculto por CSS: una persona
   * nunca lo rellena, un bot automatico casi siempre si.
   *
   * OJO: aqui NO se valida que venga vacio a proposito. Si el esquema lo
   * rechazara, el bot recibiria un error 400 y descubriria la trampa (y de
   * paso veriamos un mensaje de Zod en ingles en una web en español).
   * La comprobacion se hace en `app/api/contact/route.ts`, que responde 200
   * como si todo hubiera ido bien y descarta el mensaje en silencio.
   */
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
