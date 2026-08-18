import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Variantes del boton (patron shadcn/ui + CVA).
 *
 * `buttonVariants` se exporta aparte para poder darle aspecto de boton a
 * un <a> o a un <Link> sin necesitar la dependencia @radix-ui/react-slot:
 *   <a className={buttonVariants({ variant: 'whatsapp' })}>...</a>
 *
 * Nota de accesibilidad: TODOS los tamanos miden 44px de alto como minimo,
 * el objetivo tactil recomendado para pulsar comodamente en movil.
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 ease-smooth disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        /** CTA principal: azul de marca (tono solido, legible con texto blanco). */
        primary:
          'bg-primary-solid text-primary-foreground shadow-glow hover:brightness-110 active:brightness-95',
        /** CTA de WhatsApp: verde, siempre destacado. */
        whatsapp:
          'bg-whatsapp text-whatsapp-foreground hover:brightness-110 active:brightness-95',
        /** Accion secundaria sobre fondo oscuro. */
        outline:
          'border border-border bg-surface/60 text-foreground backdrop-blur hover:border-primary/60 hover:bg-surface',
        /** Terciaria, sin caja. */
        ghost: 'text-muted-foreground hover:bg-surface hover:text-foreground',
      },
      size: {
        // 44px es el minimo recomendado para pulsar comodamente con el dedo.
        sm: 'h-11 px-5',
        default: 'h-12 px-6 text-[0.95rem]',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { Button };
