/**
 * =====================================================================
 * CONFIGURACIÓN CENTRAL DE BRIK STUDIO
 * ---------------------------------------------------------------------
 * Único archivo que hay que tocar para cambiar los datos del negocio.
 * =====================================================================
 */

export const config = {
  name: 'BRIK STUDIO',
  tagline: 'Webs + Tiendas online',
  description:
    'Diseñamos webs profesionales y tiendas online que generan resultados. Nos enfocamos en diseño limpio, funcionalidad y conversión.',

  /**
   * WhatsApp.
   * - `whatsapp` es como se muestra en pantalla.
   * - `whatsappNumber` es el mismo número SOLO con dígitos, que es el
   *   formato que exige la API de wa.me (sin +, sin espacios).
   */
  whatsapp: '+34 681 066 861',
  whatsappNumber: '34681066861',
  whatsappMessage:
    'Hola BRIK STUDIO 👋 Me gustaría información sobre una web para mi negocio.',

  /** Déjalo vacío hasta tener la dirección: el bloque se adapta solo. */
  email: '',

  website: 'https://brik-studio.vercel.app',
  location: 'España · Trabajamos en remoto',
} as const;

/** Enlace listo para usar que abre WhatsApp con el mensaje pre-escrito. */
export const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
  config.whatsappMessage,
)}`;

/** Enlaces del menú. El `href` apunta al `id` de cada <section>. */
export const NAV_LINKS = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Estudio', href: '#estudio' },
  { label: 'Contacto', href: '#contacto' },
] as const;

/** Cifras del bloque "Estudio". `value` se anima con un contador. */
export const STATS = [
  { value: 2, suffix: '', label: 'Proyectos publicados' },
  { value: 100, suffix: '%', label: 'Diseño a medida' },
  { value: 2, prefix: '<', suffix: 's', label: 'Tiempo de carga' },
] as const;
