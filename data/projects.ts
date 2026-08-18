/**
 * =====================================================================
 * PROYECTOS DEL PORTAFOLIO
 * ---------------------------------------------------------------------
 * Para añadir uno nuevo: copia un objeto y cambia los valores. La galería
 * y el contador "01 / 02" se adaptan solos al número de elementos.
 *
 * IMÁGENES
 * Las actuales son recreaciones SVG de cada web. Para poner capturas
 * reales: guarda el .jpg en `public/assets/projects/` (relación 16:10,
 * recomendado 1600x1000 px) y cambia solo la extensión aquí:
 *     image: '/assets/projects/fisiosuab.jpg'
 * No hay que tocar nada más.
 * =====================================================================
 */

export interface Project {
  id: number;
  /** Número que se pinta enorme de fondo en la tarjeta. */
  number: string;
  name: string;
  description: string;
  type: string;
  industry: string;
  link: string;
  image: string;
  imageAlt: string;
  year: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    number: '01',
    name: 'FisioSuab',
    description:
      'Landing page para una clínica de fisioterapia en Valladolid. Diseñada para captar nuevos pacientes con reserva de cita directa y prueba social bien visible.',
    type: 'Landing Page',
    industry: 'Salud / Fisioterapia',
    link: 'https://fisiosuab.vercel.app',
    image: '/assets/projects/fisiosuab.svg',
    imageAlt: 'Vista previa de la landing page de FisioSuab, clínica de fisioterapia',
    year: '2025',
  },
  {
    id: 2,
    number: '02',
    name: 'Glow by Sofy',
    description:
      'Landing page para un salón de belleza premium. Estética editorial y oscura para cuidados faciales, color y peinados, con reserva en un clic.',
    type: 'Landing Page',
    industry: 'Belleza / Spa',
    link: 'https://glowbysofy.vercel.app',
    image: '/assets/projects/glowbysofy.svg',
    imageAlt: 'Vista previa de la landing page de Glow by Sofy, salón de belleza',
    year: '2025',
  },
];
