import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';

/**
 * Home de una sola página.
 * El orden es intencional: gancho (Hero) → prueba (Proyectos) →
 * oferta (Servicios) → confianza (Estudio) → acción (Contacto).
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
