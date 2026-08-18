/**
 * =====================================================================
 * PROYECTOS DEL PORTAFOLIO
 * ---------------------------------------------------------------------
 * Para añadir un proyecto nuevo basta con copiar un objeto y cambiar
 * los valores. La galeria se adapta sola al numero de elementos.
 *
 * IMAGENES: guarda el screenshot en `public/assets/projects/` con una
 * relacion de aspecto 16:10 (recomendado 1600x1000 px).
 * =====================================================================
 */

export interface Project {
  /** Identificador unico y estable (se usa como `key` de React). */
  id: number;
  /** Nombre comercial del proyecto. */
  name: string;
  /** Descripcion breve: 1-2 lineas como maximo. */
  description: string;
  /** Tipo de trabajo entregado. Se muestra como etiqueta. */
  type: string;
  /** Sector del cliente. Se muestra como etiqueta secundaria. */
  industry: string;
  /** URL publica del proyecto en produccion. */
  link: string;
  /** Ruta de la imagen dentro de /public. */
  image: string;
  /** Texto alternativo de la imagen (accesibilidad + SEO). */
  imageAlt: string;
  /** Año de entrega. Se muestra sobre la tarjeta. */
  year: string;
  /** 3-4 puntos de valor concretos que aporto el proyecto. */
  highlights: string[];
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'FisioSuab',
    description:
      'Landing page creada para una clínica de fisioterapia para captar un mayor número de pacientes.',
    type: 'Landing Page',
    industry: 'Salud / Fisioterapia',
    link: 'https://fisiosuab.vercel.app',
    image: '/assets/projects/fisiosuab.svg',
    imageAlt: 'Vista previa de la landing page de FisioSuab, clínica de fisioterapia',
    year: '2025',
    highlights: [
      'Reserva de cita en un solo clic',
      'Diseño enfocado a captar pacientes',
      'Optimizada para búsquedas locales',
    ],
  },
  {
    id: 2,
    name: 'Glow by Sofy',
    description:
      'Landing page para un salón de belleza especializado en cuidados faciales y peinados.',
    type: 'Landing Page',
    industry: 'Belleza / Spa',
    link: 'https://glowbysofy.vercel.app',
    image: '/assets/projects/glowbysofy.svg',
    imageAlt: 'Vista previa de la landing page de Glow by Sofy, salón de belleza',
    year: '2025',
    highlights: [
      'Galería visual de tratamientos',
      'Estética premium y cuidada',
      'Contacto directo por WhatsApp',
    ],
  },
];
