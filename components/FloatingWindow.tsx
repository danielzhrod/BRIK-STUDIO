'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { PROJECTS } from '@/data/projects';
import { MacFrame } from '@/components/MacFrame';
import { BP, gsap, prefersReducedMotion, ScrollTrigger, useIsomorphicLayoutEffect } from '@/lib/gsap';

/**
 * Coreografía: una parada por sección.
 *
 * `x` e `y` van en PORCENTAJE del viewport, no en píxeles, para que el
 * arco se vea igual en un portátil que en un monitor de 27 pulgadas.
 * `bend` es cuánto se curva el trayecto hasta esa parada: es lo que
 * convierte el recorrido en un arco en vez de en una línea recta.
 */
const STOPS = [
  { id: 'inicio', x: 0, y: 0, rotateY: -12, rotateZ: 0, scale: 1, shot: 0, bend: 0 },
  { id: 'proyectos', x: -1.5, y: -6, rotateY: -4, rotateZ: -2, scale: 1.02, shot: 0, bend: -7 },
  { id: 'proyecto-2', x: 1.5, y: 5, rotateY: 8, rotateZ: 2, scale: 1, shot: 1, bend: 8 },
  { id: 'servicios', x: -2, y: -5, rotateY: -10, rotateZ: -1, scale: 0.94, shot: 1, bend: -8 },
  { id: 'estudio', x: 1, y: 3, rotateY: -2, rotateZ: -3, scale: 0.97, shot: 1, bend: 6 },
  { id: 'contacto', x: 0, y: -2, rotateY: 0, rotateZ: 0, scale: 1.03, shot: 0, bend: -5 },
] as const;

/**
 * =====================================================================
 * VENTANA FLOTANTE
 * ---------------------------------------------------------------------
 * La ventana de navegador acompaña al visitante durante todo el scroll:
 * vive en una capa fija que nunca se desmonta, siempre en la mitad
 * derecha, y va describiendo arcos y girando al pasar de una sección a
 * otra. Los títulos y textos van fuera, a su izquierda.
 *
 * Es el patrón del teclado 3D de nareshkhatri.dev: las secciones son de
 * altura normal y scrollean con normalidad; lo único que se mueve por
 * scroll es este objeto.
 *
 * REVERSIBILIDAD GRATIS: al ir la línea de tiempo con `scrub`, está
 * atada a la posición del scroll en lugar de reproducirse sola. Subir la
 * reproduce hacia atrás sin una sola línea extra de código.
 *
 * No se renderiza por debajo de 1024px: media pantalla fija no cabe en
 * un móvil. Allí cada proyecto enseña su captura en línea.
 * =====================================================================
 */
export function FloatingWindow() {
  const layerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const layer = layerRef.current;
    const frame = frameRef.current;
    const spin = spinRef.current;
    if (!layer || !frame || !spin) return;

    const ctx = gsap.context(() => {
      const shots = gsap.utils.toArray<HTMLElement>('[data-shot]');

      // Sin movimiento: quieta, recta y enseñando la primera captura.
      if (prefersReducedMotion()) {
        gsap.set(spin, { autoAlpha: 1 });
        gsap.set(shots, { autoAlpha: 0 });
        gsap.set(shots[0], { autoAlpha: 1 });
        return;
      }

      /*
        GIRO DE ENTRADA — dos vueltas completas sobre el eje VERTICAL.
        rotateY hace que se muevan los lados izquierdo y derecho, de este
        a oeste; rotateX movería los bordes de arriba y abajo.

        El estado inicial va en un `set` aparte y no en un `fromTo`: un
        `fromTo` colocado más adelante en una línea de tiempo no aplica su
        estado de partida hasta que la reproducción llega ahí, y la
        ventana se vería quieta un instante antes de saltar a girar.
      */
      gsap.set(spin, { rotateY: 720, autoAlpha: 0 });
      gsap.to(spin, {
        rotateY: 0,
        autoAlpha: 1,
        duration: 1.9,
        ease: 'power3.out',
        delay: 0.45,
      });

      /*
        Dos nodos separados a propósito: el giro de entrada va en `spin` y
        los arcos del scroll en `frame`. Si compartieran nodo se pisarían
        la propiedad `transform` y el movimiento saldría a trompicones.
      */
      gsap.set(shots, { autoAlpha: 0 });
      gsap.set(shots[0], { autoAlpha: 1 });
      gsap.set(frame, {
        rotateY: STOPS[0].rotateY,
        rotateZ: STOPS[0].rotateZ,
        scale: STOPS[0].scale,
      });

      const mm = gsap.matchMedia();

      mm.add(`(min-width: ${BP.desktop}px)`, () => {
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;
        const tweens: gsap.core.Tween[] = [];

        /*
          UN DISPARADOR POR SECCIÓN, no una línea de tiempo repartida a
          partes iguales por el documento. Así la ventana llega a cada
          parada justo cuando esa sección entra en pantalla, sin importar
          lo larga o corta que sea.

          Cada salto empieza cuando la sección asoma por abajo y termina
          cuando llega al centro: el movimiento acompaña a la lectura en
          lugar de ir por detrás.
        */
        STOPS.forEach((stop, index) => {
          if (index === 0) return;
          const prev = STOPS[index - 1];
          const target = document.getElementById(stop.id);
          if (!target) return;

          const trigger = {
            trigger: target,
            start: 'top bottom',
            end: 'top center',
            // `scrub` ata la animación al scroll: al subir se deshace.
            scrub: 1,
          } as const;

          /*
            EL ARCO
            El punto de en medio se desplaza en perpendicular al trayecto
            (`bend`) y `curviness` redondea el paso por él. Sin ese punto
            intermedio, MotionPath trazaría una recta y el movimiento
            perdería toda la gracia.
          */
          tweens.push(
            gsap.to(frame, {
              motionPath: {
                path: [
                  { x: prev.x * vw, y: prev.y * vh },
                  {
                    x: ((prev.x + stop.x) / 2 + stop.bend) * vw,
                    y: ((prev.y + stop.y) / 2) * vh,
                  },
                  { x: stop.x * vw, y: stop.y * vh },
                ],
                curviness: 1.5,
              },
              rotateY: stop.rotateY,
              rotateZ: stop.rotateZ,
              scale: stop.scale,
              ease: 'none',
              // Sin esto, el tween aplicaría su punto de partida nada más
              // crearse y la ventana daría un salto al cargar la página.
              immediateRender: false,
              scrollTrigger: trigger,
            }),
          );

          // Cambio de captura, si esta parada enseña otra.
          if (stop.shot !== prev.shot) {
            tweens.push(
              gsap.to(shots[prev.shot], {
                autoAlpha: 0,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: trigger,
              }),
              gsap.to(shots[stop.shot], {
                autoAlpha: 1,
                ease: 'none',
                immediateRender: false,
                scrollTrigger: trigger,
              }),
            );
          }
        });

        return () => {
          tweens.forEach((tween) => {
            tween.scrollTrigger?.kill();
            tween.kill();
          });
        };
      });
    }, layer);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      // `pointer-events-none`: es un elemento decorativo y no debe
      // interceptar clics sobre el contenido que hay debajo.
      className="pointer-events-none fixed inset-y-0 right-0 z-0 hidden w-1/2 items-center justify-center lg:flex"
    >
      <div className="perspective w-[46vw] max-w-[760px] px-6">
        {/* Capa exterior: los arcos del scroll */}
        <div ref={frameRef} className="will-change-transform">
          {/* Capa interior: el giro de entrada */}
          <div ref={spinRef} className="preserve-3d will-change-transform">
            <MacFrame url={PROJECTS[0].link.replace('https://', '')} viewportClassName="aspect-[16/10]">
              {PROJECTS.map((project, index) => (
                <div key={project.id} data-shot={index} className="absolute inset-0">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="46vw"
                    className="object-cover object-top"
                    priority={index === 0}
                  />
                </div>
              ))}
            </MacFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
