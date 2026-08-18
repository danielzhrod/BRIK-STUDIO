import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/** Etiquetas pequenas: tipo de proyecto, industria, estado. */
const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-300',
  {
    variants: {
      variant: {
        default: 'border-border bg-surface-elevated text-muted-foreground',
        accent: 'border-primary/40 bg-primary/10 text-primary',
        solid: 'border-transparent bg-foreground/10 text-foreground backdrop-blur',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
