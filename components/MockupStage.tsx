'use client';

import { useEffect, useRef } from 'react';

import { MacWindow } from '@/components/MacWindow';
import { ContactForm } from '@/components/ContactForm';
import { BP, gsap, prefersReducedMotion, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';

const DIR = '/assets/projects';

/**
 * Las cinco fases del recorrido.
 *
 * `src` es lo que se ve en la pantalla del Mac; el cambio ocurre siempre
 * en mitad del giro, cuando la ventana está de canto y no se ve nada.
 *
 * IMÁGENES: guarda los cinco archivos en `public/assets/projects/`. Si
 * alguno falta, esa fase cae en la recreación vectorial de reserva
 * (`fallback`) en lugar de quedarse en blanco.
 */
const PHASES = [
  {
    src: `${DIR}/fisiosuab.jpg`,
    fallback: `${DIR}/fisiosuab.svg`,
    url: 'fisiosuab.vercel.app',
    eyebrow: 'Proyecto 01',
    title: 'FisioSuab',
    text: 'Landing para una clínica de fisioterapia en Valladolid, pensada para llenar la agenda de pacientes.',
  },
  {
    src: `${DIR}/glowbysofy.jpg`,
    fallback: `${DIR}/glowbysofy.svg`,
    url: 'glowbysofy.vercel.app',
    eyebrow: 'Proyecto 02',
    title: 'Glow by Sofy',
    text: 'Landing para un salón de belleza premium. Estética editorial y reserva de cita en un clic.',
  },
  {
    src: `${DIR}/glowbysofy-portfolio.jpg`,
    fallback: `${DIR}/glowbysofy.svg`,
    url: 'glowbysofy.vercel.app',
    eyebrow: 'Lo que importa',
    title: 'Galerías que convierten',
    text: 'Enseñar el trabajo hecho vende más que cualquier texto. Por eso cada web lleva su galería bien resuelta.',
  },
  {
    src: `${DIR}/fisiosuab-2.jpg`,
    fallback: `${DIR}/fisiosuab.svg`,
    url: 'fisiosuab.vercel.app',
    eyebrow: 'Cómo trabajamos',
    title: 'Diseño a medida',
    text: 'Ni plantillas ni piezas recicladas. Cada negocio necesita lo suyo, y eso se nota en el resultado.',
  },
  {
    src: null, // esta fase no enseña imagen: enseña el formulario
    fallback: null,
    url: 'brik-studio.vercel.app/contacto',
    eyebrow: 'Contacto',
    title: '¿Hablamos?',
    text: 'Escríbenos directamente desde aquí y te respondemos en menos de 24 horas.',
  },
] as const;

/** Todas las imágenes que hay que precargar antes de que empiece el scroll. */
const PRELOAD: string[] = PHASES.flatMap((phase) => (phase.src ? [phase.src] : []));

/**
 * =====================================================================
 * ESCENARIO DEL MOCKUP
 * ---------------------------------------------------------------------
 * La ventana se ancla en pantalla durante un tramo largo de scroll y va
 * girando entre fases. Cada giro es distinto:
 *
 *   A · Moneda   rotateY 0→360, la ventana gira sobre su eje vertical
 *   B · Carta    rotateX 0→0 pasando por 90, se voltea hacia atrás
 *   C · Tornado  rotateY 360→720 con rotateZ a la vez
 *   D · Péndulo  se descuelga hacia un lado y vuelve, ya con el formulario
 *
 * LA REGLA DE ORO: la imagen cambia SIEMPRE en el punto medio del giro,
 * cuando la ventana está de canto y la pantalla no se ve. Por eso cada
 * `set` va colocado en `<50%` del tween que lo precede. Si el cambio
 * ocurriera con la pantalla de frente, se vería el salto.
 *
 * En móvil no hay anclaje: un `pin` con `scrub` en un móvil va a tirones
 * y secuestra el scroll. Allí las fases son secciones normales y el
 * formulario va aparte, a ancho completo.
 * =====================================================================
 */
export function MockupStage() {
  const stageRef = useRef<HTMLElement>(null);
  const screenRef = useRef<HTMLImageElement | null>(null);

  /* --- Precarga -----------------------------------------------------
     Sin esto, la primera vez que GSAP cambia el `src` en mitad del giro
     el navegador va a buscar la imagen y la pantalla parpadea en blanco
     justo cuando vuelve a quedar de frente. */
  useEffect(() => {
    let pending = PRELOAD.length;
    if (!pending) return;

    PRELOAD.forEach((src) => {
      const img = new Image();
      const done = () => {
        pending -= 1;
        // Cuando ya están todas, recalculamos: las imágenes pueden haber
        // cambiado la altura de la página.
        if (pending === 0) ScrollTrigger.refresh();
      };
      img.onload = done;
      img.onerror = done; // una que falte no debe dejar colgado el refresco
      img.src = src;
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
      const screen = stage.querySelector<HTMLImageElement>('.mac-screen');
      const texts = gsap.utils.toArray<HTMLElement>('.phase-text');
      if (!screen) return;
      screenRef.current = screen;

      // Solo el primer texto se ve al empezar.
      gsap.set(texts, { autoAlpha: 0, y: 60 });
      gsap.set(texts[0], { autoAlpha: 1, y: 0 });

      if (prefersReducedMotion()) {
        gsap.set('.mac-window', { clearProps: 'transform' });
        gsap.set(texts, { autoAlpha: 1, y: 0 });
        return;
      }

      const mm = gsap.matchMedia();

      /**
       * Construye la línea de tiempo.
       * `power` gradúa lo exagerado que es todo: 1 en escritorio, 0.55 en
       * tablet. Con un solo número se rebaja el efecto entero sin
       * duplicar la coreografía.
       */
      const build = (power: number) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom bottom',
            pin: '.mockup-pinned',
            pinSpacing: true,
            scrub: 1,
          },
        });

        /** Cambia el texto de la izquierda al entrar en una fase. */
        const swapText = (index: number, at: string) => {
          tl.to(texts[index - 1], { autoAlpha: 0, y: -40, duration: 0.4 }, at);
          tl.fromTo(
            texts[index],
            { autoAlpha: 0, y: 60 },
            { autoAlpha: 1, y: 0, duration: 0.5 },
            `${at}+=0.3`,
          );
        };

        /** Desenfoque de movimiento: entra al acelerar y sale al frenar. */
        const blur = (at: string, amount = 5) => {
          tl.to('.mac-window', { filter: `blur(${amount * power}px)`, duration: 0.35 }, at);
          tl.to('.mac-window', { filter: 'blur(0px)', duration: 0.35 }, `${at}+=0.65`);
        };

        /** El resplandor sube en el punto medio y baja al estabilizar. */
        const glow = (at: string) => {
          tl.to('.mac-glow', { opacity: 0.9, duration: 0.4 }, at);
          tl.to('.mac-glow', { opacity: 0, duration: 0.5 }, `${at}+=0.6`);
        };

        /** La sombra se encoge cuando la ventana se aleja. */
        const shadow = (at: string, scale: number) => {
          tl.to('.mac-shadow', { scaleX: scale, opacity: 0.35 + scale * 0.4, duration: 0.5 }, at);
        };

        /* ---------- A · Giro de moneda (eje Y) ---------- */
        tl.addLabel('a', 0);
        tl.to('.mac-window', {
          rotateY: 180,
          rotateZ: 12 * power,
          scale: 1 - 0.25 * power,
          duration: 1,
          ease: 'power2.inOut',
        }, 'a');
        // De canto: aquí no se ve la pantalla y el cambio es invisible.
        tl.call(() => setScreen(1), undefined, 'a+=0.5');
        tl.to('.mac-window', {
          rotateY: 360,
          rotateZ: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.inOut',
        }, 'a+=1');
        blur('a+=0.3');
        glow('a+=0.4');
        shadow('a+=0.5', 1 - 0.3 * power);
        swapText(1, 'a+=0.8');

        /* ---------- B · Volteo de carta (eje X) ---------- */
        tl.addLabel('b', 2.2);
        tl.to('.mac-window', {
          rotateX: 90,
          scale: 1 - 0.2 * power,
          duration: 1,
          ease: 'back.inOut(1.4)',
        }, 'b');
        tl.call(() => setScreen(2), undefined, 'b+=0.5');
        tl.to('.mac-window', {
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: 'back.inOut(1.4)',
        }, 'b+=1');
        blur('b+=0.3');
        glow('b+=0.4');
        shadow('b+=0.5', 1 - 0.25 * power);
        swapText(2, 'b+=0.8');

        /* ---------- C · Tornado (Y y Z a la vez) ---------- */
        tl.addLabel('c', 4.4);
        tl.to('.mac-window', {
          rotateY: 540,
          rotateZ: 35 * power,
          scale: 1 - 0.4 * power,
          duration: 1.2,
          ease: 'power4.inOut',
        }, 'c');
        tl.call(() => setScreen(3), undefined, 'c+=0.6');
        tl.to('.mac-window', {
          rotateY: 720,
          rotateZ: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power4.inOut',
        }, 'c+=1.2');
        blur('c+=0.4', 7);
        glow('c+=0.5');
        shadow('c+=0.6', 1 - 0.45 * power);
        swapText(3, 'c+=1');

        /* ---------- D · Péndulo hacia el formulario ---------- */
        tl.addLabel('d', 7);
        tl.to('.mac-window', {
          rotateZ: -40 * power,
          x: -120 * power,
          scale: 1 - 0.15 * power,
          duration: 0.8,
          ease: 'sine.inOut',
        }, 'd');
        tl.call(() => showForm(true), undefined, 'd+=0.4');
        tl.to('.mac-window', {
          rotateZ: 0,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'sine.inOut',
        }, 'd+=0.8');
        blur('d+=0.25', 4);
        glow('d+=0.35');
        swapText(4, 'd+=0.7');

        // Los campos aparecen escalonados una vez la ventana se estabiliza.
        tl.fromTo(
          '.mac-form-layer form > div, .mac-form-layer form > button',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 },
          'd+=1.4',
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      };

      mm.add(`(min-width: ${BP.desktop}px)`, () => build(1));
      // Tablet: mismo recorrido pero con la mitad de exageración.
      mm.add(`(min-width: ${BP.mobile}px) and (max-width: ${BP.desktop - 1}px)`, () => build(0.55));
    }, stage);

    return () => ctx.revert();
  }, []);

  /** Pone la imagen de una fase, con la recreación vectorial de reserva. */
  function setScreen(index: number) {
    const screen = screenRef.current;
    const phase = PHASES[index];
    if (!screen || !phase?.src) return;
    screen.src = phase.src;
    // Si el archivo aún no existe, no dejamos la pantalla en negro.
    screen.onerror = () => {
      if (phase.fallback) screen.src = phase.fallback;
    };
  }

  /** Enseña u oculta la capa del formulario dentro de la ventana. */
  function showForm(visible: boolean) {
    gsap.to('.mac-form-layer', { autoAlpha: visible ? 1 : 0, duration: 0.3 });
    gsap.to('.mac-screen', { autoAlpha: visible ? 0 : 1, duration: 0.3 });
    const layer = document.querySelector<HTMLElement>('.mac-form-layer');
    if (layer) layer.style.pointerEvents = visible ? 'auto' : 'none';
  }

  return (
    <>
      <section
        ref={stageRef}
        id="proyectos"
        className="mockup-stage relative scroll-mt-24 lg:h-[500vh]"
      >
        {/* --- ESCRITORIO Y TABLET: ventana anclada + textos que cambian --- */}
        <div className="hidden md:block">
          <div className="sticky top-0 flex h-screen items-center">
            <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 px-6 md:px-10 lg:grid-cols-[40%_60%] lg:px-16">
              {/* Textos: todos apilados en el mismo hueco, se turnan */}
              <div className="section-texts relative min-h-[240px]">
                {PHASES.map((phase, index) => (
                  <div
                    key={phase.title}
                    data-phase={index}
                    className="phase-text absolute inset-0 flex flex-col justify-center"
                  >
                    <p className="eyebrow mb-4">{phase.eyebrow}</p>
                    <h2 className="text-h2 font-black text-white">{phase.title}</h2>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary">
                      {phase.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* La ventana. `perspective` en el padre: sin ella los giros
                  se ven planos, sin profundidad ninguna. */}
              <div className="perspective preserve-3d">
                <MacWindow initialSrc={PHASES[0].fallback ?? ''} url={PHASES[0].url} />
              </div>
            </div>
          </div>
        </div>

        {/* --- MÓVIL: sin anclaje, una tarjeta por fase --- */}
        <div className="md:hidden">
          {PHASES.slice(0, 4).map((phase) => (
            <MobilePhase key={phase.title} phase={phase} />
          ))}
        </div>
      </section>

      {/* --- MÓVIL: el formulario, a ancho completo y cómodo --- */}
      <section id="contacto" className="scroll-mt-24 px-6 py-section md:hidden">
        <p className="eyebrow mb-4">{PHASES[4].eyebrow}</p>
        <h2 className="text-h2 font-black text-white">{PHASES[4].title}</h2>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">{PHASES[4].text}</p>
        <div className="mt-8">
          <ContactForm variant="page" />
        </div>
      </section>
    </>
  );
}

/** Una fase en móvil: imagen y texto, sin giros ni anclaje. */
function MobilePhase({ phase }: { phase: (typeof PHASES)[number] }) {
  if (!phase.src) return null;

  return (
    <div className="px-6 py-14">
      <p className="eyebrow mb-3">{phase.eyebrow}</p>
      <h2 className="text-h2 font-black text-white">{phase.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-text-secondary">{phase.text}</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={phase.src}
          alt={`Vista previa de ${phase.title}`}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover object-top"
          onError={(event) => {
            if (phase.fallback) event.currentTarget.src = phase.fallback;
          }}
        />
      </div>
    </div>
  );
}
