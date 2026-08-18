/**
 * =====================================================================
 * CONFIGURACION CENTRAL DE BRIK STUDIO
 * ---------------------------------------------------------------------
 * Este es el UNICO archivo que hay que tocar para cambiar los datos del
 * negocio. Nombre, telefono, email y textos viven aqui; los componentes
 * solo los leen.
 * =====================================================================
 */

export const config = {
  name: 'BRIK STUDIO',
  tagline: 'Webs profesionales + Tiendas online',
  subtitle: 'Diseñamos soluciones que generan resultados',
  description:
    'Diseñamos webs profesionales y tiendas online que generan resultados. Nos enfocamos en diseño limpio, funcionalidad y conversión.',

  /**
   * WhatsApp.
   * - `whatsapp` es el numero tal y como se muestra en pantalla.
   * - `whatsappNumber` es el mismo numero SOLO con digitos, que es el
   *   formato que exige la API de wa.me (sin +, sin espacios).
   */
  whatsapp: '+34 681 066 861',
  whatsappNumber: '34681066861',
  whatsappMessage:
    'Hola BRIK STUDIO 👋 Me gustaría información sobre una web para mi negocio.',

  /**
   * Email de contacto.
   * Dejalo como cadena vacia hasta que tengas la direccion definitiva:
   * el bloque de email y el formulario se ocultan automaticamente.
   */
  email: '',

  website: 'https://brik-studio.vercel.app',

  /** Color de acento principal. Debe coincidir con --primary en globals.css */
  primaryColor: '#3b82f6',

  /** Redes sociales. Las vacias no se renderizan. */
  linkedin: '',
  github: '',
  instagram: '',

  /** Ubicacion / ambito. Se muestra en el footer y en contacto. */
  location: 'España · Trabajamos en remoto',
} as const;

/** Enlace listo para usar que abre WhatsApp con el mensaje pre-escrito. */
export const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
  config.whatsappMessage,
)}`;

/**
 * Enlaces del menu de navegacion.
 * El `href` apunta al `id` de cada <section> de la home.
 */
export const NAV_LINKS = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];
