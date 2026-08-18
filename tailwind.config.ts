import type { Config } from 'tailwindcss';

/**
 * =====================================================================
 * BRIK STUDIO — sistema de diseño V2
 * ---------------------------------------------------------------------
 * Tema oscuro único, sin toggle. Los colores son literales (no variables
 * CSS) porque el sitio ya no cambia de tema: menos indirección, más
 * fácil de leer al editar.
 * =====================================================================
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0a', // fondo base de casi todo el sitio
          secondary: '#111111', // rompe el ritmo (sección "Nosotros")
          card: '#141414',
          border: '#1f2937',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          muted: '#4b5563',
        },
        accent: {
          blue: '#3b82f6',
          'blue-hover': '#60a5fa',
          whatsapp: '#25d366',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala fluida. El segundo valor son los ajustes finos de cada nivel.
        display: ['clamp(4.5rem, 10vw, 8.75rem)', { lineHeight: '0.88', letterSpacing: '-0.045em' }],
        'display-sm': ['clamp(3.5rem, 15vw, 5rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        h1: ['clamp(3rem, 7vw, 6rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        h2: ['clamp(2rem, 4vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        statement: ['clamp(1.75rem, 4vw, 3.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        label: ['0.75rem', { lineHeight: '1', letterSpacing: '0.25em' }],
      },
      spacing: {
        section: 'clamp(6rem, 12vw, 11rem)', // ritmo vertical entre secciones
      },
      transitionTimingFunction: {
        // Entra rápido, frena muy suave. La curva de todo el sitio.
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.45)' },
          '70%': { boxShadow: '0 0 0 18px rgba(37, 211, 102, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' },
        },
        'scroll-line': {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
          '45%': { transform: 'scaleY(1)', transformOrigin: 'top' },
          '55%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scroll-line': 'scroll-line 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
