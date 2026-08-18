/**
 * Parte una palabra en letras envueltas en <span>, para poder animarlas
 * por separado con GSAP.
 *
 * Accesibilidad: el texto troceado es ilegible para un lector de pantalla
 * (lo deletrearía). Por eso el original va en un `sr-only` y los trozos
 * quedan ocultos con `aria-hidden`.
 *
 * No usamos el plugin SplitText de GSAP porque es de pago; para letras
 * sueltas esto hace exactamente lo mismo.
 */
export function SplitText({
  text,
  className,
  letterClassName,
}: {
  text: string;
  className?: string;
  letterClassName?: string;
}) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split('').map((char, index) => (
          <span key={`${char}-${index}`} className={`letter ${letterClassName ?? ''}`}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}
