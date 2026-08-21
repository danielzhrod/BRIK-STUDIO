import { z } from 'zod';

import { BLOCKLIST } from '@/data/blocklist';
import { DISPOSABLE_DOMAINS, INVALID_TLDS } from '@/data/disposableDomains';

/* =====================================================================
   NORMALIZACIÓN
   ===================================================================== */

/**
 * Sustituciones de tipo «leet»: la forma más común de esquivar un filtro.
 * Se aplican DESPUÉS de quitar tildes, para que `3` pase a `e` y no choque
 * con una `é` ya convertida.
 */
const LEET: Record<string, string> = {
  '@': 'a',
  '4': 'a',
  '3': 'e',
  '€': 'e',
  '1': 'i',
  '!': 'i',
  '¡': 'i',
  '|': 'i',
  '0': 'o',
  '5': 's',
  $: 's',
  '7': 't',
  '+': 't',
  '8': 'b',
  '9': 'g',
};

/**
 * Deja el texto en una forma comparable.
 *
 * 1. minúsculas
 * 2. fuera las tildes y diacríticos (`café` → `cafe`)
 * 3. sustituciones leet (`p3nd3j0` → `pendejo`)
 * 4. las letras repetidas TRES o más veces se colapsan a una sola
 *    (`puuuuta` → `puta`), pero se respetan las dobles legítimas: en
 *    español `perro` o `llave` no deben tocarse.
 * 5. cualquier cosa que no sea letra o número pasa a espacio, y los
 *    espacios se colapsan
 */
export function normalize(text: string): string {
  const sinTildes = text
    .toLowerCase()
    .normalize('NFD')
    // Quita los signos diacríticos que NFD ha separado de su letra.
    // Se escribe con códigos y no con los caracteres sueltos porque estos
    // son invisibles en el editor y cualquiera los borraría sin querer.
    .replace(/[̀-ͯ]/g, '');

  const sinLeet = sinTildes.replace(/[@43€1!¡|05$7+89]/g, (char) => LEET[char] ?? char);

  return sinLeet
    .replace(/(.)\1{2,}/g, '$1')
    .replace(/[^a-z0-9ñç\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Escapa los caracteres que tienen significado dentro de una expresión regular. */
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Expresiones ya compiladas, una por término bloqueado.
 *
 * Se construyen UNA vez al cargar el módulo, no en cada pulsación: son
 * varios cientos de expresiones y recompilarlas en cada tecla se notaría.
 *
 * `\b` a los lados es lo que evita los falsos positivos: sin los límites
 * de palabra, «puta» bloquearía «disputa» o «reputación», y «mena»
 * bloquearía «amena» o «Almenara».
 */
const BLOCK_PATTERNS: RegExp[] = BLOCKLIST.map(
  (term) => new RegExp(`\\b${escapeRegex(normalize(term))}\\b`),
);

/** ¿El texto contiene algún término bloqueado? */
export function containsBlockedTerm(text: string): boolean {
  const normalized = normalize(text);
  return BLOCK_PATTERNS.some((pattern) => pattern.test(normalized));
}

/* =====================================================================
   URLS
   ===================================================================== */

/**
 * Cuenta enlaces. El spam de formularios casi siempre viene cargado de
 * ellos, así que más de un par es señal suficiente.
 * Detecta tanto `http://algo` como `www.algo` y `algo.com` a secas.
 */
export function countUrls(text: string): number {
  const matches = text.match(
    /(https?:\/\/|www\.)[^\s]+|[a-z0-9-]+\.(com|net|org|io|es|info|biz|ru|xyz|top|link|click)\b/gi,
  );
  return matches?.length ?? 0;
}

/* =====================================================================
   EMAIL
   ===================================================================== */

/**
 * Formato de correo. Deliberadamente más estricto que el típico
 * `/.+@.+/`: exige parte local sin puntos consecutivos, dominio con
 * etiquetas válidas y un TLD de al menos dos letras.
 */
const EMAIL_PATTERN =
  /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

/** Saca el dominio de un correo ya normalizado. */
function domainOf(email: string): string {
  return email.slice(email.lastIndexOf('@') + 1);
}

/** ¿Es un buzón temporal? Cubre también los subdominios. */
export function isDisposableEmail(email: string): boolean {
  const domain = domainOf(email);
  return DISPOSABLE_DOMAINS.some(
    (blocked) => domain === blocked || domain.endsWith(`.${blocked}`),
  );
}

/** ¿Termina en un dominio de primer nivel que no existe fuera de pruebas? */
export function hasInvalidTld(email: string): boolean {
  const tld = domainOf(email).split('.').pop() ?? '';
  return INVALID_TLDS.includes(tld);
}

/* =====================================================================
   ESQUEMA
   ===================================================================== */

/**
 * Letras admitidas en un nombre.
 * Cubre castellano, gallego, euskera y catalán: vocales acentuadas, ñ, ç,
 * diéresis, el punt volat catalán (`l·l`), apóstrofos y guiones.
 */
const NAME_PATTERN = /^[\p{L}\p{M}'’·\-. ]+$/u;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Escribe tu nombre (mínimo 2 caracteres).')
    .max(60, 'El nombre es demasiado largo.')
    .regex(NAME_PATTERN, 'El nombre solo puede llevar letras, espacios y guiones.')
    // Un nombre con enlaces es spam, siempre.
    .refine((value) => countUrls(value) === 0, 'El nombre no puede contener enlaces.')
    .refine((value) => !containsBlockedTerm(value), {
      message: 'Ese nombre contiene lenguaje no permitido.',
    }),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, 'Escribe tu email.')
    .max(120, 'El email es demasiado largo.')
    .regex(EMAIL_PATTERN, 'Revisa el email, no parece válido.')
    .refine((value) => !hasInvalidTld(value), 'Ese dominio de email no existe.')
    .refine(
      (value) => !isDisposableEmail(value),
      'No aceptamos correos temporales. Usa uno donde podamos responderte.',
    ),

  message: z
    .string()
    .trim()
    .min(10, 'Cuéntanos un poco más (mínimo 10 caracteres).')
    .max(1500, 'El mensaje es demasiado largo (máximo 1500 caracteres).')
    .refine((value) => countUrls(value) <= 2, 'Demasiados enlaces en el mensaje.')
    .refine((value) => !containsBlockedTerm(value), {
      message: 'Tu mensaje contiene lenguaje no permitido. Por favor, reformúlalo.',
    }),
});

export type ContactInput = z.infer<typeof contactSchema>;

/* =====================================================================
   ANTI-BOT
   ===================================================================== */

/** Segundos que deben pasar entre dos envíos desde el mismo navegador. */
export const THROTTLE_SECONDS = 30;
/**
 * Tiempo mínimo que tarda una persona en rellenar el formulario.
 * Por debajo de esto es un robot rellenando campos de golpe.
 */
export const MIN_FILL_SECONDS = 3;
