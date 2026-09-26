// Secciones de la página, en orden. El `id` es el ancla (#id) de cada <section>.
export const secciones = [
  { id: "pintega", titulo: "Qué es" },
  { id: "agenda", titulo: "Agenda" },
  { id: "ponentes", titulo: "Ponentes" },
  { id: "patrocinadores", titulo: "Patrocinadores" },
  { id: "equipo", titulo: "Equipo" },
  { id: "comunidades", titulo: "Comunidades" },
] as const;

export const enlaceEntradas = { id: "entradas", titulo: "Entradas" } as const;

/** Enlace a una sección de la portada que funciona desde cualquier página (FAQ, legales...). */
export const enlaceSeccion = (id: string) => `/#${id}`;

// Pie. `href: null` = la página aún no existe: se muestra el texto sin enlace (un enlace a "#"
// es un enlace roto). Cuando se cree la página, poner su ruta, p. ej. "/privacidad/" (con barra final, como las URL que genera Astro).
export const enlacesPie: { href: string | null; titulo: string }[] = [
  { href: "/faq/", titulo: "FAQS" },
  { href: "/aviso-legal/", titulo: "AVISO LEGAL" },
  { href: "/privacidad/", titulo: "POLÍTICA DE PRIVACIDAD" },
  { href: "/cookies/", titulo: "POLÍTICA DE COOKIES" },
];
