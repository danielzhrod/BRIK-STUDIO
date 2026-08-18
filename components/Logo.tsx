import { cn } from '@/lib/utils';

/**
 * Isotipo de BRIK STUDIO: tres "ladrillos" (brick -> BRIK) montados en
 * hilada, como una pared. Es un SVG inline, asi que hereda el color del
 * tema y no cuesta ninguna peticion de red.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      {/* hilada superior: un ladrillo largo */}
      <rect x="7" y="9" width="18" height="4.5" rx="1.4" fill="white" fillOpacity="0.95" />
      {/* hilada inferior: dos ladrillos desplazados (traba de albañileria) */}
      <rect x="7" y="15.5" width="8" height="4.5" rx="1.4" fill="white" fillOpacity="0.7" />
      <rect x="17" y="15.5" width="8" height="4.5" rx="1.4" fill="white" fillOpacity="0.7" />
      <rect x="7" y="22" width="18" height="1.8" rx="0.9" fill="white" fillOpacity="0.35" />
    </svg>
  );
}
