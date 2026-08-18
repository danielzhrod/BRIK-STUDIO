# BRIK STUDIO — Portafolio

> Webs + Tiendas online

Sitio de una página con Next.js 14, TypeScript, Tailwind, GSAP y Lenis. Todo el
portafolio se presenta **dentro de una ventana de navegador** que crece con el
scroll y va pasando de una etapa a otra.

**En producción:** https://brik-studio.vercel.app

---

## Puesta en marcha

```bash
npm install
```

```bash
npm run dev
```

Abre **http://localhost:3000**. No hay variables de entorno que configurar.

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila producción |
| `npm run start` | Sirve la compilación (requiere `build`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | Tipos de TypeScript |

## Publicar cambios

El repositorio está conectado a Vercel. **Cada `git push` republica solo:**

```bash
git add -A && git commit -m "describe el cambio" && git push
```

---

## Cómo está montada la página

Una única sección muy alta (`820vh`) con un panel pegajoso dentro. El scroll conduce
todo el recorrido:

```
Showcase.tsx                      la sección alta
 └─ panel pegajoso                sticky top-0 h-screen
     ├─ titular BRIK STUDIO       se desvanece hacia arriba
     └─ MacFrame                  crece hasta llenar la pantalla
         ├─ 1. Proyectos
         ├─ 2. FisioSuab
         ├─ 3. Glow by Sofy
         ├─ 4. Servicios
         ├─ 5. El estudio
         └─ 6. Contacto
```

Los tiempos de cada etapa están en la constante `MARKS` de `Showcase.tsx`, todos
juntos para poder ajustar el ritmo sin rastrear varios archivos.

**En móvil no se ancla nada.** El panel deja de ser pegajoso, la sección pierde su
altura enorme y las etapas se apilan en flujo normal dentro del marco. El scroll
anclado en móvil secuestra el gesto del dedo y marea.

---

## Personalizar

Todo el contenido vive en `data/`. No hace falta tocar los componentes.

- **`data/config.ts`** — nombre, WhatsApp, email, enlaces del menú.
  `whatsappNumber` va solo con dígitos: es lo que exige la API de wa.me.
- **`data/projects.ts`** — proyectos. Copia un objeto y cambia los valores.
- **`data/services.ts`** — servicios. `icon` acepta `'web'` o `'shop'`; para añadir
  iconos amplía el `ICONS` del principio de `components/stages.tsx`.

Si añades un proyecto, recuerda añadir también su etapa en `Showcase.tsx` y una
marca más en `MARKS`.

### Cambiar las imágenes de los proyectos

Las vistas previas actuales (`public/assets/projects/*.svg`) son recreaciones
vectoriales de cada web. Para poner capturas reales:

1. Captura a **1600 × 1000 px** (relación 16:10).
2. Guárdala en `public/assets/projects/`.
3. Cambia la extensión en `data/projects.ts`:

```diff
- image: '/assets/projects/fisiosuab.svg',
+ image: '/assets/projects/fisiosuab.jpg',
```

---

## Las animaciones

| Efecto | Con qué | Dónde |
| --- | --- | --- |
| Letras lanzadas como ladrillos | GSAP, una línea por letra | `Showcase.tsx` |
| Giro de dos vueltas de la ventana | GSAP `rotateY: 720` | `Showcase.tsx` |
| Crecimiento y cambio de etapa | GSAP `ScrollTrigger` con `scrub` | `Showcase.tsx` |
| Revelado palabra a palabra | El mismo `scrub`, dentro de su tramo | `Showcase.tsx` |
| Cursor de dos capas + magnetismo | GSAP `quickTo` | `MagneticCursor.tsx` |
| Blob que invierte lo que pisa | `mix-blend-mode: difference` | `MagneticCursor.tsx` |
| Burbuja que envuelve el CTA | rAF + `getBoundingClientRect` | `MagneticCursor.tsx` |
| Partículas que huyen del ratón | Canvas puro | `ParticleField.tsx` |
| Scroll suave | Lenis sincronizado con GSAP | `SmoothScroll.tsx` |

### Cinco trampas que ya costaron caras

**Nunca animes el mismo elemento con dos sistemas.** La ventana lleva dos capas: la
exterior la mueve el scroll y la interior la carga. Si compartieran nodo se pisarían
la propiedad `transform`.

**Nunca encadenes el scroll al final de una animación de entrada.** Construir la
línea del scroll en el `onComplete` del giro dejaba la página muerta si el giro no
terminaba — por ejemplo al abrir la web en una pestaña en segundo plano, donde el
navegador congela los fotogramas.

**Un `fromTo` colocado a mitad de una línea no aplica su estado inicial hasta que la
reproducción llega ahí.** Para lo que deba arrancar oculto, un `gsap.set()` aparte.

**El `border-radius` orgánico de ocho valores con barra rompe el parser de GSAP.**
Aborta el efecto entero **sin lanzar ningún error por consola**. La forma del blob va
en la animación CSS `blob-morph`; a GSAP solo se le pasan números.

**Ningún `gsap.to()` dentro de un bucle de `requestAnimationFrame`.** Crear el tween
en cada fotograma lo reinicia antes de que pueda completarse: avanza un 4% y vuelve a
empezar. Era la causa de que la burbuja del cursor fallara de forma intermitente.

---

## Accesibilidad

- El cursor personalizado solo se activa con ratón real (`pointer: fine`) y pantalla
  ≥768px. La clase que oculta el cursor nativo se añade **desde JS**, así que si el
  script falla nunca te quedas sin puntero.
- `prefers-reduced-motion` respetado: sin animaciones, sin cursor personalizado, sin
  recorrido anclado y sin scroll interceptado.
- `<noscript>` que revela todo el contenido si no hay JavaScript.
- El texto troceado en letras lleva el original en `sr-only`: un lector de pantalla
  lee "BRIK", no "B-R-I-K".
- Enlace "Saltar al contenido" y foco visible en todos los interactivos.

---

## Estructura

```
app/
  globals.css      Variables, cursor, clase .stage
  layout.tsx       Fuente, metadatos, fondo, navbar, pie
  page.tsx         Monta <Showcase />
components/
  Showcase.tsx     El recorrido completo y toda la lógica de scroll
  stages.tsx       Las seis pantallas que van dentro de la ventana
  MacFrame.tsx     El marco de navegador reutilizable
  SiteBackground   Capa fija: degradado + partículas
  MagneticCursor · ParticleField · SplitText
  Navigation · Footer · Logo · SmoothScroll
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
