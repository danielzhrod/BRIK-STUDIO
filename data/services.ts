/**
 * =====================================================================
 * SERVICIOS
 * ---------------------------------------------------------------------
 * `icon` es el nombre de un icono de lucide-react. El componente
 * Services.tsx lo mapea a su componente real (ver ICON_MAP alli).
 * =====================================================================
 */

export interface Service {
  id: number;
  /** Nombre del servicio. */
  title: string;
  /** Frase corta de posicionamiento. */
  tagline: string;
  /** Descripcion de 2-3 lineas. */
  description: string;
  /** Beneficios concretos para el cliente. */
  benefits: string[];
  /** Clave del icono en ICON_MAP (components/Services.tsx). */
  icon: 'globe' | 'store';
}

export const SERVICES: Service[] = [
  {
    id: 1,
    title: 'Webs profesionales',
    tagline: 'Tu negocio, bien explicado',
    description:
      'Webs y landing pages a medida que transmiten confianza desde el primer segundo y convierten visitas en clientes reales.',
    benefits: [
      'Diseño a medida, sin plantillas genéricas',
      'Carga rápida en móvil y ordenador',
      'Preparada para posicionar en Google',
      'Formularios y WhatsApp integrados',
    ],
    icon: 'globe',
  },
  {
    id: 2,
    title: 'Tiendas online',
    tagline: 'Vende sin horarios',
    description:
      'Tiendas online sencillas de gestionar y fáciles de comprar. Catálogo, pagos y envíos listos para que empieces a vender desde el día uno.',
    benefits: [
      'Pagos seguros con tarjeta y Bizum',
      'Panel simple para gestionar productos',
      'Proceso de compra corto y sin fricción',
      'Control de stock y pedidos',
    ],
    icon: 'store',
  },
];

/**
 * Pasos del proceso de trabajo. Se muestran bajo los servicios para
 * dar contexto de "como trabajamos" sin necesidad de otra seccion.
 */
export const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Hablamos',
    description: 'Nos cuentas qué necesita tu negocio. Sin tecnicismos y sin compromiso.',
  },
  {
    step: '02',
    title: 'Diseñamos',
    description: 'Te enseñamos una propuesta visual antes de escribir una sola línea de código.',
  },
  {
    step: '03',
    title: 'Publicamos',
    description: 'Lanzamos tu web, la dejamos rápida y medible, y te enseñamos a usarla.',
  },
] as const;
