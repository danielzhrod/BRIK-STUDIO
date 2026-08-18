import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';

/**
 * Home de una sola pagina.
 * El orden importa: primero el gancho (Hero), inmediatamente despues la
 * prueba (Proyectos) y al final la accion (Contacto).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Services />
      <About />
      <Contact />
    </>
  );
}
