/**
 * =====================================================================
 * SERVICIOS
 * ---------------------------------------------------------------------
 * `icon` es una clave que Services.tsx traduce a un SVG. Así este archivo
 * queda libre de JSX y se puede editar sin saber React.
 * =====================================================================
 */

export interface Service {
  id: number;
  number: string;
  title: string;
  description: string;
  /** 3-4 beneficios concretos. Se listan con guion, no con viñeta. */
  benefits: string[];
  icon: 'web' | 'shop';
}

export const SERVICES: Service[] = [
  {
    id: 1,
    number: '01',
    title: 'Webs profesionales',
    description:
      'Webs y landing pages a medida que transmiten confianza desde el primer segundo y convierten visitas en clientes reales.',
    benefits: [
      'Diseño a medida, sin plantillas genéricas',
      'Carga rápida en móvil y ordenador',
      'Preparada para posicionar en Google',
      'WhatsApp y formularios integrados',
    ],
    icon: 'web',
  },
  {
    id: 2,
    number: '02',
    title: 'Tiendas online',
    description:
      'Tiendas fáciles de gestionar y fáciles de comprar. Catálogo, pagos y envíos listos para vender desde el primer día.',
    benefits: [
      'Pagos seguros con tarjeta y Bizum',
      'Panel simple para gestionar productos',
      'Proceso de compra corto y sin fricción',
      'Control de stock y pedidos',
    ],
    icon: 'shop',
  },
];
