import { cn } from '@/lib/utils';

/**
 * Wordmark de BRIK STUDIO.
 *
 * Es texto SVG, no una imagen: escala nítido a cualquier tamaño, pesa
 * unos pocos bytes, hereda el color del tema y se puede seleccionar y
 * leer por buscadores y lectores de pantalla.
 *
 * "BRIK" va en negro extra-condensado con una inclinación ligera, y
 * "STUDIO" debajo a la derecha muy espaciado, como en el logo original.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="BRIK STUDIO"
      className={cn('h-8 w-auto', className)}
    >
      <text
        x="0"
        y="24"
        fill="currentColor"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="27"
        fontWeight="900"
        letterSpacing="-1.4"
        // La inclinación imita la cursiva del logotipo original.
        transform="skewX(-9)"
      >
        BRIK
      </text>
      <text
        x="61"
        y="36"
        fill="currentColor"
        fontFamily="var(--font-inter), system-ui, sans-serif"
        fontSize="10"
        fontWeight="600"
        letterSpacing="4.2"
      >
        STUDIO
      </text>
    </svg>
  );
}
