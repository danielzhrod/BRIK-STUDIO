import { FloatingWindow } from '@/components/FloatingWindow';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';

/**
 * Home de una sola página.
 *
 * Las secciones son de altura normal y scrollean con normalidad, con su
 * contenido en la mitad izquierda. La ventana de navegador vive aparte,
 * en una capa fija sobre la mitad derecha, y va describiendo arcos entre
 * sección y sección sin desmontarse nunca.
 */
export default function HomePage() {
  return (
    <>
      <FloatingWindow />
      <Hero />
      <Projects />
      <Services />
      <About />
      <Contact />
    </>
  );
}
