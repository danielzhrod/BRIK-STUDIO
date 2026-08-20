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
   * Solo guardamos el número en el formato que exige la API de wa.me
   * (dígitos pelados). NO hay versión "bonita" para mostrar: el número no
   * se escribe en ninguna parte de la web, solo vive dentro del enlace.
   */
  whatsappNumber: '34681066861',
  whatsappMessage:
    'Hola BRIK STUDIO 👋 Me gustaría información sobre una web para mi negocio.',

  /*
    Correo partido en dos A PROPÓSITO.
    Escrito entero, un robot de spam lo encuentra rastreando el HTML.
    EmailButton junta las dos mitades en el momento del clic, así la
    dirección nunca aparece completa en el código servido.
  */
  emailUser: 'brikstudio',
  emailDomain: 'hotmail.com',

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
