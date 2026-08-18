'use client';

import { useRef, useState } from 'react';

import { config, whatsappUrl } from '@/data/config';
import { PROJECTS } from '@/data/projects';
import { MacFrame } from '@/components/MacFrame';
import { SplitText } from '@/components/SplitText';
import {
  StageContact,
  StageProject,
  StageProjectsIntro,
  StageServices,
  StageStudio,
} from '@/components/stages';
import { BP, gsap, MOTION, prefersReducedMotion, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * Dominio que muestra la barra de direcciones en cada etapa.
 * Cambiar la URL según avanzas refuerza la idea de que estás navegando
 * dentro de la ventana, no viendo un carrusel de láminas.
 */
const STAGE_URLS = [
  'brik-studio.vercel.app/proyectos',
  PROJECTS[0].link.replace('https://', ''),
  PROJECTS[1].link.replace('https://', ''),
  'brik-studio.vercel.app/servicios',
  'brik-studio.vercel.app/estudio',
  'brik-studio.vercel.app/contacto',
];

/**
 * Momentos del scroll (0 a 1) en los que se cruza de una etapa a la
 * siguiente. Cinco marcas para seis etapas.
 */
const MARKS = [0.2, 0.36, 0.52, 0.68, 0.84];
/** Cuánto dura cada cruce. */
const CROSSFADE = 0.06;
/** Escala de la ventana mientras hace de vista previa en el hero. */
const REST_SCALE = 0.55;

/**
 * =====================================================================
 * SHOWCASE — la ventana como recorrido
 * ---------------------------------------------------------------------
 * Una sola sección muy alta con un panel pegajoso dentro. El panel
 * contiene el titular del hero y la ventana de navegador; el scroll
 * conduce todo:
 *
 *   1. El titular se desvanece hacia arriba
 *   2. La ventana crece hasta ocupar la pantalla y se aplana
 *   3. Dentro van pasando las seis etapas del portafolio
 *
 * Por qué una sola sección y no varias: la ventana tiene que ser EL MISMO
 * elemento del principio al final. Si el hero tuviera su ventana y la
 * galería otra, habría un salto al cambiar de una a otra por muy bien que
 * se disimulara.
 *
 * En móvil no se ancla nada: el panel deja de ser pegajoso, la sección
 * pierde su altura enorme y las etapas se apilan en flujo normal. El
 * scroll anclado en móvil secuestra el gesto del dedo y marea.
 * =====================================================================
 */
export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  /** Capa exterior: la anima el SCROLL (crecimiento). */
  const growRef = useRef<HTMLDivElement>(null);
  /** Capa interior: la anima la CARGA (giro de dos vueltas). */
  const frameRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    // Sin movimiento: todo visible y quieto.
    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll('.letter'), { autoAlpha: 1, y: 0, rotate: 0, scale: 1 });
      gsap.set(section.querySelectorAll('[data-anim]'), { autoAlpha: 1, y: 0 });
      gsap.set(section.querySelectorAll('.stage'), { autoAlpha: 1 });
      gsap.set(section.querySelectorAll('.word'), { opacity: 1, color: '#ffffff' });
      return;
    }

    const ctx = gsap.context(() => {
      // ================= ENTRADA AL CARGAR =================
      const intro = gsap.timeline({ defaults: { ease: MOTION.easeStrong } });

      /*
        LETRAS COMO LADRILLOS
        La curva lo decide todo: con una curva `out` la letra desacelera
        y se posa suave. Va con `power2.in`, que ACELERA hasta el impacto,
        como cualquier cosa lanzada contra una pared. Y el aplastamiento
        arranca justo al acabar el vuelo: si queda hueco, se lee como un
        temblor tardío en vez de como un golpe.
      */
      const letters = gsap.utils.toArray<HTMLElement>('.letter');
      const FLIGHT = 0.42;
      const HIT = 0.08;

      letters.forEach((letter, index) => {
        const fromLeft = index % 2 === 0;
        const spin = gsap.utils.random(38, 72) * (fromLeft ? -1 : 1);
        const drift = gsap.utils.random(150, 230) * (fromLeft ? -1 : 1);

        gsap.set(letter, { transformOrigin: '50% 100%' });

        const brick = gsap
          .timeline()
          .fromTo(
            letter,
            { x: drift, y: -210, rotate: spin, scale: 1.12 },
            { x: 0, y: 0, rotate: 0, scale: 1, duration: FLIGHT, ease: 'power2.in' },
            0,
          )
          .fromTo(letter, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16, ease: 'none' }, 0)
          .to(letter, { scaleY: 0.78, scaleX: 1.14, duration: HIT, ease: 'power2.out' }, FLIGHT)
          .to(
            letter,
            { scaleY: 1, scaleX: 1, duration: 0.62, ease: 'elastic.out(1.1, 0.38)' },
            FLIGHT + HIT,
          );

        intro.add(brick, 0.25 + index * 0.065);
      });

      intro
        .fromTo('[data-anim="tagline"]', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.15)
        .fromTo('[data-anim="cta"]', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8 }, 1.35);

      /*
        GIRO DE LA VENTANA
        Dos vueltas completas sobre el eje VERTICAL (rotateY). Es lo que
        hace que se muevan los lados izquierdo y derecho —de este a
        oeste— y no los bordes de arriba y abajo, que sería rotateX.
        Necesita `perspective` en el contenedor padre para que el giro se
        vea en volumen y no como un aplastamiento plano.

        DOS CAPAS, A PROPÓSITO: el giro va en el nodo interior y el
        crecimiento del scroll en el exterior. Si compartieran nodo se
        pisarían la propiedad `transform`, y la alternativa —encadenar la
        línea de scroll al final del giro— dejaba la página muerta si el
        giro no llegaba a terminar, como pasa al abrir la web en una
        pestaña en segundo plano, donde el navegador congela los frames.
      */
      /*
        El estado inicial va en un `set` aparte, no en un `fromTo`.
        Un `fromTo` colocado en el segundo 0,45 de la línea NO aplica su
        estado de partida hasta que la reproducción llega ahí: la ventana
        se vería quieta y entera medio segundo y entonces saltaría de
        golpe a estar girada e invisible. Con el `set` arranca ya en su
        sitio desde el primer fotograma.
      */
      gsap.set(frame, { rotateY: 720, scale: 0.9, autoAlpha: 0 });

      intro.to(
        frame,
        { rotateY: 0, scale: 1, autoAlpha: 1, duration: 1.9, ease: 'power3.out' },
        0.45,
      );

      // ================= RECORRIDO CON SCROLL =================
      // Se construye YA, sin esperar a que acabe el giro.
      {
        const mm = gsap.matchMedia();

        mm.add(`(min-width: ${BP.desktop}px)`, () => {
          const stages = gsap.utils.toArray<HTMLElement>('.stage');
          gsap.set(stages, { autoAlpha: 0 });
          gsap.set(stages[0], { autoAlpha: 1 });
          gsap.set(growRef.current, { scale: REST_SCALE, y: 320 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1,
              // Redondea el progreso a la etapa que toca para la barra
              // de direcciones, sin re-renderizar en cada píxel.
              onUpdate: (self) => {
                const p = self.progress;
                let index = 0;
                for (let i = 0; i < MARKS.length; i++) if (p >= MARKS[i]) index = i + 1;
                setStage(index);
              },
            },
          });

          // 1. El titular se va y la ventana ocupa la pantalla.
          tl.to(copyRef.current, { y: -140, autoAlpha: 0, ease: 'none', duration: 0.09 }, 0).to(
            growRef.current,
            { scale: 1, y: 0, ease: 'none', duration: 0.12 },
            0,
          );

          // 2. Cruces entre etapas.
          stages.forEach((el, index) => {
            if (index === 0) return;
            const at = MARKS[index - 1];
            tl.to(
              stages[index - 1],
              { autoAlpha: 0, y: -40, duration: CROSSFADE, ease: 'none' },
              at,
            ).fromTo(
              el,
              { autoAlpha: 0, y: 40 },
              { autoAlpha: 1, y: 0, duration: CROSSFADE, ease: 'none' },
              at,
            );
          });

          // 3. La frase del estudio se revela palabra a palabra mientras
          //    dura su etapa (entre la marca 4 y la 5).
          tl.to(
            '.word',
            { opacity: 1, color: '#ffffff', stagger: 0.004, duration: 0.1, ease: 'none' },
            MARKS[3] + CROSSFADE,
          );

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        });

        // En móvil y tablet no se ancla nada: las etapas se ven todas.
        mm.add(`(max-width: ${BP.desktop - 1}px)`, () => {
          gsap.set('.stage', { autoAlpha: 1, y: 0 });
          gsap.set(growRef.current, { scale: 1, y: 0 });
          gsap.set('.word', { opacity: 1, color: '#ffffff' });
        });
      }
    }, section);

    // Las fuentes cambian la altura del texto al cargar: sin este
    // refresco, ScrollTrigger se queda con medidas viejas.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className="relative lg:h-[820vh]">
      <div className="overflow-hidden lg:sticky lg:top-0 lg:h-screen">
        {/* ---------- Titular del hero ---------- */}
        <div
          ref={copyRef}
          className="flex min-h-[100dvh] items-center px-6 pt-24 md:px-10 lg:absolute lg:inset-0 lg:z-20 lg:min-h-0 lg:justify-center lg:px-16 lg:pt-0"
        >
          <div className="w-full max-w-[1400px] lg:text-center">
            <h1 className="font-black text-display-sm sm:text-display">
              <SplitText text="BRIK" className="block text-white" />
              <SplitText text="STUDIO" className="block text-outline" />
            </h1>

            <p
              data-anim="tagline"
              className="invisible mt-8 text-label font-normal uppercase text-text-secondary"
              style={{ letterSpacing: '0.25em' }}
            >
              {config.tagline}
            </p>

            <div
              data-anim="cta"
              className="invisible mt-10 flex flex-wrap items-center gap-4 lg:justify-center"
            >
              <a
                href="#proyectos"
                data-magnetic
                data-cursor="link"
                className="group inline-flex items-center gap-2 rounded bg-white px-8 py-3.5 text-[15px] font-semibold text-background-primary transition-[filter] duration-300 hover:brightness-90"
              >
                Ver proyectos
                <span className="transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
                data-cursor="link"
                className="inline-flex items-center gap-2 rounded border border-background-border px-8 py-3.5 text-[15px] font-medium text-text-secondary transition-colors duration-300 hover:border-text-secondary hover:text-white"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ---------- La ventana ---------- */}
        <div className="perspective px-6 pb-24 md:px-10 lg:absolute lg:inset-0 lg:z-10 lg:flex lg:items-center lg:justify-center lg:p-10">
          {/* Capa exterior: crece con el scroll */}
          <div ref={growRef} className="mx-auto w-full max-w-[1400px] will-change-transform">
            {/* Capa interior: gira al cargar */}
            <MacFrame
              ref={frameRef}
              url={STAGE_URLS[stage]}
              className="w-full will-change-transform"
              viewportClassName="lg:aspect-[16/10]"
            >
            <StageProjectsIntro />
            <StageProject project={PROJECTS[0]} />
            <StageProject project={PROJECTS[1]} />
            <StageServices />
              <StageStudio />
              <StageContact />
            </MacFrame>
          </div>
        </div>
      </div>

      {/*
        ANCLAS DE NAVEGACIÓN
        Las secciones ya no existen como bloques independientes: son
        etapas dentro de la ventana. Así que el menú apunta a estos
        puntos vacíos repartidos a lo alto de la sección, colocados en el
        porcentaje de scroll que corresponde a cada etapa.

        El cálculo: progreso = (alto_sección × top%) / (alto_sección − 1
        pantalla). Con 820vh de alto, un `top` del 24% cae en un progreso
        de ~0.27, justo en la etapa de FisioSuab.
      */}
      <div id="proyectos" className="absolute top-[24%] h-px w-px" aria-hidden="true" />
      <div id="servicios" className="absolute top-[63%] h-px w-px" aria-hidden="true" />
      <div id="estudio" className="absolute top-[70%] h-px w-px" aria-hidden="true" />
      <div id="contacto" className="absolute top-[81%] h-px w-px" aria-hidden="true" />
    </section>
  );
}
