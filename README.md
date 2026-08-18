# BRIK STUDIO — Portafolio

> Webs + Tiendas online

Sitio de una página con Next.js 14, TypeScript, Tailwind, GSAP, Framer Motion y Lenis.
Tema oscuro, cursor magnético, partículas en canvas y animaciones ligadas al scroll.

**En producción:** https://brik-studio.vercel.app

---

## Puesta en marcha

```bash
npm install
```

```bash
npm run dev
```

Abre **http://localhost:3000**. No hace falta configurar nada: no hay variables de entorno.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila producción |
| `npm run start` | Sirve la compilación (requiere `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Tipos de TypeScript |

---

## Publicar cambios

El repositorio está conectado a Vercel. **Cada `git push` republica solo:**

```bash
git add -A && git commit -m "describe el cambio" && git push
```

---

## Personalizar

Todo el contenido vive en `data/`. No hace falta tocar los componentes.

### `data/config.ts` — datos del negocio

```ts
whatsapp: '+34 681 066 861',
whatsappNumber: '34681066861', // solo dígitos: lo exige la API de wa.me
email: '',                     // al rellenarlo aparece solo en Contacto
```

### `data/projects.ts` — proyectos

Copia un objeto del array y cambia los valores. La galería y el contador
`01 / 02` se adaptan solos al número de proyectos.

### `data/services.ts` — servicios

Mismo sistema. `icon` acepta `'web'` o `'shop'`; para añadir iconos nuevos amplía
el `ICONS` del principio de `components/Services.tsx`.

---

## Cambiar las imágenes de los proyectos

Las vistas previas actuales (`public/assets/projects/*.svg`) son **recreaciones
vectoriales** de cada web, hechas con sus colores y textos reales.

Para poner capturas de pantalla auténticas:

1. Haz la captura a **1600 × 1000 px** (relación 16:10).
2. Guárdala en `public/assets/projects/` como `.jpg` o `.webp`.
3. Cambia la extensión en `data/projects.ts`:

```diff
- image: '/assets/projects/fisiosuab.svg',
+ image: '/assets/projects/fisiosuab.jpg',
```

No hay que tocar nada más. Next.js las optimiza y sirve en AVIF/WebP según el navegador.

---

## Cómo funcionan las animaciones

| Efecto | Con qué | Dónde |
| --- | --- | --- |
| Cursor de dos capas + magnetismo | GSAP `quickTo` | `components/MagneticCursor.tsx` |
| Partículas que huyen del ratón | Canvas API pura | `components/ParticleField.tsx` |
| Mockup con inclinación 3D y parallax | GSAP `matchMedia` + `scrub` | `components/BrowserMockup.tsx` |
| Entrada letra a letra del hero | GSAP timeline | `components/Hero.tsx` + `SplitText.tsx` |
| Entradas laterales al hacer scroll | GSAP `ScrollTrigger` | `Projects.tsx`, `Services.tsx` |
| Revelado palabra a palabra | `ScrollTrigger` con `scrub` | `components/About.tsx` |
| Zoom de imagen al pasar el ratón | Framer Motion | `components/Projects.tsx` |
| Scroll suave | Lenis sincronizado con GSAP | `components/SmoothScroll.tsx` |

### Tres decisiones que conviene no deshacer

**GSAP y Framer Motion nunca animan el mismo elemento.** Ambos escriben la
propiedad `transform`, así que compartir elemento produce saltos. En las tarjetas
de proyecto hay tres capas a propósito: GSAP mueve el contenedor exterior, el
enlace intermedio recorta, y Framer Motion hace el zoom en el interior.

**El cursor se centra con `xPercent`/`yPercent`, no con `-translate-x-1/2`.**
GSAP reescribe `transform` en cada frame y machacaría las clases de Tailwind.

**El canvas se mide con `ResizeObserver`, no con `window.onresize`.** En el primer
montaje `offsetWidth` puede ser 0 y el lienzo se quedaría vacío hasta que
redimensionaras la ventana.

---

## Accesibilidad

- El cursor personalizado solo se activa con ratón real (`pointer: fine`) y
  pantalla ≥768px. La clase que oculta el cursor nativo se añade **desde JS**, así
  que si el script falla nunca te quedas sin puntero.
- `prefers-reduced-motion` respetado en todo: sin animaciones, sin parallax, sin
  cursor personalizado y sin scroll interceptado.
- `<noscript>` que revela todo el contenido si no hay JavaScript.
- El texto troceado en letras lleva el original en `sr-only`: un lector de
  pantalla lee "BRIK", no "B-R-I-K".
- Enlace "Saltar al contenido" y foco visible en todos los interactivos.

---

## Estructura

```
app/
  globals.css      Variables, cursor, utilidades
  layout.tsx       Fuente, metadatos, navbar, pie, noscript
  page.tsx         Ensambla las secciones
components/
  MagneticCursor   Cursor de dos capas + magnetismo
  ParticleField    Canvas de partículas
  BrowserMockup    Navegador con inclinación 3D
  SplitText        Trocea texto en letras animables
  Hero / Projects / Services / About / Contact
  Navigation / Footer / Logo / SmoothScroll
data/              ← config, projects, services
lib/               gsap (registro + constantes), utils (cn)
public/assets/     Logo e imágenes de proyectos
```

---

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · GSAP 3 + ScrollTrigger ·
Framer Motion · Lenis · Inter

---

© BRIK STUDIO
