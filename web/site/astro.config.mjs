// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Web estática: `npm run build` genera dist/ con HTML, CSS, JS e imágenes listos para subir a
// cualquier hosting (sin servidor Node en producción).
export default defineConfig({
  site: "https://pintegaconf.es", // dominio previsto (sin confirmar): URL absolutas de Open Graph y del sitemap

  // sitemap-index.xml con todas las páginas, para los buscadores (enlazado desde public/robots.txt)
  integrations: [sitemap()],

  // Fuentes: Astro las descarga de Google al compilar y las sirve desde nuestro dominio.
  // Así el navegador del visitante nunca contacta con Google (RGPD: la IP es un dato personal).
  fonts: [
    { provider: fontProviders.google(), name: "Arima", cssVariable: "--f-head", weights: [400, 700], subsets: ["latin", "latin-ext"], fallbacks: ["Georgia", "serif"] },
    { provider: fontProviders.google(), name: "Roboto Mono", cssVariable: "--f-mono", weights: [400, 700], subsets: ["latin", "latin-ext"], fallbacks: ["ui-monospace", "monospace"] },
    { provider: fontProviders.google(), name: "Source Sans 3", cssVariable: "--f-sans", weights: [400, 600], subsets: ["latin", "latin-ext"], fallbacks: ["system-ui", "sans-serif"] },
  ],

  build: {
    // CSS siempre en archivos: sin <style> sueltos, la política de seguridad (CSP) puede ser estricta
    inlineStylesheets: "never",
  },

  security: {
    // Content-Security-Policy en un <meta> de cada página. Astro añade los hashes de sus propios
    // scripts y estilos; todo lo demás solo puede venir de nuestro dominio.
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
});
