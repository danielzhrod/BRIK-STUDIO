'use client';

import { useEffect, useRef } from 'react';

import { BP, gsap, hasFinePointer, prefersReducedMotion } from '@/lib/gsap';

/** Distancia a la que un botón empieza a notar la atracción del ratón. */
const MAGNETIC_RADIUS = 80;
/** Cuánto se deja arrastrar el botón (0 = nada, 1 = pegado al ratón). */
const MAGNETIC_STRENGTH = 0.4;
/** Tope de desplazamiento para que nunca se despegue de su sitio. */
const MAGNETIC_MAX = 15;
/** Margen que la burbuja deja alrededor del botón que envuelve. */
const BUBBLE_PADDING = 14;
/** Crema del blob. Con `difference` es lo que invierte lo que hay debajo. */
const BLOB_COLOR = '#efebe0';
/** Forma de reposo. El latido entre formas lo lleva CSS (`blob-morph`). */
const BLOB_REST_SHAPE = '60% 40% 55% 45% / 45% 55% 45% 55%';

/**
 * =====================================================================
 * CURSOR MAGNÉTICO
 * ---------------------------------------------------------------------
 * Dos capas: un punto que va exacto al ratón y un blob crema que lo
 * persigue con lag y va cambiando de forma.
 *
 * EL TRUCO: el blob lleva `mix-blend-mode: difference`. Invierte lo que
 * tiene debajo en lugar de taparlo. Sobre el fondo oscuro se ve crema;
 * sobre las letras blancas del hero, las vuelve oscuras; sobre un botón
 * blanco, lo pone negro. Un solo mecanismo para todos los casos.
 *
 * Estados, con `data-cursor` en cualquier elemento:
 *   (nada)                blob de 44px que muta de forma
 *   data-cursor="link"    BURBUJA que envuelve el botón y se queda
 *                         pegada a él mientras el magnetismo lo mueve
 *   data-cursor="project" círculo azul de 120px con el texto "VER →"
 *
 * Se desactiva entero en táctiles y con "reducir movimiento".
 * =====================================================================
 */
export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion() || window.innerWidth < BP.mobile) return;

    const dot = dotRef.current;
    const blob = blobRef.current;
    const label = labelRef.current;
    if (!dot || !blob || !label) return;

    // En tablet, todo un poco más discreto.
    const isTablet = window.innerWidth < BP.desktop;
    const baseSize = isTablet ? 32 : 44;
    const dotSize = isTablet ? 6 : 8;

    /*
      OJO con qué le damos a GSAP.
      El centrado va con xPercent/yPercent, NO con las clases translate de
      Tailwind: GSAP reescribe `transform` entero en cada frame y las
      machacaría. Y el `border-radius` orgánico y `mix-blend-mode` van por
      estilo inline, porque GSAP no digiere la sintaxis de ocho valores
      con barra y aborta el efecto entero sin avisar por consola.
    */
    gsap.set(blob, { width: baseSize, height: baseSize, xPercent: -50, yPercent: -50 });
    gsap.set(dot, { width: dotSize, height: dotSize, xPercent: -50, yPercent: -50 });

    blob.style.backgroundColor = BLOB_COLOR;
    blob.style.mixBlendMode = 'difference';
    dot.style.backgroundColor = BLOB_COLOR;
    dot.style.mixBlendMode = 'difference';

    // Ocultamos el cursor nativo solo ahora que el nuestro ya funciona.
    document.documentElement.classList.add('has-custom-cursor');
    gsap.set([dot, blob], { autoAlpha: 0 });

    /*
      `quickTo` precompila la animación una vez y luego solo actualiza el
      valor. Mucho más barato que lanzar un gsap.to() nuevo en cada uno
      de los cientos de eventos de movimiento por segundo.
    */
    const blobX = gsap.quickTo(blob, 'x', { duration: 0.15, ease: 'power2.out' });
    const blobY = gsap.quickTo(blob, 'y', { duration: 0.15, ease: 'power2.out' });

    /** Congela el latido de CSS y fija una forma concreta. */
    const setShape = (radius: string) => {
      blob.classList.add('is-locked');
      blob.style.borderRadius = radius;
    };

    /** Devuelve el blob a su forma que late. */
    const restoreShape = () => {
      blob.classList.remove('is-locked');
      blob.style.borderRadius = BLOB_REST_SHAPE;
    };

    let visible = false;
    /** Botón al que la burbuja está enganchada ahora mismo. */
    let locked: HTMLElement | null = null;
    let lockFrame = 0;
    /** Último tamaño al que se animó, para no re-animar en balde. */
    let lockedW = 0;
    let lockedH = 0;
    const mouse = { x: 0, y: 0 };

    /**
     * Lanza el crecimiento de la burbuja hasta envolver el botón.
     *
     * IMPORTANTE: se llama UNA VEZ por enganche, nunca desde el bucle de
     * animación. Crear el tween en cada frame lo reiniciaba antes de que
     * pudiera completarse —avanzaba un 4% y volvía a empezar—, así que la
     * burbuja se quedaba del tamaño del blob en reposo. Ese era el fallo
     * intermitente: solo "funcionaba" si dejabas el ratón quieto el rato
     * suficiente como para que fuera convergiendo poco a poco.
     */
    const growTo = (rect: DOMRect, el: HTMLElement) => {
      lockedW = rect.width;
      lockedH = rect.height;
      const radius = parseFloat(getComputedStyle(el).borderRadius) || 8;

      gsap.to(blob, {
        width: rect.width + BUBBLE_PADDING * 2,
        height: rect.height + BUBBLE_PADDING * 2,
        duration: 0.4,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      setShape(`${radius + BUBBLE_PADDING}px`);
    };

    /**
     * Bucle que mantiene la burbuja pegada al botón.
     * Solo COLOCA: ni un tween aquí dentro. Hay que releer el rect en cada
     * frame porque el magnetismo está moviendo el botón a la vez.
     */
    const followLocked = () => {
      if (!locked) return;
      const rect = locked.getBoundingClientRect();

      gsap.set(blob, {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });

      // Solo si el botón cambia de tamaño de verdad (resize, otro texto).
      if (Math.abs(rect.width - lockedW) > 1 || Math.abs(rect.height - lockedH) > 1) {
        growTo(rect, locked);
      }

      lockFrame = requestAnimationFrame(followLocked);
    };

    /** Engancha la burbuja a un botón. */
    const lockTo = (el: HTMLElement) => {
      locked = el;
      cancelAnimationFrame(lockFrame);
      growTo(el.getBoundingClientRect(), el);
      followLocked();
    };

    const releaseLock = () => {
      if (!locked) return;
      locked = null;
      lockedW = 0;
      lockedH = 0;
      cancelAnimationFrame(lockFrame);
      restoreShape();
      gsap.to(blob, {
        width: baseSize,
        height: baseSize,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
      // Vuelve a engancharse al ratón allí donde esté.
      blobX(mouse.x);
      blobY(mouse.y);
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;

      if (!visible) {
        visible = true;
        gsap.to([dot, blob], { autoAlpha: 1, duration: 0.3 });
      }

      // El punto va siempre exacto, esté la burbuja donde esté.
      gsap.set(dot, { x: mouse.x, y: mouse.y });

      // Si la burbuja está enganchada a un botón, no sigue al ratón.
      if (!locked) {
        blobX(mouse.x);
        blobY(mouse.y);
      }

      // --- Atracción magnética ---
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((magnet) => {
        const rect = magnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(mouse.x - cx, mouse.y - cy);

        if (distance < rect.width / 2 + MAGNETIC_RADIUS) {
          const dx = gsap.utils.clamp(
            -MAGNETIC_MAX,
            MAGNETIC_MAX,
            (mouse.x - cx) * MAGNETIC_STRENGTH,
          );
          const dy = gsap.utils.clamp(
            -MAGNETIC_MAX,
            MAGNETIC_MAX,
            (mouse.y - cy) * MAGNETIC_STRENGTH,
          );
          gsap.to(magnet, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        } else if (gsap.getProperty(magnet, 'x') !== 0) {
          gsap.to(magnet, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto',
          });
        }
      });
    };

    // --- Cambios de estado según lo que haya bajo el ratón ---
    const onOver = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest?.('[data-cursor]') as HTMLElement | null;
      const state = target?.getAttribute('data-cursor') ?? null;

      if (state === 'link' && target) {
        // Ya enganchada a este mismo botón: no reiniciar nada.
        if (locked !== target) lockTo(target);
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
        return;
      }

      releaseLock();

      if (state === 'project') {
        /*
          Aquí sí quitamos el `difference` y ponemos azul opaco: el texto
          "VER →" tiene que leerse, y con la mezcla invertida quedaría
          ilegible sobre la imagen del proyecto.
        */
        setShape('50%');
        blob.style.mixBlendMode = 'normal';
        blob.style.backgroundColor = '#3b82f6';
        gsap.to(blob, {
          width: 120,
          height: 120,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(label, { autoAlpha: 1, duration: 0.25 });
      } else {
        restoreShape();
        blob.style.mixBlendMode = 'difference';
        blob.style.backgroundColor = BLOB_COLOR;
        gsap.to(blob, {
          width: baseSize,
          height: baseSize,
          duration: 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
      }
    };

    const onDown = () => gsap.to(blob, { scale: 0.8, duration: 0.15, ease: 'power2.out' });
    const onUp = () => gsap.to(blob, { scale: 1, duration: 0.3, ease: 'power2.out' });

    const onLeave = () => {
      visible = false;
      releaseLock();
      gsap.to([dot, blob], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    // Si haces scroll con la burbuja puesta, el botón se va: la soltamos.
    window.addEventListener('scroll', releaseLock, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', releaseLock);
      cancelAnimationFrame(lockFrame);
      document.documentElement.classList.remove('has-custom-cursor');
      gsap.set('[data-magnetic]', { x: 0, y: 0 });
    };
  }, []);

  return (
    <>
      {/* Punto: va exacto al ratón */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full md:block"
      />
      {/* Blob: persigue con lag, muta de forma e invierte lo que pisa */}
      <div
        ref={blobRef}
        aria-hidden="true"
        className="cursor-blob pointer-events-none fixed left-0 top-0 z-[9998] hidden items-center justify-center md:flex"
      >
        <span
          ref={labelRef}
          className="select-none text-[11px] font-semibold uppercase tracking-[0.18em] text-white opacity-0"
        >
          Ver →
        </span>
      </div>
    </>
  );
}
