import type { Config } from 'tailwindcss';

/**
 * Todos los colores se leen desde variables CSS definidas en `app/globals.css`.
 * Ventaja: el tema claro/oscuro cambia solo, sin duplicar clases en los componentes.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          elevated: 'hsl(var(--surface-elevated))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))', // texto, iconos y bordes
          solid: 'hsl(var(--primary-solid))', // rellenos con texto blanco encima
          foreground: 'hsl(var(--primary-foreground))',
        },
        whatsapp: {
          DEFAULT: 'hsl(var(--whatsapp))',
          foreground: 'hsl(var(--whatsapp-foreground))',
        },
      },
      fontFamily: {
        // --font-geist-sans / --font-inter se inyectan en app/layout.tsx
        heading: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala fluida: crece con el viewport sin media queries.
        'display-lg': ['clamp(2.75rem, 1.6rem + 5.4vw, 4rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(2rem, 1.4rem + 2.8vw, 3rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(1.6rem, 1.3rem + 1.4vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      boxShadow: {
        card: '0 2px 12px -4px hsl(var(--shadow-color) / 0.35)',
        'card-hover': '0 28px 60px -20px hsl(var(--shadow-color) / 0.55)',
        glow: '0 0 0 1px hsl(var(--primary) / 0.35), 0 18px 45px -18px hsl(var(--primary) / 0.65)',
      },
      transitionTimingFunction: {
        // Curva "premium": arranca rapido y frena suave. Sin rebote.
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 hsl(var(--whatsapp) / 0.5)' },
          '70%': { boxShadow: '0 0 0 16px hsl(var(--whatsapp) / 0)' },
          '100%': { boxShadow: '0 0 0 0 hsl(var(--whatsapp) / 0)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
