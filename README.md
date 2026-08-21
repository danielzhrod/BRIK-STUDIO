# BRIK STUDIO — Portafolio

> Webs + Tiendas online

Sitio de una página con Next.js 14, TypeScript, Tailwind, GSAP y Lenis. El recorrido
termina en una ventana de navegador que se ancla en pantalla, gira entre fases
enseñando el trabajo y acaba convirtiéndose en el formulario de contacto.

**En producción:** https://brik-studio.vercel.app

---

## Puesta en marcha

```bash
npm install
```

```bash
npm run dev
```

Abre **http://localhost:3000**.

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

## ⚠️ Dos cosas que hay que hacer a mano

### 1. Las cinco imágenes del mockup

Guarda estos archivos en **`public/assets/projects/`** con **exactamente** estos
nombres (1600 × 1000 px, relación 16:10):

```
fisiosuab.jpg               hero de FisioSuab
fisiosuab-2.jpg             hero alternativo, con el equipo médico
glowbysofy.jpg              hero de Glow by Sofy
glowbysofy-portfolio.jpg    galería «Antes de venir, mira lo que hacemos»
glowbysofy-cabello.jpg      sección Cabello + Nail Art
```

Mientras falten, esas fases caen en la recreación vectorial de reserva
(`fisiosuab.svg` / `glowbysofy.svg`) y verás un 404 por archivo en la consola. No se
rompe nada, pero tampoco se ve lo que debería.

### 2. La clave de Web3Forms

Sin ella el formulario valida y avisa, pero **no envía**.

1. Entra en **https://web3forms.com**
2. Escribe **brikstudio@hotmail.com** en «Create Access Key»
3. Te llega la clave a ese correo
4. Créate un `.env.local` con:

```
NEXT_PUBLIC_WEB3FORMS_KEY=tu_access_key
```

5. En Vercel: **Settings → Environment Variables**, la misma variable, y después
   **Redeploy**

El correo de destino **no viaja en el navegador**: Web3Forms lo tiene asociado a la
clave en su panel. Por eso la dirección no aparece en el código del formulario.

---

## Cómo está montada la página

```
app/page.tsx
 ├─ Hero          BRIK STUDIO, los ladrillos que caen
 ├─ Services      qué hacemos
 ├─ About         el estudio, frase que se revela al scroll
 └─ MockupStage   la ventana anclada: 5 fases + formulario   ← el final
```

`MockupStage` es la pieza grande. Ocupa **5 pantallas de scroll** y dentro ancla la
ventana Mac mientras el texto de la izquierda va cambiando de fase.

### Las cuatro transiciones

| | Nombre | Ejes | Qué hace |
| --- | --- | --- | --- |
| A | Moneda | `rotateY` 0→360 | gira sobre su eje vertical |
| B | Carta | `rotateX` pasando por 90 | se voltea hacia atrás |
| C | Tornado | `rotateY` 360→720 + `rotateZ` | gira y se inclina a la vez |
| D | Péndulo | `rotateZ` + `x` | se descuelga y vuelve, ya con el formulario |

**La regla de oro:** la imagen cambia siempre en el **punto medio** del giro, cuando
la ventana está de canto y la pantalla no se ve. Por eso cada cambio va colocado a
mitad del tween que lo precede. Si ocurriera de frente, se vería el salto.

Todo se ajusta desde el array `PHASES` de `MockupStage.tsx`: imagen, respaldo, y el
texto de cada fase.

### El número que gradúa el efecto

La función `build(power)` recibe un solo número que multiplica todas las rotaciones y
escalas: **1 en escritorio, 0.55 en tablet**. Para hacer el efecto más o menos
exagerado, se toca ahí y no en veinte sitios.

### Móvil

Por debajo de 768px **no hay anclaje**: un `pin` con `scrub` en un móvil va a tirones
y secuestra el scroll. Allí cada fase es una tarjeta normal con su imagen, y el
formulario va aparte, a ancho completo.

---

## El formulario y sus cuatro capas de filtro

`components/ContactForm.tsx` — envía por Web3Forms, sin servidor propio.

**1 · Formato** (`lib/validation.ts`, con Zod)
Nombre solo con letras —incluye tildes, ñ, ç y el punt volat catalán—, email con un
patrón estricto, mensaje entre 10 y 1500 caracteres.

**2 · Contenido** (`data/blocklist.ts`)
Insultos y términos de odio en castellano de España y de Latinoamérica, gallego,
euskera, catalán e inglés. Antes de comparar, el texto se normaliza: minúsculas, sin
tildes, sin sustituciones leet (`@→a`, `3→e`, `0→o`) y con las letras repetidas tres o
más veces colapsadas. Así **`p3nd3j0` y `PUUUTA` caen igual que sus formas normales**.

La búsqueda usa **límites de palabra**: sin ellos, «puta» bloquearía «disputa» y
«reputación».

**3 · Anti-robot**
- Campo trampa fuera de pantalla (no `display:none`: hay robots que lo ignoran)
- El `botcheck` propio de Web3Forms
- Tiempo mínimo de relleno: menos de 3 segundos = robot
- Espera de 30 segundos entre envíos
- Máximo 2 enlaces en el mensaje

Cuando salta una de estas, **se finge éxito**: al robot no se le da ninguna pista.

**4 · Accesibilidad**
Errores por campo con `role="alert"`, zona de estado con `aria-live="polite"`, botón
deshabilitado durante el envío y altura reservada para que el error no descoloque el
formulario dentro del marco.

> Los contadores de tiempo viven en `useRef`, **no** en `localStorage`.

### Ampliar la lista de términos

Abre `data/blocklist.ts` y añade la palabra en minúsculas y sin tildes al bloque de su
idioma. Incluye las variantes de género y número cuando cambien de forma
(`tonto`/`tonta`/`tontos`), porque la comparación es sobre la palabra completa.

Si alguien reporta que un mensaje legítimo fue rechazado, lo más probable es que una
palabra corta de la lista aparezca dentro de otra: quítala de ahí antes que relajar
los límites de palabra.

Los dominios de correo temporal están en `data/disposableDomains.ts`.

---

## Personalizar

- **`data/config.ts`** — nombre, WhatsApp, correo, enlaces del menú.

  Ni el teléfono ni el correo se escriben en ninguna parte de la web. El número vive
  solo dentro del enlace `wa.me`, y el correo está **partido en dos**
  (`emailUser` + `emailDomain`): `EmailButton` lo junta al pulsar, así no aparece
  entero en el código y los robots de spam no lo rastrean.
- **`data/services.ts`** — servicios. `icon` acepta `'web'` o `'shop'`.
- **`MockupStage.tsx` → `PHASES`** — las fases del mockup.

---

## Las animaciones

| Efecto | Con qué | Dónde |
| --- | --- | --- |
| Ladrillos que caen y paran en seco | GSAP, una línea por letra | `Hero.tsx` |
| Ventana anclada + 4 giros | `ScrollTrigger` con `pin` y `scrub` | `MockupStage.tsx` |
| Desenfoque de movimiento | `filter: blur` en el punto medio | `MockupStage.tsx` |
| Sombra y resplandor | solo `transform` y `opacity` | `MockupStage.tsx` |
| Revelado palabra a palabra | `ScrollTrigger` con `scrub` | `About.tsx` |
| Cursor de dos capas + magnetismo | GSAP `quickTo` | `MagneticCursor.tsx` |
| Blob que invierte lo que pisa | `mix-blend-mode: difference` | `MagneticCursor.tsx` |
| Burbuja que envuelve el CTA | rAF + `getBoundingClientRect` | `MagneticCursor.tsx` |
| Partículas que huyen del ratón | Canvas puro | `ParticleField.tsx` |
| Scroll suave | Lenis sincronizado con GSAP | `SmoothScroll.tsx` |

### Seis trampas que ya costaron caras

**`backface-visibility: hidden` en `.mac-window` no es decorativo.** Sin ella, al pasar
de los 90 grados se ve la cara de atrás con la captura en espejo y el texto del revés.

**Nunca animes el mismo elemento con dos sistemas.** GSAP y Framer Motion escriben
ambos la propiedad `transform` y se pelean.

**Nunca encadenes el scroll al final de una animación de entrada.** Construir la línea
del scroll en un `onComplete` deja la página muerta si esa animación no termina — por
ejemplo al abrir la web en una pestaña en segundo plano.

**Un `fromTo` a mitad de una línea no aplica su estado inicial hasta llegar ahí.** Para
lo que deba arrancar oculto, un `gsap.set()` aparte.

**El `border-radius` de ocho valores con barra rompe el parser de GSAP.** Aborta el
efecto entero **sin error en consola**. La forma del blob va en CSS.

**Ningún `gsap.to()` dentro de un bucle de `requestAnimationFrame`.** Se reinicia antes
de completarse: avanza un 4% y vuelve a empezar.

---

## Accesibilidad

- El cursor personalizado solo se activa con ratón real (`pointer: fine`) y pantalla
  ≥768px. La clase que oculta el cursor nativo se añade **desde JS**, así que si el
  script falla nunca te quedas sin puntero.
- `prefers-reduced-motion` respetado: sin giros, sin anclaje, sin ladrillos y sin
  scroll interceptado.
- `<noscript>` que revela todo el contenido si no hay JavaScript.
- El texto troceado en letras lleva el original en `sr-only`.
- Menú a pantalla completa con foco atrapado, cierre con Escape y scroll bloqueado
  (parando Lenis además del `overflow`, porque mueve el contenido con `transform`).

---

## Estructura

```
app/
  globals.css      Variables, cursor, ventana 3D, utilidades
  layout.tsx       Fuente, metadatos, fondo, navbar, pie
  page.tsx         Hero → Services → About → MockupStage
components/
  MockupStage      Escenario anclado: 5 fases y las 4 transiciones
  MacWindow        El marco: barra, pantalla y capa del formulario
  ContactForm      Formulario, validación y anti-abuso
  Hero · Services · About
  MagneticCursor · ParticleField · SplitText · SiteBackground
  Navigation · Footer · Logo · EmailButton · SmoothScroll
data/
  config           datos del negocio
  services         servicios
  blocklist        términos bloqueados, por idioma
  disposableDomains  correos temporales y TLDs falsos
lib/
  gsap             registro de plugins + constantes
  validation       esquemas Zod, normalización y anti-abuso
  utils            helper `cn`
public/assets/     Logo e imágenes de proyectos
```

---

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS ·
GSAP 3 + ScrollTrigger + MotionPathPlugin · Lenis · Zod · Web3Forms · Inter

---

© BRIK STUDIO
