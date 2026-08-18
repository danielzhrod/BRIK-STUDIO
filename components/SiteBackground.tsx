import { ParticleField } from '@/components/ParticleField';

/**
 * =====================================================================
 * FONDO DEL SITIO
 * ---------------------------------------------------------------------
 * Una única capa fija detrás de TODA la web: azul muy oscuro con dos
 * halos difusos y la constelación de partículas encima.
 *
 * Antes cada sección pintaba su propio negro (#0a0a0a, #111111) y se
 * notaba el corte entre ellas. Con una sola capa fija el fondo no se
 * mueve al hacer scroll, así que la página entera se lee como un mismo
 * espacio continuo y las secciones se limitan a flotar por encima.
 * =====================================================================
 */
export function SiteBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Base */}
      <div className="absolute inset-0 bg-background-primary" />

      {/* Halo azul superior: es el que da el tono del hero */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(59,130,246,0.16),transparent_65%)]" />

      {/* Halo inferior, mucho más tenue, para que el pie no quede plano */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_100%,rgba(59,130,246,0.07),transparent_65%)]" />

      {/* Constelación */}
      <ParticleField />
    </div>
  );
}
