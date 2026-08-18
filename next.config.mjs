/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Formatos modernos: Next sirve AVIF/WebP cuando el navegador lo soporta.
    formats: ['image/avif', 'image/webp'],
    // Las vistas previas de los proyectos son SVG propios guardados en /public.
    // Habilitamos SVG y lo blindamos con CSP + descarga forzada, que es la
    // pauta oficial de Next.js. No servimos SVG subidos por terceros.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
