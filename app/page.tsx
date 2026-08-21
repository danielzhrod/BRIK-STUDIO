import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { MockupStage } from '@/components/MockupStage';

/**
 * Home de una sola página.
 *
 * El orden termina en `MockupStage` a propósito: ahí la ventana Mac se
 * ancla, gira entre fases enseñando el trabajo y acaba convirtiéndose en
 * el formulario de contacto. Es el final del recorrido, así que todo lo
 * demás va antes.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <About />
      <MockupStage />
    </>
  );
}
