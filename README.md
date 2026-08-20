# BRIK STUDIO — Portafolio

> Webs + Tiendas online

Sitio de una página con Next.js 14, TypeScript, Tailwind, GSAP y Lenis. Una ventana
de navegador acompaña al visitante durante todo el scroll, flotando en la mitad
derecha y describiendo arcos al pasar de una sección a otra.

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

Secciones **de altura normal** que scrollean con normalidad, con su contenido en la
mitad izquierda. La ventana vive aparte, en una capa fija que nunca se desmonta:

```
app/page.tsx
 ├─ FloatingWindow      capa fixed sobre la mitad derecha
 ├─ Hero                    ┐
 ├─ Projects                │ secciones normales,
 ├─ Services                │ contenido a la izquierda
 ├─ About                   │ (lg:pr-[50vw])
 └─ Contact                 ┘
```

Es el patrón del teclado 3D de nareshkhatri.dev: lo único que se mueve por scroll es
el objeto flotante; el texto scrollea como en cualquier página.

### La coreografía

En `FloatingWindow.tsx`, el array **`STOPS`** define una parada por sección: posición,
giro, escala, qué captura enseña y cuánto se curva el trayecto hasta ella. Ahí se
ajusta todo el movimiento sin tocar nada más.

- Los arcos los traza **`MotionPathPlugin`** con un punto intermedio desplazado
  (`bend`). Sin ese punto, el recorrido sería una línea recta.
- Las posiciones van en **porcentaje del viewport**, no en píxeles, para que el arco
  se vea igual en un portátil que en un monitor grande.
- Hay **un disparador por sección** (`start: 'top bottom'` → `end: 'top center'`), no
  una línea repartida a partes iguales: así la ventana llega a cada parada cuando esa
  sección entra en pantalla, sea larga o corta.

**La reversibilidad sale gratis.** Al ir con `scrub`, la animación está atada a la
posición del scroll en lugar de reproducirse sola: subir la deshace sin una línea
extra de código.

### Móvil

Por debajo de 1024px la ventana flotante **no se renderiza**: media pantalla fija no
cabe en un móvil. Cada tarjeta de proyecto enseña entonces su captura en línea
(`lg:hidden`). Es la única duplicación de marcado del proyecto.

---

## Personalizar

Todo el contenido vive en `data/`. No hace falta tocar los componentes.

- **`data/config.ts`** — nombre, WhatsApp, email, enlaces del menú.
  `whatsappNumber` va solo con dígitos: es lo que exige la API de wa.me.
- **`data/projects.ts`** — proyectos.
- **`data/services.ts`** — servicios. `icon` acepta `'web'` o `'shop'`.

Si añades un proyecto, añade también su parada en el array `STOPS` de
`FloatingWindow.tsx` y un `id` en la sección correspondiente.

### Cambiar las imágenes de los proyectos

Las vistas previas actuales (`public/assets/projects/*.svg`) son recreaciones
vectoriales de cada web. Para poner capturas reales: guárdalas a **1600 × 1000 px**
en `public/assets/projects/` y cambia la extensión en `data/projects.ts`.

---

## Las animaciones

| Efecto | Con qué | Dónde |
| --- | --- | --- |
| Letras lanzadas como ladrillos | GSAP, una línea por letra | `Hero.tsx` |
| Giro de dos vueltas al cargar | GSAP `rotateY: 720` | `FloatingWindow.tsx` |
| Arcos entre secciones | `MotionPathPlugin` + `scrub` | `FloatingWindow.tsx` |
| Entradas al hacer scroll | GSAP `ScrollTrigger` | `Projects.tsx`, `Services.tsx` |
| Revelado palabra a palabra | `ScrollTrigger` con `scrub` | `About.tsx` |
| Cursor de dos capas + magnetismo | GSAP `quickTo` | `MagneticCursor.tsx` |
| Blob que invierte lo que pisa | `mix-blend-mode: difference` | `MagneticCursor.tsx` |
| Burbuja que envuelve el CTA | rAF + `getBoundingClientRect` | `MagneticCursor.tsx` |
| Partículas que huyen del ratón | Canvas puro | `ParticleField.tsx` |
| Scroll suave | Lenis sincronizado con GSAP | `SmoothScroll.tsx` |
| Menú que se descifra | `setInterval` + letras al azar | `Navigation.tsx` |

### Cinco trampas que ya costaron caras

**Nunca animes el mismo elemento con dos sistemas.** La ventana lleva dos nodos: el
exterior hace los arcos del scroll y el interior el giro de entrada. Compartir nodo
significa pelearse por la propiedad `transform`.

**Nunca encadenes el scroll al final de una animación de entrada.** Construir la línea
del scroll en un `onComplete` deja la página muerta si esa animación no termina — por
ejemplo al abrir la web en una pestaña en segundo plano, donde el navegador congela
los fotogramas.

**Un `fromTo` colocado a mitad de una línea no aplica su estado inicial hasta que la
reproducción llega ahí.** Para lo que deba arrancar oculto, un `gsap.set()` aparte. Y
en los tweens atados a scroll, `immediateRender: false`, o saltan al cargar.

**El `border-radius` orgánico de ocho valores con barra rompe el parser de GSAP.**
Aborta el efecto entero **sin lanzar ningún error por consola**. La forma del blob va
en la animación CSS `blob-morph`; a GSAP solo se le pasan números.

**Ningún `gsap.to()` dentro de un bucle de `requestAnimationFrame`.** Crear el tween en
cada fotograma lo reinicia antes de que pueda completarse: avanza un 4% y vuelve a
empezar. Era la causa de que la burbuja del cursor fallara de forma intermitente.

---

## Accesibilidad

- El cursor personalizado solo se activa con ratón real (`pointer: fine`) y pantalla
  ≥768px. La clase que oculta el cursor nativo se añade **desde JS**, así que si el
  script falla nunca te quedas sin puntero.
- La ventana flotante lleva `aria-hidden` y `pointer-events: none`: es decorativa y no
  intercepta clics.
- `prefers-reduced-motion` respetado: sin arcos, sin giro, sin ladrillos y sin scroll
  interceptado.
- `<noscript>` que revela todo el contenido si no hay JavaScript.
- El texto troceado en letras lleva el original en `sr-only`: un lector de pantalla lee
  "BRIK", no "B-R-I-K".

---

## Estructura

```
app/
  globals.css      Variables, cursor, utilidades
  layout.tsx       Fuente, metadatos, fondo, navbar, pie
  page.tsx         Ventana flotante + las cinco secciones
components/
  FloatingWindow   La ventana y toda su coreografía de scroll
  MacFrame         El marco de navegador reutilizable
  SiteBackground   Capa fija: degradado + partículas
  Hero · Projects · Services · About · Contact
  MagneticCursor · ParticleField · SplitText
  Navigation      Barra + menú a pantalla completa con descifrado
  EmailButton     Selector Gmail / Outlook / app de correo
  Footer · Logo · SmoothScroll
data/              ← config, projects, services
lib/               gsap (registro + constantes), utils (cn)
public/assets/     Logo e imágenes de proyectos
```

---

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS ·
GSAP 3 + ScrollTrigger + MotionPathPlugin · Framer Motion · Lenis · Inter

---

© BRIK STUDIO
