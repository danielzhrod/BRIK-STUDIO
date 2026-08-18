import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * `cn` une clases de Tailwind resolviendo conflictos.
 * Ej: cn('px-2', 'px-4') -> 'px-4' (gana la ultima).
 * Es el helper estandar de shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
