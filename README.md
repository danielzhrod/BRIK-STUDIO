# BRIK STUDIO — Portafolio

> Webs profesionales + Tiendas online

Portafolio de una sola página construido con Next.js 14, Tailwind CSS, GSAP y Framer Motion.
Tema oscuro profesional, animaciones suaves y todo el foco puesto en la galería de proyectos.

---

## Puesta en marcha

```bash
npm install
```

```bash
npm run dev
```

Abre **http://localhost:3000** y ya tienes el portafolio funcionando.

> El sitio arranca perfectamente **sin configurar nada**. Las variables de entorno
> solo hacen falta para el formulario de email (opcional): el CTA principal es WhatsApp.

---

## Comandos disponibles

| Comando             | Qué hace                                                |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con recarga en caliente           |
| `npm run build`     | Compila la versión de producción                         |
| `npm run start`     | Sirve la compilación de producción (requiere `build`)    |
| `npm run lint`      | Revisa el código con ESLint                              |
| `npm run typecheck` | Comprueba los tipos de TypeScript sin generar archivos   |

---

## Personalizar el sitio

Todo el contenido vive en la carpeta `data/`. **No hace falta tocar los componentes.**

### 1. Datos del negocio — `data/config.ts`

```ts
export const config = {
  name: 'BRIK STUDIO',
  whatsapp: '+34 681 066 861',
  whatsappNumber: '34681066861', // solo dígitos: lo exige la API de wa.me
  email: '', // ← al rellenarlo aparece solo en Contacto y en el pie
  // ...
};
```

- **Email**: mientras `email` esté vacío, el bloque muestra «Disponible próximamente».
  En cuanto escribas una dirección, se convierte en un enlace `mailto:` automáticamente.
- **Redes sociales**: `linkedin`, `instagram` y `github` vacíos no se pintan en el pie.

### 2. Proyectos — `data/projects.ts`

Para añadir un proyecto, copia un objeto del array y cambia los valores:

```ts
{
  id: 3,
  name: 'Nombre del proyecto',
  description: 'Una o dos líneas explicando qué se hizo.',
  type: 'Landing Page',
  industry: 'Sector del cliente',
  link: 'https://...',
  image: '/assets/projects/mi-proyecto.jpg',
  imageAlt: 'Vista previa de ...',
  year: '2025',
  highlights: ['Beneficio 1', 'Beneficio 2', 'Beneficio 3'],
}
```

La rejilla se adapta sola al número de proyectos (1 columna en móvil, 2 en escritorio).

### 3. Servicios — `data/services.ts`

Mismo sistema. El campo `icon` acepta `'globe'` o `'store'`; para añadir iconos nuevos,
amplía el `ICON_MAP` que hay al principio de `components/Services.tsx`.

---

## Cambiar las imágenes de los proyectos

Las vistas previas actuales (`public/assets/projects/*.svg`) son maquetas vectoriales
hechas con los colores reales de cada web. Para sustituirlas por capturas de pantalla:

1. Haz la captura de la web (recomendado **1600 × 1000 px**, relación 16:10).
2. Guárdala en `public/assets/projects/` como `.jpg` o `.webp`.
3. Actualiza el campo `image` en `data/projects.ts`:

```diff
- image: '/assets/projects/fisiosuab.svg',
+ image: '/assets/projects/fisiosuab.jpg',
```

Next.js se encarga solo de optimizarlas, convertirlas a AVIF/WebP y servir el tamaño
adecuado a cada dispositivo.

---

## Cambiar los colores

Los colores están definidos como variables CSS en `app/globals.css`, en formato
HSL sin la función `hsl()` (es lo que espera Tailwind).

```css
.dark {
  --background: 0 0% 5.9%;    /* #0f0f0f */
  --surface: 0 0% 10.2%;      /* #1a1a1a */
  --primary: 217 91% 60%;     /* #3b82f6 — azul de marca (texto e iconos) */
  --primary-solid: 221 83% 53%; /* #2563eb — azul de relleno (botones) */
  --whatsapp: 160 84% 39%;    /* #10b981 — verde de WhatsApp */
}
```

**Por qué azul y verde a la vez:** el azul es el acento de marca (títulos, enlaces,
botones principales) y el verde queda reservado en exclusiva para WhatsApp. Así el
botón de WhatsApp nunca compite con el resto y siempre se identifica al instante.

**Por qué hay dos azules:** sobre el fondo oscuro, `#3b82f6` se lee de maravilla
como texto (contraste 5,2:1). Pero si lo usamos de fondo con texto blanco encima,
ese blanco solo contrasta 3,7:1 — por debajo del 4,5:1 que exige la WCAG AA. Por eso
los rellenos sólidos usan `--primary-solid` (`#2563eb`, contraste 5,2:1). A simple
vista son el mismo azul; la diferencia solo se nota en el medidor de contraste.

Si cambias `--primary`, actualiza también `primaryColor` en `data/config.ts` y el
color del logo en `app/icon.svg` y `public/assets/logo.svg`.

---

## Formulario de email (opcional)

El sitio funciona sin esto. Si quieres activar el formulario:

1. Copia el ejemplo de variables de entorno:

```bash
cp .env.example .env.local
```

2. Crea una cuenta gratis en [resend.com](https://resend.com) y genera una API key.
3. Rellena `.env.local`:

```
RESEND_API_KEY=re_xxxxxxxxxx
RESEND_FROM="BRIK STUDIO <onboarding@resend.dev>"
CONTACT_EMAIL=tu-correo@ejemplo.com
```

4. Reinicia `npm run dev`.

Si estas variables faltan, la API devuelve un mensaje amable invitando a escribir por
WhatsApp — nunca se rompe la página.

---

## Publicar en Vercel

```bash
npm run build
```

Si compila sin errores, ya puedes desplegar:

```bash
npx vercel deploy --prod
```

O bien, desde la interfaz web:

1. Sube el proyecto a un repositorio de GitHub.
2. Entra en [vercel.com/new](https://vercel.com/new) e importa el repositorio.
3. Vercel detecta Next.js automáticamente: no hay que configurar nada.
4. Si usas el formulario, añade `RESEND_API_KEY`, `RESEND_FROM` y `CONTACT_EMAIL`
   en **Settings → Environment Variables**.
5. Añade también `NEXT_PUBLIC_SITE_URL` con la URL final del sitio (mejora el SEO).

---

## Estructura del proyecto

```
brik-studio-portfolio/
├── app/
│   ├── api/contact/route.ts   API del formulario (Zod + Resend)
│   ├── globals.css            Variables de color y estilos base
│   ├── icon.svg               Favicon
│   ├── layout.tsx             Layout global: fuentes, tema, navbar, pie
│   └── page.tsx               Home (ensambla las secciones)
├── components/
│   ├── ui/                    Primitivos shadcn/ui (Button, Card, Badge)
│   ├── providers/             ThemeProvider (next-themes)
│   ├── Navigation.tsx         Barra fija + menú móvil + selector de tema
│   ├── Hero.tsx               Portada con parallax (GSAP)
│   ├── Projects.tsx           Galería con animaciones de hover
│   ├── Services.tsx           Servicios + proceso de trabajo
│   ├── About.tsx              Sobre nosotros
│   ├── Contact.tsx            WhatsApp + datos de contacto
│   ├── ContactForm.tsx        Formulario de email
│   ├── Footer.tsx             Pie de página
│   ├── Logo.tsx               Isotipo SVG
│   ├── Reveal.tsx             Animación de entrada al hacer scroll
│   └── SmoothScroll.tsx       Scroll suave con Lenis (solo escritorio)
├── data/
│   ├── config.ts              ← datos del negocio
│   ├── projects.ts            ← proyectos del portafolio
│   └── services.ts            ← servicios y proceso
├── lib/
│   ├── contact-schema.ts      Validación compartida cliente/servidor
│   ├── gsap.ts                Registro de GSAP + constantes de animación
│   └── utils.ts               Helper `cn` para clases de Tailwind
└── public/assets/             Imágenes y logo
```

---

## Cómo funcionan las animaciones

| Efecto                        | Con qué                      | Dónde                 |
| ----------------------------- | ---------------------------- | --------------------- |
| Entrada al hacer scroll       | GSAP `ScrollTrigger`         | `components/Reveal.tsx` |
| Parallax de la portada        | GSAP `matchMedia` + `scrub`  | `components/Hero.tsx`   |
| Hover de las tarjetas         | Framer Motion (variantes)    | `components/Projects.tsx` |
| Scroll suave                  | Lenis, sincronizado con GSAP | `components/SmoothScroll.tsx` |
| Pulso del botón de WhatsApp   | Keyframes de Tailwind        | `tailwind.config.ts`  |

Tres decisiones importantes:

- **Lenis solo en escritorio (≥1024 px).** En móvil el scroll nativo ya tiene inercia
  y está acelerado por hardware; interceptarlo con JavaScript empeora el rendimiento
  y rompe gestos del sistema.
- **Sin parallax en móvil.** Las animaciones con `scrub` son las más caras de todas.
- **`prefers-reduced-motion` respetado en todas partes.** Si el sistema del usuario
  pide menos movimiento, el contenido aparece directamente, sin animación.

---

## Accesibilidad

- Enlace «Saltar al contenido» para navegación por teclado.
- Anillo de foco visible y consistente en todos los elementos interactivos.
- Botones y CTAs de **44 px** de alto como mínimo (48–56 px los principales).
- Contraste AA en ambos temas, claro y oscuro.
- Todas las imágenes con texto alternativo descriptivo.

---

## Stack

**Next.js 14** (App Router) · **React 18** · **TypeScript** · **Tailwind CSS** ·
**shadcn/ui** · **GSAP 3** · **Framer Motion** · **Lenis** · **Resend** · **Zod** ·
**next-themes** · **Geist + Inter**

---

© BRIK STUDIO
